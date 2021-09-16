


const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
const pool = require('./sql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

const PORT = 'https://ebookbackend.herokuapp.com/';

app.use(express.json());

app.use(cors());
app.listen(PORT, () => {
    console.log(`sql server is running at port:${PORT}...`);
})



const loginRouter = require('./routes/login');

const createRouter = require('./routes/create');
const bookRouter = require('./routes/books');


app.use('/', loginRouter)
app.use('/', createRouter)
app.use('/', bookRouter)
