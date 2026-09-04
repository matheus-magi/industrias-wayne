const btnLogout = document.getElementById('btn-logout')
const btnMenu = document.getElementById('btn-menu')
const menuMobile = document.querySelector('.menu-mobile')

btnMenu.addEventListener('click', ()=> {
    menuMobile.classList.toggle('aberto')

    if(menuMobile.classList.contains('aberto')){
        btnMenu.textContent = '✕'
    }else{
        btnMenu.textContent = '☰'
    }
})


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

