const express = require('express');
const moment = require('moment');

const app = express();
app.use(express.json()); // Para ler o corpo do JSON

// Middleware para logar cada requisição recebida
app.use((req, res, next) => {
  const horarioRequisicao = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(`[${horarioRequisicao}] Requisição recebida: ${req.method} ${req.originalUrl}`);
  next();
});

// Função para calcular o horário de chegada considerando as pausas para o almoço e o limite de horário
const calcularHorarioChegada = (trechos, dadosSaida) => {
  const { data_saida, horario_inicio, horario_fim, duracao_almoco, ignorar_domingos } = dadosSaida;

  let horaChegada = moment(`${data_saida} ${horario_inicio}`, 'YYYY-MM-DD HH:mm'); // Hora de início do primeiro dia
  let duracaoAlmoco = duracao_almoco ? moment.duration(duracao_almoco) : moment.duration(0);

  // Iterar sobre os trechos
  for (const trecho of trechos) {
    const duracaoTrecho = moment.duration(trecho.duracao); // Converter a duração para duração em horas e minutos
    let tempoRestante = duracaoTrecho;

    // Se a viagem ultrapassar o horário de término do dia, ajusta para o próximo dia
    while (horaChegada.hours() + tempoRestante.hours() >= 18) {
      // Ajusta para o próximo dia
      horaChegada.add(1, 'days').set({ hour: 6, minute: 0 }); // Ajusta para o início do próximo dia
      tempoRestante = tempoRestante.subtract(tempoRestante.hours(), 'hours'); // Sobras de tempo no dia atual
    }

    // Considera o tempo de almoço no cálculo
    horaChegada.add(tempoRestante.hours(), 'hours').add(tempoRestante.minutes(), 'minutes');
    horaChegada.add(duracaoAlmoco.hours(), 'hours').add(duracaoAlmoco.minutes(), 'minutes'); // Adiciona o almoço
  }

  return horaChegada;
};

// Rota para calcular o tempo estimado de viagem
app.post('/calcular-tempo', (req, res) => {
  const { dadosSaida, trechos } = req.body;

  // Log do horário de recebimento dos dados
  const horarioRecebido = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(`[${horarioRecebido}] Dados recebidos:`);
  console.log(`  Dados de saída: ${JSON.stringify(dadosSaida)}`);
  console.log(`  Trechos: ${JSON.stringify(trechos)}`);

  if (!trechos || !dadosSaida) {
    return res.status(400).json({ error: 'Trechos e dados de saída são obrigatórios.' });
  }

  const resultado = trechos.map((trecho) => {
    const horaChegada = calcularHorarioChegada(trecho.trechos, dadosSaida);
    const dataChegada = horaChegada.format('YYYY-MM-DD');
    const horaChegadaFormatada = horaChegada.format('HH:mm');

    return {
      "CIDADE SAÍDA": trecho.trechos[0].origem,
      "CIDADE DESTINO": trecho.trechos[trecho.trechos.length - 1].destino,
      "HORA SAÍDA": dadosSaida.horario_inicio,
      "DATA SAÍDA": dadosSaida.data_saida,
      "HORA CHEGADA": horaChegadaFormatada,
      "DATA CHEGADA": dataChegada,
      "DISTÂNCIA (KM)": trecho.trechos[0].distancia,
      "TEMPO ESTIMADO": trecho.trechos[0].duracao
    };
  });

  return res.json(resultado);
});

// Inicia o servidor
const port = 3434;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
