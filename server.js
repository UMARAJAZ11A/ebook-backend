


const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
const pool = require('./sql');
const ErrorHandler = require('./utils/errorHandler')
const errorMiddleware = require('./middlewares/errors')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

const PORT = process.env.PORT||'5000';

app.use(express.json());

 app.use(cors({ origin : true , originalUrl : 'http://localhost:3000' , credentials : true}));
app.listen(PORT, () => {
    console.log(`sql server is running at port:${PORT}...`);
})

//Set cookie parse
app.use(cookieParser());
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', "localhost:3000");
//   res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//   next();
// });


const bookRouter = require('./routes/books');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');



app.use('/', bookRouter)
app.use('/', userRouter)
app.use('/', authRouter)


// Handle unhandled routes
app.all('*' , (req,res,next) => {

    next(new ErrorHandler(`${req.originalUrl} Route not found`,404));
})

//Middle ware to handle error
app.use(errorMiddleware);