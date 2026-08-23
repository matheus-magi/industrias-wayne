async function pedirDadosUsuario() {
    const resposta = await fetch('/usuario-logado')
    const usuario = await resposta.json()

    document.getElementById('nome-usuario').textContent = usuario.nome
    document.getElementById('cargo-usuario').textContent = usuario.cargo
}

pedirDadosUsuario()