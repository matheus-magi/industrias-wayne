const { Router } = require('express')

const router = Router()
const banco = require('../database/conexao')

router.post('/login', (req,res) => {
    
    banco.query(
        'select * from usuarios where username = ? and senha = ?',
        [req.body.username,req.body.senha],
        (erro,resultado) =>{
            if(erro){
                console.error(erro)
                return
            }
            if(resultado.length > 0){
                console.log('Login realizado com sucesso!')
                return res.json({
                    mensagem: "Login realizado com sucesso!"
                })
            }
            res.json({
                mensagem: 'Nome de usuário ou senha inválidos.'
            })
        }
    )
})

module.exports = router