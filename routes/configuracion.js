var express = require('express');
var configuracionController = require('../controllers/configuracionController');
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/configuracion' });

var app = express.Router();

app.get('/obtener_configuracion_general_admin', auth.auth, configuracionController.obtener_configuracion_general_admin);
app.put('/actualizar_configuracion_general_admin', [auth.auth, path], configuracionController.actualizar_configuracion_general_admin);
app.get('/get_image_configuracion/:img', configuracionController.get_image_configuracion);
app.put('/actualizar_configuracion_finanza_admin', auth.auth, configuracionController.actualizar_configuracion_finanza_admin);
app.get('/obtener_configuracion_finanza_admin', auth.auth, configuracionController.obtener_configuracion_finanza_admin);
app.get('/verificar_token_admin', auth.auth, configuracionController.verificar_token_admin);


module.exports = app;