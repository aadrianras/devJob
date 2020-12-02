const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');


//CREA UNA NUEVA VACANTE
const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Llena el formulario y publica el trabajo',
        cerrarSesion: true,
        nombre: req.user.nombre
    })
};

const agregarVacante = async (req, res) => {
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
        vacante
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



const validarVacante = (req, res) => {

    //Hay que sanitizar y validar los campos como en user
};


module.exports = {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    actualizarVacante,
    validarVacante
}