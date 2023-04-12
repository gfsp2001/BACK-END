//framework express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.port || 4201;

var app = express();
//llamamos a la ruta 
var colaborador_routes = require('./routes/colaborador');
var cliente_routes = require('./routes/cliente');
var prospeccion_routes = require('./routes/prospeccion');
var curso_routes = require('./routes/curso');
var matricula_routes = require('./routes/matricula');
var pago_routes = require('./routes/pago');
var producto_routes = require('./routes/producto');
var venta_routes = require('./routes/venta');
var configuracion_routes = require('./routes/configuracion');
var email_routes = require('./routes/email');
var kpi_routes = require('./routes/kpi');
//conexion a nuestra base de datos en mongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://mongo:vSNrEyof2vamY2OwezJH@containers-us-west-10.railway.app:6632', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err);
    } else {

        console.log("Servidor is running...");
        app.listen(port, function () {
            console.log("En el puerto: " + port);
        });
    }
});

//configuraciones cuando pedimos peticiones o datos de nuestro frontend con angular a un servidor externo 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

//para evitar los errores de cors y enviar datos de nuestro frontend al backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', colaborador_routes);
app.use('/api', cliente_routes);
app.use('/api', prospeccion_routes);
app.use('/api', curso_routes);
app.use('/api', matricula_routes);
app.use('/api', pago_routes);
app.use('/api', producto_routes);
app.use('/api', venta_routes);
app.use('/api', configuracion_routes);
app.use('/api', email_routes);
app.use('/api', kpi_routes);

// exportamos nuestra varaible app. 
module.exports = app;

//dependencias
//body-parser,sirve para parsear los datos que vienen del cuerpo de la peticion del frontend.
//connect-multiparty, middleware que sirve para manejar archivos, imagenes en nuestro backend.
//jwt-simple, sirve para codificar y decodificar los tokens de las peticiones.
//moment, sirve para manejar las fechas

// ¿Qué es el CQRS en angular?

// El Intercambio de Recursos de Origen Cruzado (CORS)
// es un mecanismo que utiliza cabeceras HTTP adicionales para permitir que un user agent (en-US)
// obtenga permiso para acceder a recursos seleccionados desde un servidor, en un origen distinto (dominio) al que pertenece.