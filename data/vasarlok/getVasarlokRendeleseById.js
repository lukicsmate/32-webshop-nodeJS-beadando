import express from 'express';
import http from 'http';
import db from '../db.js';

const getVasarlokRendeleseById = express();
getVasarlokRendeleseById.use(express.json());

getVasarlokRendeleseById.get ('/vasarlok/:id/rendelesek', async (req, res) => {
    const id = req.params.id;
    const selectVasarlo = `SELECT * FROM vasarlok WHERE id = ?`;
    let [vasarloRows] = await db.query(selectVasarlo, [id]);
    if(vasarloRows.length == 0) return res.status(404).json({message: "Nincs ilyen vásárló"});
    console.log("id: ", id);
    const sql = `SELECT COUNT(rendelesek.id) as rendeles
    FROM vasarlok
    JOIN rendelesek ON vasarlok.id = rendelesek.vasarlo_id
    WHERE vasarlok.id = ?
    GROUP BY vasarlok.id`;
    const [getVasarlokRendeleseByIdRows] = await db.query(sql, [id]);
    res.json(getVasarlokRendeleseByIdRows);
})
export default getVasarlokRendeleseById;