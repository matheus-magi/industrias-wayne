const btnLogout = document.getElementById('btn-logout')

if(btnLogout){
    btnLogout.addEventListener('click', async () => {
        const resposta = await fetch('/logout', {
            method: 'POST'
        })

        if(resposta.ok){
            window.location.href = '/index.html'
        }

    })
}


async function pedirDadosUsuario() {
    const resposta = await fetch('/usuario-logado')
    const usuario = await resposta.json()

    document.getElementById('nome-usuario').textContent = usuario.nome
    document.getElementById('cargo-usuario').textContent = usuario.cargo
}

pedirDadosUsuario()

