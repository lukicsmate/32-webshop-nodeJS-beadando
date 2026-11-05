import express from 'express';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop',
    port: 3306
    
});
export default db;

