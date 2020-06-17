//Ruta para autenticar usuarios
const express = require('express');
const router = express.Router();
const authNinoController = require('../controllers/authNinoController');
const authNino = require('../middleware/authNino');

//Iniciar Sesión
//api/authNino
router.post('/',
    authNinoController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    authNino,
    authNinoController.usuarioAutenticado
);

module.exports = router;