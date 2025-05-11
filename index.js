const express = require('express');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const utc = require('dayjs/plugin/utc');

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);


const app = express();
app.use(express.json());

function adicionarMinutos(dataHora, minutos) {
  return dayjs(dataHora).add(minutos, 'minute');
}

function minutosDuracao(duracaoStr) {
  const [h, m] = duracaoStr.split(':').map(Number);
  return h * 60 + m;
}

function formatar(dataHora) {
  return dayjs(dataHora).format('YYYY-MM-DD HH:mm');
}

function proximoDiaUtil(dia, ignorarDomingos) {
  let novoDia = dayjs(dia).add(1, 'day');
  while (ignorarDomingos && novoDia.day() === 0) {
    novoDia = novoDia.add(1, 'day');
  }
  return novoDia;
}

app.post('/calcular', (req, res) => {
  const entrada = req.body;

  const resultados = entrada.map(viagem => {
    const {
      data_saida,
      horario_inicio,
      horario_fim,
      duracao_almoco,
      ignorar_domingos
    } = viagem.dadosSaida;

    const almocoMin = parseInt(duracao_almoco.split(':')[0], 10); // vem como "30:00"
    const expedienteInicio = horario_inicio;
    const expedienteFim = horario_fim;

    let dataAtual = dayjs(`${data_saida} ${expedienteInicio}`);
    let fimDia = dayjs(`${data_saida} ${expedienteFim}`);
    let almocoFeitoHoje = false;

    const trechosCalculados = [];

    for (const trecho of viagem.trechos) {
      let duracaoMinutos = minutosDuracao(trecho.duracao);
      let inicioTrecho = dataAtual;

      while (duracaoMinutos > 0) {
        fimDia = dayjs(`${dataAtual.format('YYYY-MM-DD')} ${expedienteFim}`);
        let minutosRestantesHoje = fimDia.diff(dataAtual, 'minute');

        if (!almocoFeitoHoje && dataAtual.format('HH:mm') < '12:00' && fimDia.format('HH:mm') > '12:00') {
          minutosRestantesHoje -= almocoMin;
          almocoFeitoHoje = true;
        }

        if (duracaoMinutos <= minutosRestantesHoje) {
          dataAtual = adicionarMinutos(dataAtual, duracaoMinutos);
          break;
        } else {
          duracaoMinutos -= minutosRestantesHoje;
          dataAtual = proximoDiaUtil(dataAtual, ignorar_domingos).hour(Number(expedienteInicio.split(':')[0])).minute(Number(expedienteInicio.split(':')[1]));
          almocoFeitoHoje = false;
        }
      }

      trechosCalculados.push({
        origem: trecho.origem,
        destino: trecho.destino,
        SAIDA: formatar(inicioTrecho),
        CHEGADA: formatar(dataAtual),
        distancia: trecho.distancia,
        duracao: trecho.duracao
      });
    }

    return trechosCalculados;
  });

  res.json(resultados.flat());
});

const PORT = 3434;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
