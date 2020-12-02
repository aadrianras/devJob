const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');


const usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date
});


//Metodo para hashear los password
usuarioSchema.pre('save', async function (next) {
    //Si el password ya esta hasheado no hace nada
    if (!this.isModified("password")) next();

    //Si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//Manejamos los errores en el intento de registro de usuario nuevo
usuarioSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code == 11000) {
        next('Ese email ya esta registrado');
    } else if (error._message == 'Usuario validation failed') {
        next('Error al validar al usuario, vuelve a intentarlo');
    } else {
        next(error);
    }
});


//Autenticamos usuario
usuarioSchema.methods = {
    compararPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
    }
}


const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;