const passport = require('passport');
const Vacante = require('../model/Vacante');

const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});


//Revisamos si un usuario esta autenticado
const verificarUsuario = (req, res, next) => {

    //Revisa si el usuario esta autenticado
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/iniciar-sesion');
}


//Mostramos el panes de administracion
const mostrarPanel = async (req, res) => {

    //CONSULTAMOS LAS VACANTES CREADAS POR EL USUARIO AUTENTICADO
    const vacantesUsuario = await Vacante.find({ autor: req.user._id }).lean();



    res.render('administracion', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y administra tus vacantes',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantesUsuario
    })
}



module.exports = {
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario
}