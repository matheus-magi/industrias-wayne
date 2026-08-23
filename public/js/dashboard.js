async function carregarDashboard(){

    const resposta = await fetch('/inventario')
    const inventario = await resposta.json()

    const totalRecursos = inventario.length

    if(totalRecursos === 0){
        document.getElementById('total-recursos').textContent = 0
        document.getElementById('recursos-disponiveis').textContent = 0
        document.getElementById('recursos-manutencao').textContent = 0
        
        return
    }
    document.getElementById('total-recursos').textContent = totalRecursos

    const recursosDisponiveis = inventario.filter((item) => item.status === 'Disponível')
    document.getElementById('recursos-disponiveis').textContent = recursosDisponiveis.length

    const recursosManutencao = inventario.filter((item) => item.status === 'Em manutenção')
    document.getElementById('recursos-manutencao').textContent = recursosManutencao.length

    const equipamentos = inventario.filter((item) => item.categoria === 'Equipamento')
    const dispositivosSeguranca = inventario.filter((item) => item.categoria === 'Dispositivo de segurança')
    const veiculos = inventario.filter((item) => item.categoria === 'Veículo')

    const equipamentosBarraWidth = ((equipamentos.length)/totalRecursos) * 100
    const dispositivosSegurancaBarraWidth = ((dispositivosSeguranca.length)/totalRecursos) * 100
    const veiculosBarraWidth = ((veiculos.length)/totalRecursos) * 100
    const disponivelBarraWidth = ((recursosDisponiveis.length)/totalRecursos) * 100
    const manutencaoBarraWidth = ((recursosManutencao.length)/totalRecursos) * 100


    document.getElementById('info-equipamento').textContent = equipamentos.length
    document.getElementById('info-seguranca').textContent = dispositivosSeguranca.length
    document.getElementById('info-veiculo').textContent = veiculos.length
    
    document.getElementById('barra-equipamento').style.width = `${equipamentosBarraWidth}%`
    document.getElementById('barra-seguranca').style.width = `${dispositivosSegurancaBarraWidth}%`
    document.getElementById('barra-veiculo').style.width = `${veiculosBarraWidth}%`

    document.getElementById('info-disponivel').textContent = recursosDisponiveis.length
    document.getElementById('info-manutencao').textContent = recursosManutencao.length

    document.getElementById('barra-disponivel').style.width = `${disponivelBarraWidth}%`
    document.getElementById('barra-manutencao').style.width = `${manutencaoBarraWidth}%`

}

carregarDashboard()