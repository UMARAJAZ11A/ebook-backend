const mysql = require('mysql');

const pool = mysql.createPool({
    user : 'uaj90qy00nfxgxjq' ,
    
    password : 'cHauhNG0xZwpj6zNJQD5',
    database : 'boqm8cfcplzznwqau8un',
    host : 'boqm8cfcplzznwqau8un-mysql.services.clever-cloud.com'
})

module.exports = pool ;