const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conexionDB = require('../config/db');

exports.autenticarTutor = async(req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraer el email y el password
    const { emailPadre, passwordPadre } = req.body;

    try {
        //Revisar el email y contraseña
        conexionDB.query("SELECT * FROM tutor WHERE email = ? and psw = sha2(?,224);", [emailPadre, passwordPadre], function (err, ress) {
            if (err) {
                throw err;
            }
            else {
                if (!ress.length) {
                    res.status(400).json({ msg: 'Email o Contraseña Incorrectos' });
                }else{
                    //Si todo es correcto Crear y firmar el JWT
                    const payload = {
                        usuarioTutor: {
                            id: emailPadre
                        }
                    };

                    //Firmar el JWT
                    jwt.sign(payload, 'firmaGonzo', {
                        expiresIn: 7200 //1 hora
                    }, (error, tokenTutor) => {
                        if(error) throw error;
                        //Mensaje de confirmación
                        res.json({ tokenTutor });
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Obtiene el tutor autenticado
exports.tutorAutenticado = async(req, res) => {
    try {
        conexionDB.query("SELECT usr, email FROM tutor where email = ?", [req.usuarioTutor.id], function(err, ress){
            if(!err){
                const usuariotutor = ress[0];
                res.json({ usuariotutor });
            }else{
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Obtiene el niño del tutor que este autenticado
exports.ninoTutorAutenticado = async(req, res) => {
    try {
        conexionDB.query("SELECT usr FROM infante where emailtutor = ? ", [req.usuarioTutor.id], function(err, ress){
            if(!err){
                const ninoTutor = ress[0];
                res.json({ ninoTutor });
            }else{
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}