const formCadastro = document.getElementById("formCadastro")
const nomeItem = document.getElementById("nomeItem")
const categoriaItem = document.getElementById("categoriaItem")
const quantidadeItem = document.getElementById("quantidadeItem")
const statusItem = document.getElementById("statusItem")

let itemEditando = null;
const tituloForm = document.getElementById('titulo-formulario')
const btnForm = document.getElementById('btnForm')

async function carregarInventario(){
    const resposta = await fetch('/inventario')
    const itens = await resposta.json()
    console.log(itens)
    const tbody = document.getElementById('tbody')

    tbody.innerHTML = ""

    const respostaSessao = await fetch('/sessao')
    const usuario = await respostaSessao.json()

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
        const btnEditar = document.createElement('button')
        const btnExcluir = document.createElement('button')

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

            alert(dados.mensagem)

            carregarInventario()
        })

        //código do botão editar

        btnEditar.addEventListener('click', () =>{
            itemEditando = item.id

            nomeItem.value = item.nome
            categoriaItem.value = item.categoria
            quantidadeItem.value = item.quantidade
            statusItem.value = item.status

            tituloForm.textContent = 'Editar Item' 
            btnForm.textContent = 'Salvar Alterações'
        })

        tdNome.innerText = item.nome
        tdCategoria.innerText = item.categoria
        tdQuantidade.innerText = item.quantidade
        tdStatus.innerText = item.status

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
        alert(dados.mensagem)

        itemEditando = null
        formCadastro.reset()
        tituloForm.innerText = 'Cadastrar Item' 
        btnForm.textContent = 'Cadastrar'
        carregarInventario()
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
    alert(dados.mensagem)
    formCadastro.reset()
    carregarInventario()
})

carregarInventario()



