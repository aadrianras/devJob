const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new Schema({
    titulo: {
        type: String,
        required: 'El nombre es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
vacantesSchema.pre('save', function (next) {
    //Crea la url
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;

    //Pasamos a la siguiente funcion
    next();
})

const Vacante = mongoose.model('Vacante', vacantesSchema);

module.exports = Vacante;
