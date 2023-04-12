var Cliente = require('../models/cliente');
var cliente_llamada = require('../models/cliente_llamada');
var cliente_correo = require('../models/cliente_correo');
var cliente_tarea = require('../models/cliente_tarea');
var cliente_actividad = require('../models/cliente_actividad');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const crear_llamada_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let llamada = await cliente_llamada.create(data);
        crear_actividad_prospeccion_admin('Llamada', llamada.asesor, 'Se registor una llamada con resultado ' + llamada.resultado, llamada.cliente);
        res.status(200).send({ data: llamada });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const listar_llamada_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let llamadas = await cliente_llamada.find({ cliente: id }).populate('asesor').sort({ createdAt: -1 });
        res.status(200).send({ data: llamadas });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

/////////////////////////////////////////////////////////////////////////

const crear_correo_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let client = await Cliente.findById({ _id: data.cliente });
        enviar_correo_prospeccion(client.fullnames, data.asunto, client.email, data.contenido)
        let correo = await cliente_correo.create(data);
        crear_actividad_prospeccion_admin('Correo', correo.asesor, 'Se envió un correo con el asunto ' + correo.asunto, correo.cliente);
        res.status(200).send({ data: correo });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const listar_correos_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let correos = await cliente_correo.find({ cliente: id }).populate('asesor').sort({ createdAt: -1 });
        res.status(200).send({ data: correos });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

//////////////////////////////////////////////////////////////////////////

const crear_tarea_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let tarea = await cliente_tarea.create(data);
        crear_actividad_prospeccion_admin('Tarea', tarea.asesor, 'Se registro una tarea como ' + tarea.tarea, tarea.cliente);
        res.status(200).send({ data: tarea });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const listar_tarea_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let tareas = await cliente_tarea.find({ cliente: id }).populate('asesor').populate('marca_asesor').sort({ createdAt: -1 });
        res.status(200).send({ data: tareas });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const marcar_tarea_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let tarea = await cliente_tarea.findByIdAndUpdate({ _id: id }, { estado: true, marca_asesor: req.user.sub });
        res.status(200).send({ data: tarea });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}
//////////////////////////////////////////////////////////////////////////

const crear_actividad_prospeccion_admin = async function (tipo, asesor, actividad, cliente) {
    let data = {
        tipo: tipo,
        asesor: asesor,
        actividad: actividad,
        cliente: cliente
    }
    await cliente_actividad.create(data);
}

const listar_actividades_prospeccion_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let actividades = await cliente_actividad.find({ cliente: id }).populate('asesor').sort({ createdAt: -1 });
        res.status(200).send({ data: actividades });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

//////////////////////////////////////////////////////////////////////////

const enviar_correo_prospeccion = async function (cliente, asunto, email, contenido) {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'gfsp2001mou@gmail.com',
            pass: 'wttmjudjkgqxaqob'
        }
    }));

    readHTMLFile(process.cwd() + '/mails/mail_message.html', (err, html) => {

        let rest_html = ejs.render(html, {
            cliente: cliente,
            asunto: asunto,
            email: email,
            contenido: contenido,
        });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'gfsp2001mou@gmail.com',
            to: email,
            subject: asunto,
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Email didnt send: ' + info.response);
            }
        });

    });

}

module.exports = {
    crear_llamada_prospeccion_admin,
    listar_llamada_prospeccion_admin,
    crear_correo_prospeccion_admin,
    listar_correos_prospeccion_admin,
    crear_tarea_prospeccion_admin,
    listar_tarea_prospeccion_admin,
    marcar_tarea_prospeccion_admin,
    listar_actividades_prospeccion_admin
}