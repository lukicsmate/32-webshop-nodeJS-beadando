import express from 'express';
import http from 'http';
import db from '../db.js';

const getVasarlok = express();
getVasarlok.use(express.json());

getVasarlok.get ('/', async (req, res) => {
    const getVasarlokSQL = `SELECT nev,email,varos, COUNT(rendelesek.id) as rendeles_szam, SUM(tetelek.db * tetelek.egysegar) as rendeles_osszeg
    FROM vasarlok
    JOIN rendelesek ON vasarlok.id = rendelesek.vasarlo_id
    JOIN tetelek ON rendelesek.id = tetelek.rendeles_id
    GROUP BY vasarlok.nev`;

    let [getVasarlokRows] = await db.query(getVasarlokSQL);
    res.json(getVasarlokRows);

})
export default getVasarlok;