const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conexionDB = require('../config/db');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer los datos de registro
    const {nombrePadre, emailPadre, passwordPadre, nombreNino, passwordNino} = req.body;
    
    try {
       
        //Revisar que el usuario registrado sea unico
        conexionDB.query("SELECT * FROM tutor WHERE email = ?;", [emailPadre],function(err,ress) {
            if(err) {
                console.log("error: ", err);
            }
            else{
                const usuario = ress[0];
                if(usuario) {
                    return res.status(400).json({ msg: 'El usuario ya existe' });
                }
            }
        });

        //Crea el nuevo usuario
        conexionDB.query("INSERT INTO tutor VALUES (?,?,sha2(?,224));", [nombrePadre, emailPadre, passwordPadre], function (err, ress) {
            if(!err) {
                conexionDB.query("INSERT INTO infante values(?,?,sha2(?,224));", [nombreNino, emailPadre, passwordNino], function(err, ress){
                    if(!err) {
                        //Crear y firmar el JWT
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
                });
            }
        });
       
        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}