import express from 'express';
import http from 'http';
import db from './data/db.js';


const app = express();
app.use(express.json());;
const port = 3000;

app.get ('/rendelesek', async (req, res) => {
    const status = req.query.status;
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
        (!status ||  row.statusz == status)&&
        (!tol || row.datum >= tol)&&
        (!ig || row.datum <= ig)
    );

    

    
    res.json(getTetelekRows);
});

app.get ('/rendelesek/:id', async (req, res) => {
    const id = req.params.id;
    const getRendeles = `SELECT * FROM rendelesek WHERE id = ?`;
    const getTetelek = `SELECT * FROM tetelek WHERE rendeles_id = ?`;
    const getVasarlo = `SELECT * FROM vasarlok WHERE id = ?`;
    const getProduct = `SELECT * FROM termekek WHERE id = ?`;

    let [getRendelesRows] = await db.query(getRendeles, [id]);

    if(getRendelesRows.length == 0) return res.status(404).json({message: "Nincs ilyen rendeles"});

    console.log("getRendelesRows", getRendelesRows);
    
    let eredmeny = await Promise.all(getRendelesRows.map(async id =>{
        const [tetelek] = await db.query(getTetelek, [id.id]);
        const [vasarlo] = await db.query(getVasarlo, [id.vasarlo_id]);
        const összÁr = tetelek.reduce(
            (sum, tétel) => sum + tétel.db * tétel.egysegar,
            0
        );   
        return {
            ...id,
            tetelek,
            vasarlo,
            összár : összÁr
        }
    }));

    console.log(eredmeny);

    let Végeredmény = await Promise.all(eredmeny.map(async id =>{
        const { tetelek, ...rendelesAdatok } = id;
        const tetelekProduct = await Promise.all(id.tetelek.map(async TermekId =>{
            const [getProductValue] = await db.query(getProduct,[TermekId.termek_id])
            return getProductValue;

        }));
        return {
            ...rendelesAdatok,
            termékek: tetelekProduct
        }

    }));
    
    res.json(Végeredmény);


});
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
