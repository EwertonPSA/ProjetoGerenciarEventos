// Gera um valores fortemente criptografados toda vez que a aplicacao
// Inicializa para criacao dos tokens
const crypto = require('crypto');
module.exports.secret = crypto.randomBytes(50).toString('hex');