let numerosSorteados = JSON.parse(localStorage.getItem("numerosSorteados")) || [];

function obterLetra(numero) {
    if (numero >= 1 && numero <= 15) return "B";
    if (numero >= 16 && numero <= 30) return "I";
    if (numero >= 31 && numero <= 45) return "N";
    if (numero >= 46 && numero <= 60) return "G";
    if (numero >= 61 && numero <= 75) return "O";
}

function obterClassePedra(letra) {
    if (letra === "B") return "pedra-b";
    if (letra === "I") return "pedra-i";
    if (letra === "N") return "pedra-n";
    if (letra === "G") return "pedra-g";
    if (letra === "O") return "pedra-o";
    return "pedra-indefinida";
}

function alterarCorPedra(elemento, letra) {
    if (!elemento) return;
    elemento.classList.remove("pedra-b", "pedra-i", "pedra-n", "pedra-g", "pedra-o", "pedra-indefinida");
    elemento.classList.add(obterClassePedra(letra));
}

function formatarNumero(numero) {
    return String(numero).padStart(2, "0");
}

function mostrarPedra(numero, idLetra, idNumero, idPedra) {
    const elementoLetra = document.getElementById(idLetra);
    const elementoNumero = document.getElementById(idNumero);
    const elementoPedra = document.getElementById(idPedra);

    // Se algum elemento não existir no HTML, avisa no console para ajudar no teste
    if (!elementoLetra || !elementoNumero || !elementoPedra) {
        console.warn(`Elementos não encontrados para os IDs: ${idLetra}, ${idNumero}, ${idPedra}`);
        return;
    }

    // Se o número não existir (ainda não foi sorteado), reseta o visual da pedra
    if (numero === undefined || numero === null) {
        elementoLetra.textContent = "?";
        elementoNumero.textContent = "??";
        alterarCorPedra(elementoPedra, "INDEFINIDA"); // Garante que caia na classe padrão
        return;
    }

    const letra = obterLetra(numero);
    elementoLetra.textContent = letra;
    elementoNumero.textContent = formatarNumero(numero);
    alterarCorPedra(elementoPedra, letra);
}

function atualizarTelaPedras() {
    // Pegando do final para o início do array de sorteados
    const atual = numerosSorteados.length > 0 ? numerosSorteados[numerosSorteados.length - 1] : undefined;
    const ultima = numerosSorteados.length > 1 ? numerosSorteados[numerosSorteados.length - 2] : undefined;
    const penultima = numerosSorteados.length > 2 ? numerosSorteados[numerosSorteados.length - 3] : undefined;

    mostrarPedra(atual, "letraPedra", "numeroPedra", "pedraAtual");
    mostrarPedra(ultima, "letraUltimaPedra", "numeroUltimaPedra", "pedraUltima");
    mostrarPedra(penultima, "letraPenultimaPedra", "numeroPenultimaPedra", "pedraPenultima");
}

function salvarNumeros() {
    localStorage.setItem("numerosSorteados", JSON.stringify(numerosSorteados));
}

function atualizarBotoesDaTabela() {
    const botoes = document.querySelectorAll("button.numero-bingo");
    const numeroAtual = numerosSorteados[numerosSorteados.length - 1];

    botoes.forEach(function (botao) {
        const numero = Number(botao.textContent.trim());
        botao.classList.remove("sorteado", "atual");

        if (numerosSorteados.includes(numero)) {
            botao.classList.add("sorteado");
        }
        if (numero === numeroAtual) {
            botao.classList.add("atual");
        }
    });
}

function atualizarTabelaHistorico() {
    const numerosTabela = document.querySelectorAll(".historico-pedras .numero-bingo");
    const numeroAtual = numerosSorteados[numerosSorteados.length - 1];

    numerosTabela.forEach(function (item) {
        const numero = Number(item.textContent.trim());
        item.textContent = String(numero).padStart(2, "0");
        item.classList.remove("sorteado", "atual");

        if (numerosSorteados.includes(numero)) {
            item.classList.add("sorteado");
        }
        if (numero === numeroAtual) {
            item.classList.add("atual");
        }
    });
}

function marcarNumero(botao) {
    const numero = Number(botao.textContent.trim());

    if (!numerosSorteados.includes(numero)) {
        numerosSorteados.push(numero);
    } else {
        removerNumeroEspecifico(numero);
        return;
    }

    salvarNumeros();
    atualizarTelaPedras();
    atualizarBotoesDaTabela();
    atualizarTabelaHistorico();
}

