const formCadastro = document.getElementById("formCadastro")
const nomeItem = document.getElementById("nomeItem")
const categoriaItem = document.getElementById("categoriaItem")
const quantidadeItem = document.getElementById("quantidadeItem")
const statusItem = document.getElementById("statusItem")
const mensagemCadastro = document.getElementById('mensagem-cadastro')

let itemEditando = null;
const tituloForm = document.getElementById('titulo-formulario')
const btnForm = document.getElementById('btnForm')

const statusDisponivel = statusItem.querySelector('option[value="Disponível"]')
const statusManutencao = statusItem.querySelector('option[value="Em manutenção"]')
const statusEsgotado = statusItem.querySelector('option[value="Esgotado"]')

quantidadeItem.addEventListener('input', ()=>{
    if(Number(quantidadeItem.value) === 0){
        statusItem.value = 'Esgotado'
        statusDisponivel.disabled = true
        statusManutencao.disabled = true
        statusEsgotado.disabled = false
    } else{
        statusDisponivel.disabled = false
        statusManutencao.disabled = false
        statusEsgotado.disabled = true

        if(statusItem.value === 'Esgotado'){
            statusItem.value = ''
        }
    }
})


async function carregarInventario(){
    const resposta = await fetch('/inventario')

    if(resposta.status === 401) {
        window.location.href = '/index.html'
        return
    }

    if(!resposta.ok) {
        console.error(`Erro ao carregar inventário: ${resposta.status}`)
        return
    }
    const itens = await resposta.json()
    const tbody = document.getElementById('tbody')

    tbody.innerHTML = ""

    const respostaSessao = await fetch('/sessao')
    const usuario = await respostaSessao.json()

    if(usuario.cargo === 'Funcionário'){
        btnForm.disabled = true
    }

    const isAdministrador = usuario.cargo === 'Administrador'
    const isGerente = usuario.cargo === 'Gerente'

    itens.forEach(item =>{

        //criação das linhas da tabela e dos botões

        const tr = document.createElement('tr')
        const tdNome = document.createElement('td')
        const tdCategoria = document.createElement('td')
        const tdQuantidade = document.createElement('td')
        const tdStatus = document.createElement('td')

        const tdBtn = document.createElement('td')
        tdBtn.classList.add('caixa-btns')

        const btnEditar = document.createElement('button')
        const btnExcluir = document.createElement('button')
        btnEditar.classList.add('btn-editar')
        btnExcluir.classList.add('btn-excluir')

        if(!isAdministrador && !isGerente){
            btnEditar.disabled = true
            btnExcluir.disabled = true
        }

        if(isGerente){
            btnExcluir.disabled = true
        }

        //código do botão excluir

        btnExcluir.addEventListener('click', async () => {

            const confirmar = confirm('Deseja realmente excluir esse item?')
            if(!confirmar){
                return
            }

            const resposta = await fetch(`/inventario/${item.id}`,{
                method: 'DELETE'

            })

            const dados = await resposta.json()

            console.log(dados)

            carregarInventario()
        })

        //código do botão editar

        btnEditar.addEventListener('click', () =>{

        mensagemCadastro.textContent = ''
        mensagemCadastro.classList.remove('erro', 'sucesso')

            itemEditando = item.id

            nomeItem.value = item.nome
            categoriaItem.value = item.categoria
            quantidadeItem.value = item.quantidade
            statusItem.value = item.status

            tituloForm.textContent = 'Editar Item' 
            btnForm.textContent = 'Salvar Alterações'

            window.scrollTo({
                top:0,
                behavior: 'smooth'
            })
        })

        tdNome.innerText = item.nome
        tdCategoria.innerText = item.categoria
        tdQuantidade.innerText = item.quantidade
        tdStatus.innerText = item.status

        if(item.status === 'Disponível'){
            tdStatus.classList.add('status-disponivel')
        } else if(item.status === 'Em manutenção'){
            tdStatus.classList.add('status-manutencao')
        } else if(item.status === 'Esgotado'){
            tdStatus.classList.add('status-esgotado')
        }

        btnEditar.innerText = 'Editar'
        btnExcluir.innerText = 'Excluir'

        tdBtn.append(btnEditar,btnExcluir)
        tr.append(tdNome,tdCategoria,tdQuantidade,tdStatus,tdBtn,)
        tbody.appendChild(tr)
    })
}

formCadastro.addEventListener("submit", async(event) => {
    event.preventDefault()

    if(itemEditando){

        const resposta = await fetch(`/inventario/${itemEditando}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                nome: nomeItem.value,
                categoria: categoriaItem.value,
                quantidade: quantidadeItem.value,
                status: statusItem.value
            })
        })

        const dados = await resposta.json()

        mensagemCadastro.classList.remove('erro','sucesso')

        if(resposta.ok){
            mensagemCadastro.classList.add('sucesso')
            mensagemCadastro.textContent = dados.mensagem

            itemEditando = null
            formCadastro.reset()
            tituloForm.innerText = 'Cadastrar Item' 
            btnForm.textContent = 'Cadastrar'
            carregarInventario()

        }else{
            mensagemCadastro.classList.add('erro')
            mensagemCadastro.textContent = dados.mensagem
        }

        return
    }

    const resposta = await fetch('/inventario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nomeItem.value,
            categoria: categoriaItem.value,
            quantidade: quantidadeItem.value,
            status: statusItem.value
        })
    })

    const dados = await resposta.json()

    mensagemCadastro.classList.remove('erro', 'sucesso')

    if(resposta.ok){
        mensagemCadastro.classList.add('sucesso')
        mensagemCadastro.textContent = dados.mensagem
        formCadastro.reset()
        carregarInventario()

    }else{
        mensagemCadastro.classList.add('erro')
        mensagemCadastro.textContent = dados.mensagem
    }
})

carregarInventario()



