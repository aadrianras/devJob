const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

//CONECTAMOS A LA BASE DE DATOS MEDIANTE LA URL
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Conectado a la base de datos')
});


//IMPORTAMOS LOS MODELOS
require('../model/Vacante');


module.exports = db;