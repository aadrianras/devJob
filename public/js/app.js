import axios from 'axios';
import Swal from 'sweetalert2';



document.addEventListener('DOMContentLoaded', () => {

    //Eliminamos las alertas de la pantalla si existen
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas(alertas);
    }

    const skills = document.querySelector('.lista-conocimientos');
    if (skills) {
        skills.addEventListener('click', agregarSkills);

        //Revisa las opciones cuando ingresamos desde editar vacante
        skillsSeleccionadas();
    }
})



const skills = new Set();

const agregarSkills = (e) => {
    e.preventDefault();
    if (e.target.tagName === 'LI') {
        if (!e.target.classList.contains('activo')) {
            //SI SE SELECCIONA AGREGA AL SET Y LO MARCA COMO ACTIVO
            e.target.classList.add('activo');
            skills.add(e.target.textContent);
        } else {
            //SI SE SELECCIONA ESTANDO ACTIVO LO DESACTIVA Y LO ELIMINA DEL SET
            e.target.classList.remove('activo');
            skills.delete(e.target.textContent);
        }

    }
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionadas = () => {
    let seleccionadas = document.querySelectorAll('.lista-conocimientos .activo');
    seleccionadas = Array.from(seleccionadas);
    seleccionadas = seleccionadas.map(seleccionada => seleccionada.innerText);
    seleccionadas.forEach(s => skills.add(s));
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}




///////////////////////////////////////////////////////////////////////////////
//VERIFICAMOS QUE LA CONTRASEÑA Y LA REPETICION DE CONTRASEÑA SEAN IGUALES AL REGISTRAR UN USUARIO
///////////////////////////////////////////////////////////////////////////////

const contraseniaUsuario = document.getElementById('UsuarioContrasenia');
const contraseniaUsuarioRep = document.getElementById('UsuarioContraseniaRepeticion');
const btnSubmitRegistro = document.getElementById('btnSubmitRegistro');

//Si existen los campos valida los contenidos
if (contraseniaUsuarioRep !== null) {
    contraseniaUsuarioRep.addEventListener('input', contraseniasIguales);

    function contraseniasIguales() {
        if (contraseniaUsuario.value !== contraseniaUsuarioRep.value) {
            contraseniaUsuario.style.background = '#ffb0b0';
            contraseniaUsuarioRep.style.background = '#ffb0b0';
            btnSubmitRegistro.disabled = true;
            btnSubmitRegistro.classList = ('btn btn-rojo');
        };

        if (contraseniaUsuario.value === contraseniaUsuarioRep.value) {
            contraseniaUsuario.style.background = '#cee397';
            contraseniaUsuarioRep.style.background = '#cee397';
            btnSubmitRegistro.disabled = false;
            btnSubmitRegistro.classList = ('btn btn-azul');

        };
        return;
    }

}

///////////////////////////////////////////////////////////////////////////////
//Funcion para eliminar las alertas de la pantalla si existen
///////////////////////////////////////////////////////////////////////////////
function limpiarAlertas(alertas) {

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else {
            alertas.remove();
            clearInterval(interval);
        }
    }, 2000);


}




///////////////////////////////////////////////////////////////////////////////
//FUNCIONALIDADES EN EL PANEL ADMINISTRATIVO - BOTONES
///////////////////////////////////////////////////////////////////////////////
const vacantesListado = document.querySelector('.panel-administracion');
if (vacantesListado) {
    vacantesListado.addEventListener('click', accionesListado);
}

//ELIMINAMOS VACANTES
function accionesListado(e) {
    e.preventDefault();
    if (e.target.dataset.eliminar) {
        //Eliminamos por medio de axios
        Swal.fire({
            title: 'Estas seguro de eliminar esta vacante?',
            text: "Se eliminará definitivamente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //SI ACEPTA ELIMINAR LA VACANTE ENVIAMOS UNA PETICION A LA DB
                axios.delete(`/vacante/eliminar/${e.target.dataset.eliminar}`)
                    .then(res => {
                        //MENSAJE DE CONFIRMACIÓN DE QUE TODO SALIO BIEN
                        Swal.fire(
                            'Eliminada!',
                            `${res.data.message}`,
                            'success'
                        );
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }
                    )
                    .catch(err => {
                        console.log(err);
                        Swal.fire(
                            'Eliminada!',
                            `${err.data.message}`,
                            'warning'
                        );
                    });
            }
        }).catch(err => console.log(err));

    } else {
        window.location.href = e.target.href;
    }
}






