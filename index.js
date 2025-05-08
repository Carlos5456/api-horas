const express = require('express'); 
const cors = require('cors'); 
const { WorkingHours } = require('working-hours'); 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
app.post('/calcular', (req, res) =
  const { dadosSaida, trechos } = req.body; 
  const horarioInicio = dadosSaida.horario_inicio; 
  const horarioFim = dadosSaida.horario_fim; 
  const wh = new WorkingHours({ 
    workHours: [\\"\-\\\"] , 
    lunchBreak: [\\"\ +\\\"], 
    weekendsAreWorkFree: true 
  }); 
  const resultados = []; 
