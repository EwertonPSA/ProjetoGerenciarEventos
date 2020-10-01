/**
 * Usada para gerenciar todas as rotas de acesso as paginas
 * Disponiveis na aplicação
 */
const express = require('express');
const router = express.Router();
const controllerPgPrincipal = require('../app/controllers/controllerPgPrincipal');
const controllerAuthenticate = require('../app/controllers/controllerAuth')
const cors = require('cors');

router.get("/", controllerPgPrincipal.principal);
router.get("/buscar", controllerPgPrincipal.buscar);
router.post("/auth/authenticate", controllerAuthenticate.signIn);
router.post("/auth/register", controllerAuthenticate.signUp);

module.exports = (app)=> {
    app.use(router);
};