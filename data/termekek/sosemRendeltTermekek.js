import express from 'express';
import http from 'http';
import db from '../db.js';

const sosemRendeltTermekek = express();
sosemRendeltTermekek.use(express.json());

sosemRendeltTermekek.get ('/', async (req, res) => {
    const sql = `SELECT * FROM termekek
    WHERE NOT EXISTS(
        SELECT db FROM tetelek
        WHERE tetelek.termek_id = termekek.id
     );`;
    const [sosemRendeltTermekekRows] = await db.query(sql);
    res.json(sosemRendeltTermekekRows);
})
export default sosemRendeltTermekek;