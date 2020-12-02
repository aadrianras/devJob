const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const { check } = require('express-validator');


///////////////////////////////////////////////////////////////////////////////////
//HOME
///////////////////////////////////////////////////////////////////////////////////
router.get('/', homeController.mostrarTrabajos);




///////////////////////////////////////////////////////////////////////////////////
//VACANTES
///////////////////////////////////////////////////////////////////////////////////

router.get('/vacante/nueva', authController.verificarUsuario, vacanteController.formularioNuevaVacante);
router.post('/vacante/nueva', authController.verificarUsuario, vacanteController.agregarVacante);

//Mostramos una vacante
router.get('/vacante/:url', vacanteController.mostrarVacante);

//EDITAMOS UNA VACANTE
router.get('/vacante/editar/:url', authController.verificarUsuario, vacanteController.formEditarVacante);
router.post('/vacante/editar/:url', authController.verificarUsuario, vacanteController.actualizarVacante);

///////////////////////////////////////////////////////////////////////////////////
//CUENTA USUARIO
///////////////////////////////////////////////////////////////////////////////////
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
//Recibimos la informacion del nuevo usuario, la validamos con los middleware y almacenamos en la DB si todo es correcto
router.post('/crear-cuenta', usuariosController.validacionRegistro, usuariosController.crearUsuario);


///////////////////////////////////////////////////////////////////////////////////
//INICIAR SESION
///////////////////////////////////////////////////////////////////////////////////
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
//VALIDAMOS LA INFORMACION DEL USUARIO
router.post('/iniciar-sesion', authController.autenticarUsuario);
//CERRAR SESION
router.get('/cerrar-sesion', authController.verificarUsuario, usuariosController.cerrarSesion);



///////////////////////////////////////////////////////////////////////////////////
//ADMINISTRACION
///////////////////////////////////////////////////////////////////////////////////
router.get('/administracion', authController.verificarUsuario, authController.mostrarPanel);

//Editar perfil de usuario
router.get('/editar-perfil', authController.verificarUsuario, usuariosController.editarPerfil);
//Actualizamos los valores modificados del perfil
router.post('/editar-perfil', authController.verificarUsuario, usuariosController.actualizarPerfil);






module.exports = router;