const mysql = require('mysql');

const pool = mysql.createPool({
    user : 'root' ,
    password : 'umarSQL@321',
    database : 'data_base',
    host : 'localhost'
})

module.exports = pool ;