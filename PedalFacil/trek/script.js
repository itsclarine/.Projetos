// Preço da diária fixa
const PRECO_DIARIA = 45.00;

// Estado de validação das datas (começa como falso até o usuário selecionar datas corretas)
let dataValida = false;

// Seleção dos elementos do formulário e card inferior
const form = document.getElementById('formReserva');
const dataRetiradaInput = document.getElementById('dataRetirada');
const dataDevolucaoInput = document.getElementById('dataDevolucao');
const calculoDiasTexto = document.getElementById('calculoDiasTexto');
const valorFinalDestaque = document.getElementById('valorFinalDestaque');
const btnConfirmar = document.querySelector('.btn-confirmar'); // Seleciona o botão de envio

// Seleção dos elementos do card do topo
const quantidadeDiasTopo = document.getElementById('quantidadeDiasTopo');
const valorTotalTopo = document.getElementById('valorTotalTopo');

// Função que gerencia o estado visual e interativo do botão
function gerenciarBotao(ativar) {
  if (ativar) {
    dataValida = true;
    btnConfirmar.disabled = false;
    btnConfirmar.style.backgroundColor = "#27ae60"; // Volta para a cor verde original
    btnConfirmar.style.cursor = "pointer";
    btnConfirmar.textContent = "Confirmar reserva";
  } else {
    dataValida = false;
    btnConfirmar.disabled = true; // Desativa o clique no botão
    btnConfirmar.style.backgroundColor = "#95a5a6"; // Deixa o botão cinza
    btnConfirmar.style.cursor = "not-allowed";
    btnConfirmar.textContent = "Selecione datas válidas";
  }
}

// Configuração inicial do botão ao carregar a página (começa desativado se as datas estiverem vazias)
gerenciarBotao(false);

// Função que calcula os dias e atualiza os preços na tela
function atualizarPrecoTotal() {
  const dataRetirada = new Date(dataRetiradaInput.value);
  const dataDevolucao = new Date(dataDevolucaoInput.value);

  // Verifica se ambas as datas foram preenchidas
  if (dataRetiradaInput.value && dataDevolucaoInput.value) {
    const diferencaTempo = dataDevolucao - dataRetirada;
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    if (diferencaDias > 0) {
      const precoTotal = diferencaDias * PRECO_DIARIA;
      const precoFormatado = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
      const textoDias = `${diferencaDias} ${diferencaDias === 1 ? 'dia' : 'dias'}`;

      // 1. Atualiza o Card Verde de Baixo
      calculoDiasTexto.textContent = `${textoDias} × R$ ${PRECO_DIARIA.toFixed(2).replace('.', ',')}`;
      valorFinalDestaque.textContent = precoFormatado;

      // 2. Atualiza o Card do Topo
      if (quantidadeDiasTopo && valorTotalTopo) {
        quantidadeDiasTopo.textContent = textoDias;
        valorTotalTopo.textContent = precoFormatado;
      }

      // Permite a reserva ativando o botão verde
      gerenciarBotao(true);

    } else {
      // Caso a data seja inválida (ex: devolução antes ou igual à retirada)
      calculoDiasTexto.textContent = "Data inválida";
      valorFinalDestaque.textContent = "R\$ 0,00";
      
      if (quantidadeDiasTopo && valorTotalTopo) {
        quantidadeDiasTopo.textContent = "0 dias";
        valorTotalTopo.textContent = "R\$ 0,00";
      }

      // Bloqueia a reserva deixando o botão cinza
      gerenciarBotao(false);
    }
  } else {
    // Caso algum dos campos de data seja limpo pelo usuário
    gerenciarBotao(false);
  }
}

// Escuta as mudanças nos campos de data para recalcular na hora
dataRetiradaInput.addEventListener('change', atualizarPrecoTotal);
dataDevolucaoInput.addEventListener('change', atualizarPrecoTotal);

// Escuta o envio do formulário
form.addEventListener('submit', function(event) {
  // Segunda camada de segurança: bloqueia o submit se a flag dataValida for falsa
  if (!dataValida) {
    event.preventDefault();
    alert("Não é possível realizar a reserva. Verifique o período selecionado!");
    return;
  }

  event.preventDefault(); // Impede o recarregamento padrão da página

  const dadosReserva = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    total: valorFinalDestaque.textContent
  };

  console.log("Dados prontos para envio:", dadosReserva);
  alert(`Reserva confirmada para ${dadosReserva.nome}! Total: ${dadosReserva.total}`);
});
