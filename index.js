// index.js
const express = require('express');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const utc = require('dayjs/plugin/utc');
const verificarIps = require('./verificarIps');
const { calcularViagens } = require('./calculos');

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

const app = express();
app.use(express.json());

// Middleware para verificar IPs
app.use(verificarIps);

app.post('/calcular', (req, res) => {
  const entrada = req.body;
  const resultados = calcularViagens(entrada);
  res.json(resultados);
});

const PORT = 3434;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
