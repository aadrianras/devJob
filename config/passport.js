const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../model/Usuario');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (username, password, done) => {
        await Usuario.findOne({ email: username }, (err, usuarioDB) => {
            //Si ocurre algun error
            if (err) { return done(err); }

            //Si el usuario no existe en la DB
            if (!usuarioDB) {
                return done(null, false, { message: 'Email incorrecto' });
            };

            //Si existe el usuario verificamos la contraseña con el metodo creado en el modelo
            if (!usuarioDB.compararPassword(password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            //Si todo esta correcto
            return done(null, usuarioDB);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, userDB) => {
        done(err, userDB);
    });
});


module.exports = passport;