require('dotenv').config()

const express = require('express')
const session = require('express-session')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET
}))

app.use(require('./routes/inventarioRoutes'))
app.use(require('./routes/loginRoutes'))
app.use(require('./routes/usuarioRoutes'))
app.use(require('./routes/dashboardRoutes'))

app.listen(3000, ()=>{
    console.log(`Servidor rodando em localhost:${port}`)
})