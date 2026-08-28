const formLogin = document.getElementById('formLogin')
const username = document.getElementById('username')
const senha = document.getElementById('senha')
const mensagemErroLogin = document.getElementById('mensagem-erroLogin')

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault()
    
    const resposta = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            senha: senha.value
        })

    })

    const dados = await resposta.json()

    if(resposta.ok){
        window.location.href = '/dashboard.html'
    } else{
        mensagemErroLogin.textContent = dados.mensagem
    }
})

