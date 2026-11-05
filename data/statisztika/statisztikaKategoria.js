import express from 'express';
import http from 'http';
import db from '../db.js';

const statisztikaKategoria = express();
statisztikaKategoria.use(express.json());

statisztikaKategoria.get('/', async (req, res) => {
    const sql = `SELECT termekek.kategoria, SUM(tet.db) as eladottDb, SUM(tet.db * termekek.ar) as bevetel
    FROM rendelesek
    JOIN tetelek as tet ON rendelesek.id = tet.rendeles_id
    JOIN termekek ON tet.termek_id = termekek.id
    GROUP BY termekek.kategoria`;

    const [kategoria] = await db.query(sql);
    res.json(kategoria);
});
export default statisztikaKategoria;