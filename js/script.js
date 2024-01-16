// Pega o elemento display do HTML
const display = document.getElementById('display');

// Array para guardar os valores do histórico
const historia = [];

// Índice da posição do calculo do histórico
let historiaIndice = 0;

// Sinalizadores e variáveis para controlar o comportamento da calculadora
let EntrarApenasSimbolos = false;
let ExibindoErro = false;
let UltimoCaracterSinal = false;
let UltimoCaracterNumero = false;
let TemDecimal = false;
let QuantidadeAbreParenteses = 0;

// Sinalizadores para os diferentes modos
let ModoTemperatura = false;
let ModoMoeda = false;

// Função que adiciona valores númericos ao display
function acrescentarNumero(char) {

  // Se a calculadora estiver configurada para aceitar apenas símbolos ou estiver exibindo um erro, retorne vazio
  if (EntrarApenasSimbolos || ExibindoErro) {
    return;
  }

  // Anexa o caractere ao display
  display.value += char;

  // Atualiza sinalizadores
  UltimoCaracterNumero = true;
  UltimoCaracterSinal = false;
}

// Função que adiciona ponto decimal ao display
function acrescentarDecimal(char) {

  // Se o display estiver vazio ou exibindo um erro, retorne vazio
  if (display.value.length === 0 || ExibindoErro) {
    return;
  }

  // Adiciona o ponto se o último caractere é um número e nenhum ponto já foi adicionado a este número
  if (UltimoCaracterNumero && !TemDecimal) {
    display.value += char;

    UltimoCaracterSinal = true;
    UltimoCaracterNumero = false;
    TemDecimal = true;
  }

  // Redefine o sinalizador que permite apenas símbolos
  EntrarApenasSimbolos = false;
}

// Função que adiciona parêntesis ao display
function acrescentarParenteses(botao) {

  const char = botao.textContent;

  // Pega o último caractere do display
  const PegarUltimoCaracter = display.value.slice(-1);

  // Se estiver exibindo um erro, retorna vazio
  if (ExibindoErro) {
    return;
  }

  // Verifica se o último caractere é um ponto decimal antes de adicionar parêntesis
  if (PegarUltimoCaracter !== ".") {
    switch (char) {
      case "(":
        // Se o último caractere for um número ou um fecha-parêntese, adiciona um sinal de multiplicação antes do abre-parêntese
        if (UltimoCaracterNumero || PegarUltimoCaracter === ")") {
          display.value += ("*" + char);

          QuantidadeAbreParenteses += 1;
          EntrarApenasSimbolos = false;
          UltimoCaracterSinal = false;
          UltimoCaracterNumero = false;
          TemDecimal = false;

          break;
        } else if (PegarUltimoCaracter !== "=") {
          // Se o último caractere não é um sinal de igual, adiciona abre-parêntese apenas
          display.value += char;

          QuantidadeAbreParenteses += 1;
          EntrarApenasSimbolos = false;
          UltimoCaracterSinal = false;
          UltimoCaracterNumero = false;
          TemDecimal = false;
          
          break;
        }
      case ")":
        // Se houver parênteses abertos para corresponder e o último caractere não for um abre-parêntese ou um símbolo, adiciona fecha-parêntese
        if (QuantidadeAbreParenteses !== 0 && PegarUltimoCaracter !== "(" && !UltimoCaracterSinal) {
          display.value += char;

          QuantidadeAbreParenteses -= 1;
          EntrarApenasSimbolos = true;
          UltimoCaracterSinal = false;
          UltimoCaracterNumero = false;
          TemDecimal = false;

          break;
        }
    }
  }
}

// Função que manuseia a adição dos operadores ao display
function manejarOperador(botao) {
  
  const char = botao.textContent;

  // Verifica o modo atual e aplica a conversão, se necessário
  switch (true) {
    case display.value.includes("°F"):
      converterFahrenheit(char);

      break;
    case display.value.includes("°C"):
      converterCelsius(char);

      break;
    case display.value.includes("K"):
      converterKelvin(char);

      break;
    case display.value.includes("R$"):
      converterReal(char);

      break;
    case display.value.includes("$"):
      converterDolar(char);

      break;
    case display.value.includes("€"):
      converterEuro(char);

      break;
    case display.value.includes("¥"):
      converterYen(char);

      break;
    default:
      // Se nenhum dos modos de conversão estão ativos, adiciona o operador ao display
      acrescentarOperador(char);

      EntrarApenasSimbolos = false;

      break;
  }

  // Redefine o sinalizador do decimal
  TemDecimal = false;
}

