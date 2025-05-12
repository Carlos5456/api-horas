// middleware/verificarIps.js
const ipsPermitidos = ['xxx.xxx.xxx.xx']; // Substitua pelos IPs permitidos

function verificarIps(req, res, next) {
  const ipCliente = req.ip;

  if (!ipsPermitidos.includes(ipCliente)) {
    console.log(`Acesso bloqueado para o IP: ${ipCliente}`); // Loga o IP bloqueado no console
    return res.status(403).json({ erro: 'Acesso negado' });
  }

  next();
}

module.exports = verificarIps;
