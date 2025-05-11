# 🕒 API de Cálculo de Horários de Viagem

Esta API recebe dados de uma viagem com trechos e calcula automaticamente os horários de **saída e chegada** de cada trecho com base no horário de expediente, tempo de almoço e regras como **ignorar domingos**.

---

## 📦 Como usar

### 1. Instale as dependências

```bash
"npm install"
```

### 2. Inicie a API

```bash
"node index.js"
```

> A API ficará disponível em `"http://localhost:3434/calcular"`

---

## 📥 Entrada esperada (JSON)

Envie um `POST` com o seguinte JSON no `body` para a rota `"/calcular"`:

```json
[
  {
    "dadosSaida": {
      "data_saida": "2025-05-07",
      "horario_inicio": "06:00",
      "horario_fim": "18:00",
      "duracao_almoco": "30:00",
      "ignorar_domingos": false
    },
    "trechos": [
      {
        "origem": "Antônio Prado, RS",
        "destino": "Fazenda Rio Grande, State of Paraná",
        "distancia": "498 km",
        "duracao": "07:01"
      },
      {
        "origem": "Fazenda Rio Grande, State of Paraná",
        "destino": "Curitiba, State of Paraná",
        "distancia": "29 km",
        "duracao": "00:39"
      }
    ]
  }
]
```

---

## 📤 Saída esperada

A API retorna os dados de cada trecho com **data e hora de saída e chegada calculadas**, conforme o expediente e as regras fornecidas:

```json
[
  {
    "origem": "Antônio Prado, RS",
    "destino": "Fazenda Rio Grande, State of Paraná",
    "SAIDA": "2025-05-07 06:00",
    "CHEGADA": "2025-05-07 13:01",
    "distancia": "498 km",
    "duracao": "07:01"
  },
  {
    "origem": "Fazenda Rio Grande, State of Paraná",
    "destino": "Curitiba, State of Paraná",
    "SAIDA": "2025-05-07 13:01",
    "CHEGADA": "2025-05-07 13:40",
    "distancia": "29 km",
    "duracao": "00:39"
  }
]
```

---

## ⚙️ Regras de Cálculo

- A viagem inicia na `"data_saida"` e no `"horario_inicio"`.
- Se ultrapassar o `"horario_fim"`, continua no próximo dia útil.
- Se `"ignorar_domingos"` for `true`, pula domingos.
- O tempo de `"duracao_almoco"` é descontado do expediente do dia apenas uma vez por dia.

---

## 💡 Exemplo de requisição com cURL

```bash
"curl -X POST http://localhost:3434/calcular \
  -H \"Content-Type: application/json\" \
  -d @entrada.json"
```

---

## 🧑‍💻 Feito com "Node.js" + "Day.js"
