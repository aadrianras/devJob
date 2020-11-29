const Vacante = require('../model/Vacante');




const mostrarTrabajos = async (req, res, next) => {
    const vacantes = await Vacante.find().lean();
    if (!vacantes) return next();

    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y publica trabajos para desarrolladores',
        barra: true,
        boton: true,
        vacantes
    })
}



module.exports = {
    mostrarTrabajos
}