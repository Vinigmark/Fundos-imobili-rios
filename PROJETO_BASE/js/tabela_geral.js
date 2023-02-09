let fii_table = [];

async function carregarDadosUser(url){
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos(){
    
    for (let fii of fii_user){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                        .then(resp => resp.json());
        
        fii_table.push(json);  
    }

    exibirTabela();
}

carregarDadosFundos();

function exibirTabela(){ 
    document.querySelector("#loading")

    let totalProvento = 0.00;
    let totalCotas = 0;
    let totalInvestido = 0.00;
    for (let fii of fii_user){
        let fii_detalhe = fii_table.find((item) => item.fundo.indexOf(fii.nome.toUpperCase()) >= 0);
        
        let valorProvento = fii_detalhe.proximoRendimento.rendimento != '-' ? fii_detalhe.proximoRendimento.rendimento : fii_detalhe.ultimoRendimento.rendimento;
        let valorCotacao = fii_detalhe.proximoRendimento.cotaBase != '-' ? fii_detalhe.proximoRendimento.cotaBase : fii_detalhe.ultimoRendimento.cotaBase;
        let precoMedio = Number(fii.totalgasto / fii.qtde).toFixed(2);
        let rendimento = valorProvento * 100 / valorCotacao;
        let classe = "positivo";

        if (rendimento <= 0.60) {
            classe = "negativo";
        }

        totalProvento += (valorProvento * fii.qtde);
        totalCotas += fii.qtde;
        totalInvestido += fii.totalgasto;

        document.querySelector("#table").innerHTML += 
            '<tr class="' + classe + '">' +
                '<td>' + fii.nome.toUpperCase() + '</td>' +
                '<td>' + fii_detalhe.setor + '</td>' +
                '<td>' + fii_detalhe.ultimoRendimento.dataBase + '</td>' +
                '<td>' + fii_detalhe.ultimoRendimento.dataPag + '</td>' +
                '<td> R$' + valorProvento + '</td>' +
                '<td> R$' + valorCotacao + '</td>' +
                '<td>' + fii.qtde + '</td>' +
                '<td> R$' + fii.totalgasto + '</td>' +
                '<td> R$' + precoMedio + '</td>' +
                '<td>' + rendimento.toFixed(2) + '% </td>' +
                '<td>' + fii_detalhe.dividendYield + '% </td>' +
                '<td> R$' + fii_detalhe.rendimentoMedio24M.toFixed(2) + '</td>' +
            '</tr>'
    }

    document.querySelector("#table").innerHTML += 
        '<tr class="TotalDosFundos">' +
            '<td colspan="4">Total Geral</td>' +
            '<td> R$' + totalProvento.toFixed(2) + '</td>' +
            '<td> - </td>' +
            '<td>' + totalCotas + '</td>' +
            '<td> R$' + totalInvestido.toFixed(2) + '</td>' +
            '<td> - </td>' +
            '<td> - </td>' +
            '<td> - </td>' +
            '<td> - </td>' +
        '</tr>'
}