// INICIALIZAÇÃO DOS BOTÕES DA TABELA
const botoes = document.querySelectorAll("button.numero-bingo");
botoes.forEach(function (botao) {
    const numero = Number(botao.textContent.trim());
    botao.textContent = String(numero).padStart(2, "0");

    botao.addEventListener("click", function () {
        marcarNumero(botao);
    });
});

atualizarTelaPedras();
atualizarBotoesDaTabela();

setInterval(function () {
    numerosSorteados = JSON.parse(localStorage.getItem("numerosSorteados")) || [];
    atualizarTelaPedras();
    atualizarBotoesDaTabela();
    atualizarTabelaHistorico();
}, 500);

// ==========================================
// NOVAS FUNCIONALIDADES: DESFAZER E EXCLUIR
// ==========================================

// 1. Função Desfazer Última Pedra Sorteada
function desfazerUltimaPedra() {
    if (numerosSorteados.length === 0) {
        alert("Nenhum número foi sorteado ainda para desfazer!");
        return;
    }

    const ultimo = numerosSorteados.pop();
    salvarNumeros();
    atualizarTelaPedras();
    atualizarBotoesDaTabela();
    atualizarTabelaHistorico();
}

const btnDesfazer = document.getElementById("btnDesfazer");
if (btnDesfazer) {
    btnDesfazer.addEventListener("click", desfazerUltimaPedra);
}

// 2. Função para remover um número específico por digitação ou clique
function removerNumeroEspecifico(numero) {
    if (!numerosSorteados.includes(numero)) {
        alert("A pedra " + formatarNumero(numero) + " ainda não foi sorteada!");
        return;
    }

    numerosSorteados = numerosSorteados.filter(n => n !== numero);
    salvarNumeros();
    atualizarTelaPedras();
    atualizarBotoesDaTabela();
    atualizarTabelaHistorico();
}

function excluirPedraDigitada() {
    const input = document.getElementById("inputPedra");
    const numero = extrairNumeroDaPedra(input.value);

    if (numero === null) {
        alert("Digite uma pedra válida no campo para excluir. Ex: 05 ou G50.");
        input.select();
        return;
    }

    removerNumeroEspecifico(numero);
    input.value = "";
    input.focus();
}

const btnExcluirDigitado = document.getElementById("btnExcluirDigitado");
if (btnExcluirDigitado) {
    btnExcluirDigitado.addEventListener("click", excluirPedraDigitada);
}

// Funções de Limpar Tudo e Extrair Números
function limparNumerosSorteados() {
    const confirmar = confirm("Tem certeza que deseja limpar todos os números sorteados?");
    if (!confirmar) return;

    numerosSorteados = [];
    salvarNumeros();
    atualizarTelaPedras();
    atualizarBotoesDaTabela();
    atualizarTabelaHistorico();
}

const botaoLimpar = document.getElementById("btnLimparSorteados");
if (botaoLimpar) {
    botaoLimpar.addEventListener("click", limparNumerosSorteados);
}

function extrairNumeroDaPedra(valor) {
    const texto = valor.trim().toUpperCase().replace(/\s+/g, "");
    if (texto === "") return null;

    const resultado = texto.match(/^([BINGO])?0?(\d{1,2})$/);
    if (!resultado) return null;

    const letraDigitada = resultado[1];
    const numero = Number(resultado[2]);

    if (numero < 1 || numero > 75) return null;
    if (letraDigitada && obterLetra(numero) !== letraDigitada) return null;

    return numero;
}

function marcarPedraDigitada(event) {
    event.preventDefault();
    const input = document.getElementById("inputPedra");
    const numero = extrairNumeroDaPedra(input.value);

    if (numero === null) {
        alert("Digite uma pedra válida. Exemplo: 05, 22, G50 ou O75.");
        input.select();
        return;
    }

    if (!numerosSorteados.includes(numero)) {
        numerosSorteados.push(numero);
        salvarNumeros();
        atualizarTelaPedras();
        atualizarBotoesDaTabela();
        atualizarTabelaHistorico();
    } else {
        alert("Essa pedra já foi sorteada!");
    }

    input.value = "";
    input.focus();
}

const formPedra = document.getElementById("formPedra");
if (formPedra) {
    formPedra.addEventListener("submit", marcarPedraDigitada);
}