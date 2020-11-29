const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const usuariosController = require('../controllers/usuariosController');
const { check } = require('express-validator');


///////////////////////////////////////////////////////////////////////////////////
//HOME
///////////////////////////////////////////////////////////////////////////////////
router.get('/', homeController.mostrarTrabajos);




///////////////////////////////////////////////////////////////////////////////////
//VACANTES
///////////////////////////////////////////////////////////////////////////////////

router.get('/vacante/nueva', vacanteController.formularioNuevaVacante);
router.post('/vacante/nueva', vacanteController.agregarVacante);

//Mostramos una vacante
router.get('/vacante/:url', vacanteController.mostrarVacante);

//EDITAMOS UNA VACANTE
router.get('/vacante/editar/:url', vacanteController.formEditarVacante);
router.post('/vacante/editar/:url', vacanteController.actualizarVacante);

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
router.post('iniciar-sesion', usuariosController.iniciarSesion);

module.exports = router;