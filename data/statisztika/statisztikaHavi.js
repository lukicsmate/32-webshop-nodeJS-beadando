import express from 'express';
import http from 'http';
import db from '../db.js';

const statisztikaHavi = express();
statisztikaHavi.use(express.json());

statisztikaHavi.get ('/', async (req, res) => {
    const selectSQ = `SELECT DATE_FORMAT(datum, '%Y-%m') as honap, COUNT(rendeles_id) as rendelesDb, SUM(db * tetelek.egysegar) as bevetel
    FROM rendelesek
    JOIN tetelek ON rendelesek.id = tetelek.rendeles_id
    GROUP BY honap`;
    const [statisztikaHaviRows] = await db.query(selectSQ);
    res.json(statisztikaHaviRows);
})
export default statisztikaHavi;