module.exports = {
    seleccionarSkills: (seleccionadas = [], opciones) => {
        //CONVERTIMOS EN MINUSCULAS PARA COMPARAR
        let seleccionadasMinusculas = seleccionadas.map(skill => skill.toLowerCase());


        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        //Cuando editamos una vacante el array SELECCIONADAS viene con elementos por lo tanto, en el html que generamos verificamos si deberia estar activo
        let html = '';
        skills.forEach(skill => {
            html += `
                <li ${seleccionadasMinusculas.includes(skill.toLowerCase()) === true ? "class='activo'" : ""} >${skill}</li>
            `;
        });

        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    },
    mostrarAlertas: (mensajes = {}, alertas) => {
        const categoriaMensaje = Object.keys(mensajes);
        let html = '';
        if (categoriaMensaje.length) {
            mensajes[categoriaMensaje].forEach(mensaje => {
                html += `
                <div class="${categoriaMensaje[0]} alerta">
                    ${mensaje}
                </div>
                `;
            })
        }
        return alertas.fn().html = html;
    }
}