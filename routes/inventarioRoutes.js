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
        return res.status(400).json({
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

            banco.query(
                'insert into historico (usuario_id,acao,item_id,item_nome) values (?,?,?,?)',
                [req.session.usuario.id, 'Cadastrou', resultado.insertId, nome],
                (erro) => {
                    if(erro){
                        console.error(erro)
                        return res.json({
                            mensagem: 'Item cadastrado, mas não foi possível registrar o histórico.'
                            
                        })
                    }

                    res.json({
                        mensagem: 'Item cadastrado com sucesso!',
                        id: resultado.insertId
                    })
                }   
            )
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
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        })
    }

    banco.query(
        'select * from inventario where id = ?',
        [id],
        (erro,resultado) => {
            if(erro){
                console.error(erro)
                return res.status(500).json({
                    mensagem: 'Erro ao buscar o item.'
                })
            }

            if(resultado.length === 0){
                return res.status(404).json({
                    mensagem: 'Item não encontrado.'
                })
            }

            const itemAntigo = resultado[0]

            const alteracoes = []

            if(itemAntigo.nome !== nome){
                alteracoes.push(`nome de "${itemAntigo.nome}" para "${nome}"`)
            }

            if(itemAntigo.categoria !== categoria){
                alteracoes.push(`categoria de "${itemAntigo.categoria}" para "${categoria}"`)
            }

            if(itemAntigo.quantidade !== Number(quantidade)){
                alteracoes.push(`quantidade de "${itemAntigo.quantidade}" para "${quantidade}"`)
            }

            if(itemAntigo.status !== status){
                alteracoes.push(`status de "${itemAntigo.status}" para "${status}"`)
            }

            if(alteracoes.length === 0){
                return res.status(200).json({
                    mensagem: 'Nenhuma alteração foi realizada.'
                })
            }

            const acao = `Alterou ${alteracoes.join(' e ')}`

            banco.query(
                'update inventario set nome=?, categoria =?, quantidade=?, status=? where id=?',
                [nome, categoria,quantidade, status,id],
                (erro) => {
                    if(erro){
                        console.error(erro)
                        return res.status(500).json({
                            mensagem: 'Falha ao editar o inventário.'
                        })
                    }

                    banco.query(
                        'insert into historico (usuario_id, acao, item_id, item_nome) values (?,?,?,?)',
                        [req.session.usuario.id, acao, id, nome],
                        (erro) => {

                            if(erro){
                                console.error(erro)
                                return res.status(200).json({
                                mensagem: 'Item editado, mas não foi possível registrar o histórico.'
                                })
                            }

                            res.json({
                                mensagem: 'Item editado com sucesso.'
                            })
                        }
                    )
                }
            )
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
        'select * from inventario where id = ?',
        [id],
        (erro,resultado) => {
            if(erro){
                console.error(erro)
                return res.json({
                    mensagem: 'Erro ao buscar o item.'
                })
            }

            if(resultado.length === 0){
                return res.json({
                    mensagem: 'Item não encontrado.'
                })
            }

            const item = resultado[0]

            banco.query(
                'delete from inventario where id = ?',
                [id],
                (erro) =>{
                    if(erro){
                        console.error(erro)
                        return res.json({
                            mensagem: 'Erro ao deletar o item.'
                        })
                    }

                    banco.query(
                        'insert into historico (usuario_id,acao,item_id,item_nome) values (?,?,?,?)',
                        [req.session.usuario.id, 'Deletou', id, item.nome],
                        (erro) =>{

                            if(erro){
                                console.error(erro)
                                return res.json({
                                    mensagem: 'O item foi deletado, mas não foi possível registrar no histórico.'
                                })
                            }

                            res.json({
                            mensagem: 'Item deletado com sucesso.'
                            })
                        }
                    )
                }
            )
        }
    )
})

module.exports = router