// Função que adiciona operadores ao display
function acrescentarOperador(char) {

  if (ExibindoErro) {
    return;
  }

  // Se o display estiver vazio ou o caractere não for um sinal de menos, retorna vazio
  if (display.value.length === 0 && char !== "-") {
    return;
  }

  // Se a calculadora estiver no modo temperatura, vazia ou o caractere não for um sinal de menos, retorna vazio
  if (ModoTemperatura && display.value.length !== 0 && char === "-") {
    return;
  }

  const PegarUltimoCaracter = display.value.slice(-1);

  // Switch para manusear diferentes operadores
  switch (char) {
    case "÷":
      // Converte o símbolo '÷' para '/'
      char = '/';

      // Se o último caractere não é um abre-parêntese, adiciona o sinal de divisão
      if (PegarUltimoCaracter !== "(") {
        adicionarSinal(char);
      }

      break;
    case "×":
      // Converte o símbolo '×' para '*'
      char = '*';

      // Se o último caractere não é um abre-parêntese, adiciona o sinal de multiplicação
      if (PegarUltimoCaracter !== "(") {
        adicionarSinal(char);
      }

      break;
    case "-":
      // Adiciona o sinal de menos
      adicionarSinal(char);

      break;
    case "+":
      // Adiciona o sinal de mais
      adicionarSinal(char);

      break;
    default:
      // Se o último caractere não é um operador, adiciona o símbolo 
      if (!UltimoCaracterSinal) {
        adicionarSinal(char);
      }
      
      break;
  }
}

// Função que adiciona operadores ao display, considerando o último caractere
function adicionarSinal(char) {

  // Se o último caractere não é um operador, ou a calculadora esta no modo temperatura/moeda, adiciona o operador
  if (!UltimoCaracterSinal || ModoTemperatura || ModoMoeda) {
    display.value += char;

    UltimoCaracterSinal = true;
    UltimoCaracterNumero = false;
  } else if (display.value.length === 1) {
    // bloco vazio, usado para evitar a trocar de operadores caso o sinal de menos tenha sido entrado no início
  } else {
    // Se o último caractere for um operador, substitua-o por um novo operador
    trocarOperador(char);
  }
}

// Função que substitui o operador por um novo operador
function trocarOperador(novoOperador) {

  // Pega o penúltimo caractere do display
  const PegarPenultimoCaracter = display.value.slice(-2, -1);

  // Se o penúltimo caractere for um abre-parêntese e o novo operador for '+' ou '-', substitua-o
  if (PegarPenultimoCaracter === "(") {
    if (novoOperador === "+" || novoOperador === "-") {
      display.value = display.value.slice(0, -1) + novoOperador;
    }
  } else {
    // Caso contrário, substitua o último operador pelo novo operador
    display.value = display.value.slice(0, -1) + novoOperador;
  }
}

// Função que alterna para o modo temperatura
function alternarModoTemperatura() {

  // Limpa o display e define o modo temperatura para o oposto do seu estado atual
  limparValor();
  ModoTemperatura = !ModoTemperatura;
  ModoMoeda = false;

  // Mostra o tutorial e esconde botões desnecessários
  mostrarTutorial();
  esconderBotao();

  // Atualiza os textos do display com base nos modos temperatura e moeda
  const divisao = document.getElementById('divisao');
  const vezes = document.getElementById('vezes');
  const mais = document.getElementById('mais');
  const menos = document.getElementById('menos');
  const ModoTemperatura_id = document.getElementById('temperatura');
  const ModoMoeda_id = document.getElementById('moeda');

  divisao.textContent = ModoTemperatura ? '°F' : '/';
  vezes.textContent = ModoTemperatura ? '°C' : '*';
  menos.textContent = ModoTemperatura ? 'K' : '-';
  mais.textContent = ModoTemperatura ? '-' : '+';
  ModoTemperatura_id.textContent = ModoTemperatura ? '±' : '°C';
  ModoMoeda_id.textContent = ModoMoeda ? '±' : '$';
}

