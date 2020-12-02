const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { validationResult, body, check } = require('express-validator');


//CREA UNA NUEVA VACANTE
const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Llena el formulario y publica el trabajo',
        cerrarSesion: true,
        nombre: req.user.nombre
    })
};

//VERIFICAMOS LA VALIDEZ DE LOS DATOS DEL FORM
const validarVacante = [
    body('titulo').trim().escape(),
    body('empresa').trim().escape(),
    body('ubicacion').trim().escape(),
    body('salario').trim().escape(),
    body('contrato').trim().escape(),
    body('skills').trim().escape(),
    check('titulo').not().isEmpty().withMessage('Agrega tu titulo a la vacante'),
    check('empresa').not().isEmpty().withMessage('Agrega la empresa solicitante'),
    check('ubicacion').not().isEmpty().withMessage('Debes indicar la ubicación'),
    check('contrato').not().isEmpty().withMessage('Debes agregar el tipo de contrato'),
    check('skills').not().isEmpty().withMessage('Agrega al menos una habilidad')
];


//AGREGAMOS LA VACANTE
const agregarVacante = async (req, res) => {

    //VERIFICAMOS SI LOS MIDDLEWARE DE VERIFICACION ENVIAN ERRORES
    const error = validationResult(req);
    if (!error.isEmpty()) {
        req.flash('error', error.array().map(er => er.msg));
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva vacante',
            tagline: 'Llena el formulario y publica el trabajo',
            mensajes: req.flash(),
            cerrarSesion: true,
            nombre: req.user.nombre
        })
        return;
    };

    //Si todos los campos estan correctos
    const vacante = new Vacante(req.body);

    //Agregamos al autor de la vacante antes de guardar
    vacante.autor = req.user._id;

    //crear arreglo de habilidades (skills)
    vacante.skills = req.body.skills.split(',');

    //ALMACENAMOS EN LA BASE DE DATOS
    const nuevaVacante = await vacante.save();
    console.log(`Vacante ${nuevaVacante.titulo} creada`);
    res.redirect(`/vacante/${nuevaVacante.url}`);

}

//MOSTRAMOS UNA VACANTE
const mostrarVacante = async (req, res, next) => {
    const { url } = req.params;
    //Buscamos en la DB
    const vacante = await Vacante.findOne({ url }).lean();
    if (!vacante) return next();

    res.render('vacante', {
        nombrePagina: `Vacante: ${vacante.titulo}`,
        vacante,
        cerrarSesion: true,
        nombre: req.user.nombre
    })

}


//VAMOS AL FORMULARIO PARA EDITAR UNA VACANTE
const formEditarVacante = async (req, res) => {
    const { url } = req.params;
    await Vacante.findOne({ url: url })
        .lean()
        .exec((err, vacanteDB) => {
            if (err) {
                console.log('No se encontro la vacante: ', err);
                return res.redirect('/');
            }
            res.render('editar-vacante', {
                vacanteDB,
                nombrePagina: `Editando: ${vacanteDB.titulo}`,
                cerrarSesion: true,
                nombre: req.user.nombre
            })
        });
}


//EDITAMOS LA INFORMACION DE LA VACANTE Y LA ALMACENAMOS EN LA DB
const actualizarVacante = async (req, res) => {

    //VERIFICAMOS SI LOS MIDDLEWARE DE VERIFICACION ENVIAN ERRORES
    const error = validationResult(req);
    if (!error.isEmpty()) {
        req.flash('error', error.array().map(er => er.msg));
        res.render('editar-vacante', {
            vacanteDB,
            nombrePagina: `Editando: ${vacanteDB.titulo}`,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
        return;
    };


    //SI TODO ESTA CORRECTO ACTUALIZAMOS LA INFO
    const { url } = req.params;
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');



    await Vacante.findOneAndUpdate({ url }, vacanteActualizada, { new: true, runValidators: true }, (err, vacanteDB) => {
        if (err) {
            console.log(err, "No se pudo actualizar la info!");
        }
        //ACTUALIZAMOS LA INFORMACION}
        console.log("Vacante actualizada correctamente")
        res.redirect(`/vacante/${vacanteDB.url}`);
    });

};



//ELIMINA UNA VACANTE DE LA DB
const eliminarVacante = async (req, res) => {
    const { id } = req.params;
    await Vacante.deleteOne({ _id: id }, (err, respuesta) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Ocurrio un problema intentando eliminar la vacante, intentalo nuevamente'
            })
        }
        console.log(`La vacante fue eliminada correctamente!`);
        res.status(200).json({
            ok: true,
            message: `La vacante fue eliminada correctamente!`
        })
    })
}




module.exports = {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    actualizarVacante,
    validarVacante,
    eliminarVacante
}