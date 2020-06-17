//Ruta para autenticar usuarios
const express = require('express');
const router = express.Router();
const authTutorController = require('../controllers/authTutorController');
const authTutor = require('../middleware/authTutor');

//Iniciar Sesión
//api/authTutor
router.post('/',
    authTutorController.autenticarTutor
);

//Obtiene el usuario autenticado
router.get('/',
    authTutor,
    authTutorController.tutorAutenticado
);

router.get('/nino',
    authTutor,
    authTutorController.ninoTutorAutenticado
);

module.exports = router;