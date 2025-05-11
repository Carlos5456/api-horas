// middleware/verificarIps.js
const ipsPermitidos = ['62.72.63.240']; // Substitua pelos IPs permitidos

function verificarIps(req, res, next) {
  const ipCliente = req.ip;
  
  if (!ipsPermitidos.includes(ipCliente)) {
    return res.status(403).json({ erro: 'Acesso negado' });
  }
  
  next();
}

module.exports = verificarIps;
