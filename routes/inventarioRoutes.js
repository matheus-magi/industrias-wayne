const { Router } = require('express')

const router = Router()
const banco = require('../database/conexao')

router.get('/inventario', (req,res) => {

    if(!req.session.usuario){
        return res.status(401).json({
            mensagem:'Usuário não autenticado.'
        })
    }


    banco.query(
        'select * from inventario',
        (erro, resultado) =>{
            if(erro){
                console.error(erro)
                return res.json({
                    mensagem: 'Erro ao acessar o banco de dados.'
                })
                
            }
            res.json(resultado)
        }
    )
})

router.post('/inventario', (req,res) => {

    //verifica se o usuário tá logado e tem a permissão necessária

    if (!req.session.usuario){
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.'
        })
    }

    if (!['Administrador', 'Gerente'].includes(req.session.usuario.cargo)){
        return res.status(403).json({
            mensagem: 'Acesso negado.'
        })
    }

    const {nome, categoria, quantidade, status} = req.body
    
    if(!nome || !categoria || (!quantidade && quantidade !== 0) || !status){
        return res.json({
            mensagem: 'Preencha todos os campos.'
        })
    }

    banco.query(
        'insert into inventario (nome,categoria,quantidade,status) values (?,?,?,?)',
        [nome,categoria,quantidade,status],
        (erro, resultado) => {
            if(erro){
                console.error(erro)
                return res.json({
                    mensagem: 'Erro ao acessar o banco de dados.'
                })
            }
            res.json({
                mensagem: 'Item cadastrado com sucesso!',
                id: resultado.insertId
            })
        }
    )
})

router.put('/inventario/:id', (req,res)=>{

    if (!req.session.usuario){
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.'
        })
    }

    if (!['Administrador', 'Gerente'].includes(req.session.usuario.cargo)){
        return res.status(403).json({
            mensagem: 'Acesso negado.'
        })
    }
    
    const {id} = req.params
    const {nome,categoria,quantidade,status} = req.body

    if(!nome || !categoria || (!quantidade && quantidade !== 0) || !status){
        return res.json({
            mensagem: 'Preencha todos os campos.'
        })
    }

    banco.query(
        'update inventario set nome=?, categoria =?, quantidade=?, status=? where id=?',
        [nome, categoria,quantidade, status,id],
        (erro, resultado) => {
            if(erro){
                console.error(erro)
                return res.json({
                    mensagem: 'Falha ao editar o inventário.'
                })
            }

            if(resultado.affectedRows === 0){
                return res.json({
                    mensagem: 'Item não encontrado'
                })
            }

            res.json({
                mensagem: 'Item editado com sucesso.'
            })
        }
    )
})

router.delete('/inventario/:id', (req,res) =>{

    if(!req.session.usuario){
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.'
        })
    }
    
    if(req.session.usuario.cargo !== "Administrador"){
        return res.status(403).json({
            mensagem: "Acesso negado."
        });
    }

    const {id} = req.params

    banco.query(
        'delete from inventario where id = ?',
        [id],
        (erro, resultado) =>{
            if(erro){
                console.error(erro)
                return res.json({
                    mensagem: 'Erro ao deletar o item.'
                })
            }

            if(resultado.affectedRows === 0){
                return res.json({
                    mensagem:'Item não encontrado.'
                })
            }

            res.json({
                mensagem: 'Item deletado com sucesso.'
            })
        }
    )
})
module.exports = router