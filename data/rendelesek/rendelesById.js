import express from 'express';
import http from 'http';
import db from '../db.js';

const getRendelesById = express();
getRendelesById.use(express.json());



getRendelesById.get ('/', async (req, res) => {
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
export default getRendelesById;