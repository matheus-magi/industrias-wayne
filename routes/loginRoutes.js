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
                return res.status(500).json({
                    mensagem: 'Erro ao realizar login.'
                })
            }
            if(resultado.length > 0){
                const usuarioEncontrado = resultado[0]

                req.session.usuario = {
                    id: usuarioEncontrado.id,
                    nome: usuarioEncontrado.nome,
                    cargo:usuarioEncontrado.cargo
                }

                console.log(req.session.usuario)
                console.log('teste')


                console.log('Login realizado com sucesso!')

                return res.json({
                    mensagem: "Login realizado com sucesso!",
                    usuario: {
                        id: usuarioEncontrado.id,
                        nome: usuarioEncontrado.nome,
                        cargo: usuarioEncontrado.cargo
                    }
                    
                })
            }
            res.status(401).json({
                mensagem: 'Nome de usuário ou senha inválidos.'
            })
        }
    )
})

router.get('/sessao', (req,res) =>{

    if(!req.session.usuario){
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.'
        })
    }

    res.json(req.session.usuario)
})

module.exports = router