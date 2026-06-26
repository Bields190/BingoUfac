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

    elemento.classList.remove(
        "pedra-b",
        "pedra-i",
        "pedra-n",
        "pedra-g",
        "pedra-o",
        "pedra-indefinida"
    );

    elemento.classList.add(obterClassePedra(letra));
}

function formatarNumero(numero) {
    return String(numero).padStart(2, "0");
}

function mostrarPedra(numero, idLetra, idNumero, idPedra) {
    const elementoLetra = document.getElementById(idLetra);
    const elementoNumero = document.getElementById(idNumero);
    const elementoPedra = document.getElementById(idPedra);

    if (!elementoLetra || !elementoNumero || !elementoPedra) return;

    if (numero === undefined || numero === null) {
        elementoLetra.textContent = "?";
        elementoNumero.textContent = "??";

        alterarCorPedra(elementoPedra, "indefinida");
        return;
    }

    const letra = obterLetra(numero);

    elementoLetra.textContent = letra;
    elementoNumero.textContent = formatarNumero(numero);

    alterarCorPedra(elementoPedra, letra);
}

function atualizarTelaPedras() {
    const atual = numerosSorteados[numerosSorteados.length - 1];
    const ultima = numerosSorteados[numerosSorteados.length - 2];
    const penultima = numerosSorteados[numerosSorteados.length - 3];

    mostrarPedra(atual, "letraPedra", "numeroPedra", "pedraAtual");
    mostrarPedra(ultima, "letraUltimaPedra", "numeroUltimaPedra", "pedraUltima");
    mostrarPedra(penultima, "letraPenultimaPedra", "numeroPenultimaPedra", "pedraPenultima");
}

function salvarNumeros() {
    localStorage.setItem("numerosSorteados", JSON.stringify(numerosSorteados));
}

function marcarNumero(botao) {
    const numero = Number(botao.textContent.trim());

    botao.classList.toggle("sorteado");

    if (botao.classList.contains("sorteado")) {
        numerosSorteados.push(numero);
    } else {
        numerosSorteados = numerosSorteados.filter(function (numeroSorteado) {
            return numeroSorteado !== numero;
        });
    }

    salvarNumeros();
    atualizarTelaPedras();
    atualizarTabelaHistorico();

    console.log(numerosSorteados);
}

const botoes = document.querySelectorAll("button.numero-bingo");

botoes.forEach(function (botao) {
    const numero = Number(botao.textContent.trim());

    botao.textContent = String(numero).padStart(2, "0");

    if (numerosSorteados.includes(numero)) {
        botao.classList.add("sorteado");
    }

    botao.addEventListener("click", function () {
        marcarNumero(botao);
    });
});

atualizarTelaPedras();

setInterval(function () {
    numerosSorteados = JSON.parse(localStorage.getItem("numerosSorteados")) || [];

    atualizarTelaPedras();
    atualizarTabelaHistorico();
}, 500);

function limparNumerosSorteados() {
    const confirmar = confirm("Tem certeza que deseja limpar todos os números sorteados?");

    if (!confirmar) {
        return;
    }

    numerosSorteados = [];

    localStorage.setItem("numerosSorteados", JSON.stringify(numerosSorteados));

    const botoesSorteados = document.querySelectorAll(".numero-bingo.sorteado");

    botoesSorteados.forEach(function (botao) {
        botao.classList.remove("sorteado");
    });

    if (typeof atualizarTelaPedras === "function") {
        atualizarTelaPedras();
    }

    console.log("Números sorteados limpos:", numerosSorteados);
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

const botaoLimpar = document.getElementById("btnLimparSorteados");

if (botaoLimpar) {
    botaoLimpar.addEventListener("click", limparNumerosSorteados);
}

function extrairNumeroDaPedra(valor) {
    const texto = valor.trim().toUpperCase().replace(/\s+/g, "");

    if (texto === "") {
        return null;
    }

    const resultado = texto.match(/^([BINGO])?0?(\d{1,2})$/);

    if (!resultado) {
        return null;
    }

    const letraDigitada = resultado[1];
    const numero = Number(resultado[2]);

    if (numero < 1 || numero > 75) {
        return null;
    }

    if (letraDigitada && obterLetra(numero) !== letraDigitada) {
        return null;
    }

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

    const botoes = document.querySelectorAll("button.numero-bingo");

    const botaoEncontrado = Array.from(botoes).find(function (botao) {
        return Number(botao.textContent.trim()) === numero;
    });

    if (!botaoEncontrado) {
        alert("Número não encontrado na tabela.");
        return;
    }

    botaoEncontrado.click();

    input.value = "";
    input.focus();
}

const formPedra = document.getElementById("formPedra");

if (formPedra) {
    formPedra.addEventListener("submit", marcarPedraDigitada);
}