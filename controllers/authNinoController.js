const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conexionDB = require('../config/db');

//Autenticar el usuario
exports.autenticarUsuario = async(req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraer el usuario y password
    const { nombreNino, passwordNino } = req.body;
    try {
        //Revisar el usuario y contraseña
        conexionDB.query("SELECT * FROM infante WHERE usr = ? and psw = sha2(?,224);", [nombreNino, passwordNino], function (err, ress) {
            if (err) {
                throw err;
            }
            else {
                if (!ress.length) {
                    res.status(400).json({ msg: 'Usuario o Contraseña Incorrectos' });
                }else{
                    //Si todo es correcto Crear y firmar el JWT
                    const payload = {
                        usuario: {
                            id: nombreNino
                        }
                    };

                    //Firmar el JWT
                    jwt.sign(payload, 'firmaGonzo', {
                        expiresIn: 7200 //1 hora
                    }, (error, tokenNino) => {
                        if(error) throw error;
                        //Mensaje de confirmación
                        res.json({ tokenNino });
                    });
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Obtiene el usuario autenticado
exports.usuarioAutenticado = async(req, res) => {
    try {
        conexionDB.query("SELECT * FROM infante where usr = ?", [req.usuario.id], function(err, ress){
            if(!err){
                const usuarionino = ress[0].usr;
                res.json({ usuarionino });
            }else{
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}