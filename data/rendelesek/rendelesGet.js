import express from 'express';
import http from 'http';
import db from '../db.js';

const getRendeles = express();
getRendeles.use(express.json());

getRendeles.get ('/', async (req, res) => {
    const statusz = req.query.statusz;
    const tol = req.query.tol;
    const ig = req.query.ig;

    

    const getTetelek = `SELECT tetelek.id, DATE_FORMAT(rendeles.datum, '%Y-%m-%d') as datum, rendeles.statusz as statusz, vasarlok.nev as nev,SUM(tetelek.db) AS darab,SUM(db * tetelek.egysegar) as vegosszeg FROM tetelek
        JOIN rendelesek as rendeles ON rendeles.id = tetelek.rendeles_id
        JOIN vasarlok ON vasarlok.id = rendeles.vasarlo_id
        WHERE rendeles.statusz != 'törölve'
        GROUP BY rendeles.id
        ORDER BY vasarlok.nev
    `;
    let [getTetelekRows] = await db.query(getTetelek);

    getTetelekRows = getTetelekRows.filter(row =>
        (!statusz ||  row.statusz == statusz)&&
        (!tol || row.datum >= tol)&&
        (!ig || row.datum <= ig)
    );

    

    
    res.json(getTetelekRows);
});
export default getRendeles;
