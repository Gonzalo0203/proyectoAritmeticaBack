const express = require('express');
const conexionDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la base de datos
conexionDB.connect(function (error){
    if (error) {
        console.log(error);
        process.exit(1); //Detener la app si hay error
    }else {
        console.log('DB Conectada!!');
    }
});

//Habilitar Cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

//Puerto de la app
const port = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/authNino', require('./routes/authNino'));
app.use('/api/authTutor', require('./routes/authTutor'));

//Arrancar la aapp
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});