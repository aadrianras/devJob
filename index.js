//
const db = require('./config/db');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const router = require('./routes')
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');

require('dotenv').config({ path: 'variables.env' });





//HABILITAMOS HANDLEBARS COMO VIEW
app.engine('handlebars', exphbs({
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'handlebars');


//HABILITAMOS EL BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
}))



//Alertas y flash mesages
app.use(flash());
//Creamos nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})





//UTILIZAMOS TODAS LAS RUTAS CREADAS EN EL ARCHIVO ROUTER
app.use('/', router);


app.listen(process.env.PORT, () => {
    console.log(`Se inicio el servidor escuchando ${process.env.PORT}`);
})