// Funções que convertem as temperaturas com base na unidade selecionada
function converterFahrenheit(char) {

  // Extraí os números, sinal de menos (se presente) e ponto decimal (se presente) do display
  let NumeroModoTemperatura;
  const ExtrairNumero = display.value.match(/-?\d+(\.\d+)?/);

  // Converte a string para float
  if (ExtrairNumero) {
    NumeroModoTemperatura = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  // Converte para Celsius ou Kelvin com base na unidade selecionada
  if (char === "°C") {
    let conversao = (NumeroModoTemperatura - 32) * (5/9);
    display.value = Math.ceil(conversao * 100) / 100 + "°C";
  } else if (char === "K") {
    let conversao = (NumeroModoTemperatura - 32) * (5/9) + 273.15;
    display.value = Math.ceil(conversao * 100) / 100 + "K";
  }

  // Define o sinalizador para permitir apenas símbolos após a conversão
  EntrarApenasSimbolos = true;
}

function converterCelsius(char) {

  // Mesma lógica que converterFahrenheit, mas para converter para Fahrenheit ou Kelvin

  let NumeroModoTemperatura;
  const ExtrairNumero = display.value.match(/-?\d+(\.\d+)?/);

  if (ExtrairNumero) {
    NumeroModoTemperatura = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  if (char === "°F") {
    let conversao = (NumeroModoTemperatura * (9/5)) + 32;
    display.value = Math.ceil(conversao * 100) / 100 + "°F";
  } else if (char === "K") {
    let conversao = NumeroModoTemperatura + 273.15;
    display.value = Math.ceil(conversao * 100) / 100 + "K";
  }

  EntrarApenasSimbolos = true;
}

function converterKelvin(char) {

  // Mesma lógica que converterFahrenheit, mas para converter para Fahrenheit ou Celsius

  let NumeroModoTemperatura;
  const ExtrairNumero = display.value.match(/-?\d+(\.\d+)?/);

  if (ExtrairNumero) {
    NumeroModoTemperatura = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  if (char === "°F") {
    let conversao = (NumeroModoTemperatura - 273.15) * (9/5) + 32;
    display.value = Math.ceil(conversao * 100) / 100 + "°F";
  } else if (char === "°C") {
    let conversao = NumeroModoTemperatura - 273.15;
    display.value = Math.ceil(conversao * 100) / 100 + "°C";
  }

  EntrarApenasSimbolos = true;
}

// Função que alterna para o modo moeda
function alternarModoMoeda() {

  //Mesma lógica que alternarModoTemperatura, mas para o modo moeda

  limparValor();
  ModoMoeda = !ModoMoeda;
  ModoTemperatura = false;

  mostrarTutorial();
  esconderBotao();

  const divisao = document.getElementById('divisao');
  const vezes = document.getElementById('vezes');
  const mais = document.getElementById('mais');
  const menos = document.getElementById('menos');
  const ModoMoeda_id = document.getElementById('moeda');
  const ModoTemperatura_id = document.getElementById('temperatura');

  divisao.textContent = ModoMoeda ? 'R$' : '/';
  vezes.textContent = ModoMoeda ? '$' : '*';
  menos.textContent = ModoMoeda ? '€' : '-';
  mais.textContent = ModoMoeda ? '¥' : '+';
  ModoMoeda_id.textContent = ModoMoeda ? '±' : '$';
  ModoTemperatura_id.textContent = ModoTemperatura ? '±' : '°C';
}

// Funções que convertem as moedas com base na unidade selecionada
function converterReal(char) {

  // Extraí os números e ponto decimal (se presente) do display
  let NumeroModoMoeda;
  const ExtrairNumero = display.value.match(/\d+(\.\d+)?/);

  // Converte a string para float
  if (ExtrairNumero) {
    NumeroModoMoeda = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  // Converte para Dolar, Euro, ou Iene com base na unidade selecionada
  if (char === "$") {
    let conversao = NumeroModoMoeda * 0.205288;
    display.value = Math.ceil(conversao * 100) / 100 + "$";
  } else if (char === "€") {
    let conversao = NumeroModoMoeda * 0.187156;
    display.value = Math.ceil(conversao * 100) / 100 + "€";
  } else if (char === "¥") {
    let conversao = NumeroModoMoeda * 29.80959619;
    display.value = Math.ceil(conversao * 100) / 100 + "¥";
  }

  // Define o sinalizador para permitir apenas símbolos após a conversão
  EntrarApenasSimbolos = true;
}

function converterDolar(char) {

  // Mesma lógica que converterReal, mas para converter para Real, Euros, ou Iene

  let NumeroModoMoeda;
  const ExtrairNumero = display.value.match(/\d+(\.\d+)?/);

  if (ExtrairNumero) {
    NumeroModoMoeda = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  if (char === "R$") {
    let conversao = NumeroModoMoeda * 4.8713;
    display.value = Math.ceil(conversao * 100) / 100 + "R$";
  } else if (char === "€") {
    let conversao = NumeroModoMoeda * 0.911649;
    display.value = Math.ceil(conversao * 100) / 100 + "€";
  } else if (char === "¥") {
    let conversao = NumeroModoMoeda * 145.22994444;
    display.value = Math.ceil(conversao * 100) / 100 + "¥";
  }

  EntrarApenasSimbolos = true;
}

function converterEuro(char) {
  
  // Mesma lógica que converterReal, mas para converter para Real, Dolar, ou Iene

  let NumeroModoMoeda;
  const ExtrairNumero = display.value.match(/\d+(\.\d+)?/);

  if (ExtrairNumero) {
    NumeroModoMoeda = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  if (char === "R$") {
    let conversao = NumeroModoMoeda * 5.341649;
    display.value = Math.ceil(conversao * 100) / 100 + "R$";
  } else if (char === "$") {
    let conversao = NumeroModoMoeda * 1.096669;
    display.value = Math.ceil(conversao * 100) / 100 + "$";
  } else if (char === "¥") {
    let conversao = NumeroModoMoeda * 159.26842281;
    display.value = Math.ceil(conversao * 100) / 100 + "¥";
  }

  EntrarApenasSimbolos = true;
}

function converterYen(char) {

  // Mesma lógica que converterReal, mas para converter para Real, Dolar, ou Euro

  let NumeroModoMoeda;
  const ExtrairNumero = display.value.match(/\d+(\.\d+)?/);

  if (ExtrairNumero) {
    NumeroModoMoeda = ExtrairNumero ? parseFloat(ExtrairNumero[0]) : null;
  }

  if (char === "R$") {
    let conversao = NumeroModoMoeda * 0.033527;
    display.value = Math.ceil(conversao * 10000) / 10000 + "R$";
  } else if (char === "$") {
    let conversao = NumeroModoMoeda * 0.006884;
    display.value = Math.ceil(conversao * 10000) / 10000 + "$";
  } else if (char === "€") {
    let conversao = NumeroModoMoeda * 0.006278;
    display.value = Math.ceil(conversao * 10000) / 10000 + "€";
  }

  EntrarApenasSimbolos = true;
}

// Função que exibe um tutorial baseado no modo atual
function mostrarTutorial() {

  const tutorialTitulo = document.getElementById('tutorial-titulo')
  const tutorial = document.getElementById('tutorial');
  const TamanhoTela = window.matchMedia("(max-width: 480px)");

  switch (true) {
    case ModoTemperatura:
      // Exibe tutorial de conversão da temperatura
      tutorialTitulo.innerHTML = "Como Converter a Temperatura";

      // Ajusta posicionamento do título baseado na resolução da tela
      if (TamanhoTela.matches) {
        tutorialTitulo.style.marginLeft = "87px";
      } else {
        tutorialTitulo.style.marginLeft = "143px";
      }

      tutorial.innerHTML = "Para converter a temperatura, primeiro adicione o valor numérico. Após isso, clique na escala termométrica que o valor numérico corresponde. Então, clique na escala termométrica à qual deseja converter este valor.";

      break;
    case ModoMoeda:
      // Exibe tutorial de conversão da moeda
      tutorialTitulo.innerHTML = "Como Converter a Moeda";

      if (TamanhoTela.matches) {
        tutorialTitulo.style.marginLeft = "112px";
      } else {
        tutorialTitulo.style.marginLeft = "170px";
      }

      tutorial.innerHTML = "Para converter a moeda, primeiro adicione o valor numérico. Após isso, clique na moeda que o valor numérico corresponde. Então, clique na moeda à qual deseja converter este valor.<br><br>Os preços das moedas foram retirados do site da Forbes em 12 de janeiro de 2024.";
      
      break;
    default:
      // Limpa o conteúdo do tutorial se nem o modo temperatura nem o modo moeda estiverem ativos
      tutorialTitulo.innerHTML = null;
      tutorial.innerHTML = null;
  }
}

// Função que oculta ou mostra botões baseado no modo atual
function esconderBotao() {

  const botoes = document.getElementsByClassName('botao-visivel');

  // Loop para iterar sobre cada botão
  for (let i = 0; i < botoes.length; i++) {
    let botao = botoes[i];

    if (ModoTemperatura || ModoMoeda) {
      // Oculta botões com efeito de fade-out
      botao.classList.add('sumido');

      setTimeout(function() {
        botao.style.opacity = 0;
        botao.style.pointerEvents = 'none';
      }, 100);
    } else {
      // Mostra botões com efeito de fade-in
      botao.classList.remove('sumido');

      botao.style.opacity = 1;
      botao.style.pointerEvents = 'auto';
    }
  }
}

// Função que calcula o resultado da expressão no display
function calcularValor() {

  const PegarUltimoCaracter = display.value.slice(-1);
  const regex = /[+\-*/.(]/;

  try {
    // Verifica se o display está vazio
    if (display.value.length === 0) throw "Digite um valor para ver o display";

    // Verifica se a expressão termina com um caractere não numérico
    if (regex.test(PegarUltimoCaracter)) throw "Finalize a expressão com um valor númerico"

    // Adiciona fecha-parênteses para quaisquer abre-parênteses restantes sem correspondência
    if (QuantidadeAbreParenteses !== 0) {
      for (let i = 0; i < QuantidadeAbreParenteses; ) {
        display.value += ")";

        QuantidadeAbreParenteses -= 1;
      }
    }

    // Avalia a expressão usando o construtor de Function do JavaScript
    const resultado = (expressao) => Function('return (' + expressao + ')')();
    
    const expressao = display.value;

    // Atualiza o display com o resultado
    display.value = resultado(expressao);

    // Verifica divisão por zero
    if (isNaN(display.value) || !isFinite(display.value)) throw "Não é possível dividir por zero"

    // Adiciona o resultado ao histórico e atualiza a exibição do histórico
    adicionarHistoria(resultado(expressao));
    atualizarHistoria();

    // Define o sinalizador para permitir apenas símbolos após o cálculo
    EntrarApenasSimbolos = true;
  } catch (err) {
    // Exibe uma mensagem de erro se uma exceção for detectada
    display.value = err;

    ExibindoErro = true;
  }
}

// Função que adiciona um resultado ao array de histórico
function adicionarHistoria(resultadoCalculo) {

  historia[historiaIndice] = resultadoCalculo;
  historiaIndice = (historiaIndice + 1) % 5;
}

// Função que atualiza a exibição do histórico
function atualizarHistoria() {

  const historiaLista = document.getElementById('historia');
  historiaLista.innerHTML = '';

  for (let i = 0; i < historia.length; i++) {
    let botao = document.createElement('button');

    // Adicione um event listener de clique para exibir o item do histórico na calculadora
    botao.addEventListener('click', function() {
      exibirHistoria(this.textContent);
    });

    botao.appendChild(document.createTextNode(historia[i]));
    historiaLista.appendChild(botao);
  }
}

// Função que exibe um item do histórico na calculadora
function exibirHistoria(displayGuardado) {

  // Exibe o item do histórico, se permitido (não no meio de uma expressão)
  if (!EntrarApenasSimbolos && !UltimoCaracterNumero) {
    display.value += displayGuardado;

    UltimoCaracterNumero = true;
    UltimoCaracterSinal = false;

    // Define o sinalizador do decimal se o valor exibido incluir um ponto decimal
    if (display.value.includes(".")) {
      TemDecimal = true;
    }
  }
}

// Função que limpa o display da calculadora e redefine os sinalizadores
function limparValor() {
  
  display.value = '';

  EntrarApenasSimbolos = false;
  ExibindoErro = false;
  UltimoCaracterSinal = false;
  UltimoCaracterNumero = false;
  TemDecimal = false;
  QuantidadeAbreParenteses = 0;
}