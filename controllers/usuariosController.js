const Usuario = require('../model/Usuario');
const { validationResult, check, body } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');

//OPCIONES DE MULTER
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortId.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el callback se ejecuta como true o false
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'));
        }
    },
    limit: { fileSize: 100000 }
}
const upload = multer(configuracionMulter);


//PERMITE SUBIR UNA IMAGEN EN LA PAGINA DE EDITAR PERFIL
const subirImagen = upload.single('imagenPerfil');





const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta',
        tagline: 'Comienza a publicar tus vacantes, solo debes crear una cuenta'
    })
};



//Middleware de validacion de campos para el registro de usuario
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

//Cerrar sesion
const cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Sesión finalizada');
    return res.redirect('/iniciar-sesion');
}



//Envia al form para editar usuario
const editarPerfil = async (req, res, next) => {
    const { user } = req;

    await Usuario.findById({ _id: user._id }, (err, usuarioDB) => {
        if (err) {
            throw new Error(err, 'Ocurrio un problema al autenticar tu cuenta');
        };

        //Si no hay error mostramos el formulario con la info del usuario
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil',
            tagline: 'En esta página podras modificar y/o actualizar la información de tu perfil',
            usuario: {
                nombre: usuarioDB.nombre,
                imagen: usuarioDB.imagen,
                email: usuarioDB.email
            },
            cerrarSesion: true,
            nombre: user.nombre
        });
    });
};



//VALIDAMOS LOS CAMPOS DE LA EDICION DEL PERFIL DE USUARIO
const validarCamposEdicionPerfil = [
    body('nombre').trim().escape(),
    body('email').trim().escape(),
    check('nombre').isEmpty().withMessage('El nombre no puede estar vacio'),
    check('email').isEmpty().withMessage('El email no puede estar vacio')

];


//Actualiza la informacion del usuario
const actualizarPerfil = async (req, res) => {

    const { user, body, file } = req;


    //VERIFICAMOS SI LOS MIDDLEWARE DE VERIFICACION ENVIAN ERRORES
    const error = validationResult(req);
    if (!error.isEmpty()) {
        req.flash('error', error.array().map(er => er.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil',
            tagline: 'En esta página podras modificar y/o actualizar la información de tu perfil',
            usuario: {
                nombre: user.nombre,
                email: user.email
            },
            cerrarSesion: true,
            imagen: user.imagen,
            nombre: user.nombre,
            mensajes: req.flash()
        });
        return;
    };

    //ACTUALIZAMOS LA INFORMACION SI LOS CAMPOS SON VALIDOS
    await Usuario.findById({ _id: user._id }, async (err, usuarioDB) => {
        if (err) {
            throw new Error(err, 'Ocurrio un problema al obtener la informacion del usuario para actualizar');
        };

        //Actualizamos la informacion del usuario con la del form
        usuarioDB.nombre = body.nombre;
        usuarioDB.email = body.email;
        if (body.password) {
            usuarioDB.password = body.password;
        };
        if (file) {
            usuarioDB.imagen = file.filename;
        };


        await usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                throw new Error(err, 'Ocurrio un problema al actualizar la informacion del usuario');
            };
            req.flash('correcto', 'Cambios guardados correctamente');
            res.redirect('/administracion');
        })
    })
};







module.exports = {
    formCrearCuenta,
    crearUsuario,
    validacionRegistro,
    formIniciarSesion,
    editarPerfil,
    actualizarPerfil,
    cerrarSesion,
    validarCamposEdicionPerfil,
    subirImagen
}