import express from 'express';
import http from 'http';
import db from './data/db.js';
import getRendeles from './data/rendelesek/rendelesGet.js';
import getRendelesById from './data/rendelesek/rendelesById.js';
import getVasarlok from './data/vasarlok/getVasarlok.js';
const app = express();
app.use(express.json());;
const port = 3000;




app.use('/rendelesek',getRendeles);

app.use('/rendelesek/:id',getRendelesById);

app.use('/vasarlok',getVasarlok);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
