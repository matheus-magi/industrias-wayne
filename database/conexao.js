require('dotenv').config()

const mysql = require('mysql2')

const banco = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

banco.connect((erro) => {
    if(erro){
        console.error('Erro ao conectar ao banco: ', erro)
        return
    }
    console.log('Conectado ao mysql')
})

module.exports = banco