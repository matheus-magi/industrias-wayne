const { Router } = require('express')

const router = Router()
const banco = require('../database/conexao')

router.get('/usuarios', (req,res) => {
    res.json(
        usuarios.map(usuario =>{
            return{
                id: usuario.id,
                nome: usuario.nome,
                username: usuario.username,
                cargo:usuario.cargo
            }
        })
    )
})

module.exports = router