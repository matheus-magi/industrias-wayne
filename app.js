const express = require('express')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())
app.use(require('./routes/inventarioRoutes'))
app.use(require('./routes/loginRoutes'))
app.use(require('./routes/usuarioRoutes'))

app.listen(3000, ()=>{
    console.log(`Servidor rodando em localhost:${port}`)
})