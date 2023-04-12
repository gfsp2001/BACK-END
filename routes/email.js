var express = require('express');
var emailController = require('../controllers/emailController');
var auth = require('../middlewares/authenticate');

var app = express.Router();

app.get('/obtener_listas_contactos', auth.auth, emailController.obtener_listas_contactos);
app.post('/crear_lista_contactos', auth.auth, emailController.crear_lista_contactos);
app.put('/editar_lista_contactos/:id', auth.auth, emailController.editar_lista_contactos);
app.delete('/eliminar_lista/:id', auth.auth, emailController.eliminar_lista);
app.post('/importar_contactos', auth.auth, emailController.importar_contactos);
app.get('/obtener_contactos_lista/:id', auth.auth, emailController.obtener_contactos_lista);
app.get('/obtener_campaings', auth.auth, emailController.obtener_campaings);
app.get('/obtener_one_campaign/:id', auth.auth, emailController.obtener_one_campaign);
app.put('/editar_campaign/:id', auth.auth, emailController.editar_campaign);
app.post('/crear_campaign', auth.auth, emailController.crear_campaign);
app.delete('/eliminar_campaign/:id', auth.auth, emailController.eliminar_campaign);
app.post('/enviar_email_campaign', auth.auth, emailController.enviar_email_campaign);

//app.get('/obtener_detalle_lista/:id', auth.auth, emailController.obtener_detalle_lista);

module.exports = app;