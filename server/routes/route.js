/**
 * Usada para gerenciar todas as rotas de acesso as paginas
 * Disponiveis na aplicação
 */
const express = require('express');
const router = express.Router();
const controllerPgPrincipal = require('../app/controllers/controllerPgPrincipal');
const controllerAuthenticate = require('../app/controllers/controllerAuth')
const controllerEvent = require('../app/controllers/controllerEvent')
const authMiddlware = require('../app/middlwares/auth');
const cors = require('cors');

router.get("/", controllerPgPrincipal.principal);
router.post("/auth/authenticate", controllerAuthenticate.signIn);
router.post("/auth/register", controllerAuthenticate.signUp);
router.get("/event/listAll", controllerEvent.listAll);
router.post("/event/listEventForUser", authMiddlware, controllerEvent.listEventForUser);
router.post("/event/list", controllerEvent.list);
router.get("/event/oneEvent", controllerEvent.oneEvent);
router.post("/event/create", authMiddlware, controllerEvent.create);
router.put("/event/edit/:eventId", authMiddlware, controllerEvent.edit);
router.delete("/event/delete", authMiddlware, controllerEvent.deleteEvent);


module.exports = (app)=> {
    app.use(router);
    app.use(cors);
};