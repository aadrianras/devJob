const Usuario = require('../model/Usuario');
const { validationResult, check } = require('express-validator');


const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta',
        tagline: 'Comienza a publicar tus vacantes, solo debes crear una cuenta'
    })
}

const validacionRegistro = [
    check('nombre', 'Nombre con minimo 3 letras').isLength({ min: 3 }),
    check('nombre', 'El nombre no puede estar vacio').not().isEmpty().escape().trim(),
    check('email', 'Agrega un mail valido').isEmail(),
    check('password', 'La contraseña debe ser 6 letras minimo').isLength({ min: 6 })
];






//Creamos el usuario en la DB
const crearUsuario = async (req, res, next) => {

    //VERIFICAMOS SI LOS MIDDLEWARE DE VERIFICACION ENVIAN ERRORES
    const error = validationResult(req);
    if (!error.isEmpty()) {
        req.flash('error', error.array().map(er => er.msg));
        //Volvemos al formulario mostrando los errores
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta',
            tagline: 'Comienza a publicar tus vacantes, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return;
    }

    const usuario = await new Usuario(req.body);
    usuario.save((error, usuarioDB) => {
        if (error) {
            console.log(error)
            req.flash('error', error);
            res.render('crear-cuenta', {
                nombrePagina: 'Crea tu cuenta',
                tagline: 'Comienza a publicar tus vacantes, solo debes crear una cuenta',
                mensajes: req.flash()
            })
            return;
        }
        console.log(`Usuario ${usuarioDB.nombre} creado correctamente!`);
        //redirigimos al usuario con al inicio de sesión
        res.redirect('/iniciar-sesion');
    });

};


//Pagina de iniciar sesion
const formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Inicia tu sesión',
        tagline: 'Ingresa tu email y contraseña para acceder a tu cuenta'
    })
}


//Si los datos son correctos inicia sesion y envia al dashboard
const iniciarSesion = (req, res, next) => {
    //Aqui quedamos
}



module.exports = {
    formCrearCuenta,
    crearUsuario,
    validacionRegistro,
    formIniciarSesion,
    iniciarSesion
}