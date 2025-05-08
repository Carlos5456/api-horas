const express = require('express');
const cors = require('cors');
const { WorkingHours } = require('working-hours');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/calcular', (req, res) => {
  const { dadosSaida, trechos } = req.body;

  const horarioInicio = dadosSaida.horario_inicio;
  const horarioFim = dadosSaida.horario_fim;
  const duracaoAlmoco = dadosSaida.duracao_almoco || "00:00";

  const wh = new WorkingHours({
    workHours: [`${horarioInicio}-${horarioFim}`],
    lunchBreak: [`${horarioInicio} +${duracaoAlmoco}`],
    weekendsAreWorkFree: true
  });

  const resultados = [];
  let horaAtual = new Date(`${dadosSaida.data_saida}T${horarioInicio}:00`);

  for (const trecho of trechos) {
    const tempoEstMin = trecho.duracao;

    const dataSaida = horaAtual;
    const horaSaida = new Date(horaAtual);

    horaAtual = wh.addWorkingTime(horaAtual, tempoEstMin);

    resultados.push({
      "CIDADE SAIDA": trecho.origem,
      "CIDADE DESTINO": trecho.destino,
      "HORA SAÍDA": horaSaida.toTimeString().slice(0, 5),
      "DATA SAÍDA": horaSaida.toISOString().slice(0, 10),
      "HORA CHEGADA": horaAtual.toTimeString().slice(0, 5),
      "DATA CHEGADA": horaAtual.toISOString().slice(0, 10),
      "DISTÂNCIA (KM)": trecho.distancia,
      "TEMPO ESTIMADO": trecho.duracao
    });
  }

  res.json({ resultado: resultados });
});

app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001');
});
