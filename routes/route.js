/**
 * Usada para gerenciar todas as rotas de acesso as paginas
 * Disponiveis na aplicação
 */
const express = require('express');
const router = express.Router();
const controllerPgPrincipal = require('../app/controllers/controllerPgPrincipal.js');

router.get("/", controllerPgPrincipal.principal);

module.exports = (app)=> app.use(router);