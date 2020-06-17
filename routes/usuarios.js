//Ruta para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Crea un usuario
//api/usuarios
router.post('/',
[
    check('nombrePadre', 'El nombre del Padre o Tutor es obligaorio').not().isEmpty(),
    check('emailPadre', 'Agrega un email válido').isEmail(),
    check('passwordPadre', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    check('nombreNino', 'El nombre del Niño es obligatorio').not().isEmpty(),
    check('passwordNino', 'El password debe ser mínimo de 4 caracteres').isLength({ min: 4 })
],
usuarioController.crearUsuario
);
module.exports = router;