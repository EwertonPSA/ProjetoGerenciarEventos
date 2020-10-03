// Gera um valores fortemente criptografados toda vez que a aplicacao
// Inicializa para criacao dos tokens
const crypto = require('crypto');
const secretTemporario = "7983EBCF36058727E1E3C098174A4496sakskasKAs"
module.exports.secret = secretTemporario;//crypto.randomBytes(50).toString('hex');