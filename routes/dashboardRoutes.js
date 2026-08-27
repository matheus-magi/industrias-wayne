const {Router} = require('express')

const router = Router()
const banco = require('../database/conexao')

router.get('/historico', (req,res) =>{
    banco.query(
        `select historico.*, usuarios.nome as nome_usuario
        from historico
        join usuarios on historico.usuario_id = usuarios.id
        order by historico.data desc`,

        (erro,resultado) => {

            if(erro){
                console.error(erro)
                
                return res.json({
                    mensagem: 'Erro ao acessar o histórico.'
                })
            }

            res.json(resultado)
        }
    )
})

module.exports = router