var Cliente = require('../models/cliente');
var Matricula = require('../models/matricula');
var Encuesta = require('../models/encuesta_satisfaccion');
var Comentario_matricula = require('../models/comentario_matricula');

var bcrypt = require('bcrypt-nodejs');
var jwt_cliente = require('../helpers/jwt-cliente');
var jwt = require('jwt-simple');
var moment = require('moment');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');


const registro_cliente_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        try {

            var clientes = await Cliente.find({ email: data.email });

            bcrypt.hash('123456789', null, null, async function (err, hash) {
                if (err) {
                    res.status(500).send({ data: undefined, message: 'No se pudo generar la contraseña.' });
                } else {
                    if (clientes.length >= 1) {
                        res.status(500).send({ data: undefined, message: 'El correo electrónico ya existe.' });
                    } else {
                        data.fullnames = data.nombres + ' ' + data.apellidos;
                        data.password = hash;
                        let cliente = await Cliente.create(data);
                        enviar_correo_verificacion(cliente.email);
                        res.status(200).send({ data: cliente });
                    }
                }
            });

        } catch (error) {
            res.status(500).send({ data: undefined, message: 'Verifique los campos del formulario.' });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const validar_correo_validacion = async function (req, res) {
    var token_params = req.params['token'];
    var token = token_params.replace(/['"]+/g, '');
    var segment = token.split('.');

    if (segment.length != 3) {
        return res.status(403).send({ message: 'InvalidToken' });
    } else {
        try {
            var payload = jwt.decode(token, '2587734');
            await Cliente.findByIdAndUpdate({ _id: payload.sub }, { verify: true });
            res.status(200).send({ data: true });
        } catch (error) {
            return res.status(200).send({ message: 'El correo de verificación expiró.', data: undefined });
        }
    }
}

const listar_clientes_filtro_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                { nombres: new RegExp(filtro, 'i') },
                { apellidos: new RegExp(filtro, 'i') },
                { n_doc: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { telefono: new RegExp(filtro, 'i') },
                { fullnames: new RegExp(filtro, 'i') },
            ]
        });
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const listar_clientes_ultimos30_admin = async function (req, res) {

    if (req.user) {
        let clientes = await Cliente.find().select('_id fullnames nombres apellidos email telefono verify estado tipo').sort({ $natural: -1 }).limit(30);
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_datos_cliente_admin = async function (req, res) {

    try {

        if (req.user) {
            let id = req.params['id'];

            let cliente = await Cliente.findById({ _id: id }).populate('asesor');
            res.status(200).send({ data: cliente });

        } else {
            res.status(403).send({ data: undefined, message: 'NoToken' });
        }

    } catch (error) {

        res.status(200).send({ data: undefined });

    }
}

const editar_cliente_admin = async function (req, res) {

    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let cliente = await Cliente.findByIdAndUpdate(
            { _id: id },
            {
                nombres: data.nombres,
                apellidos: data.apellidos,
                fullnames: data.nombres + ' ' + data.apellidos,
                genero: data.genero,
                email: data.email,
                telefono: data.telefono,
                n_doc: data.n_doc,
                pais: data.pais,
                ciudad: data.ciudad,
                nacimiento: data.nacimiento
            });

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const listar_clientes_modal_admin = async function (req, res) {

    if (req.user) {
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                { nombres: new RegExp(filtro, 'i') },
                { apellidos: new RegExp(filtro, 'i') },
                { n_doc: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { telefono: new RegExp(filtro, 'i') },
                { fullnames: new RegExp(filtro, 'i') },
            ]
        }).select('_id fullnames nombres apellidos email verify tipo');
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const cambiar_estado_cliente_admin = async function (req, res) {

    if (req.user) {

        let id = req.params['id'];
        let data = req.body;
        let nuevo_estado;

        if (data.estado) {
            nuevo_estado = false;
        } else if (!data.estado) {
            nuevo_estado = true;
        }

        let cliente = await Cliente.findByIdAndUpdate({ _id: id }, { estado: nuevo_estado });

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const generar_token_encuesta_admin = async function (req, res) {

    if (req.user) {

        let matricula = req.params['matricula'];
        let cliente = req.params['cliente'];

        var payload = {
            matricula: matricula,
            cliente: cliente,
            iat: moment().unix(),
            exp: moment().add(1, 'day').unix(),
        }
        let token = jwt.encode(payload, 'sad098asd09ads0iadasd0j');

        res.status(200).send({ token: token });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const enviar_encuesta_admin = async function (req, res) {

    let data = req.body;
    let cliente;
    let matricula;

    try {
        cliente = await Cliente.findById({ _id: data.cliente });
    } catch (error) {
        res.status(200).send({ data: undefined, message: 'El código del cliente no existe' });
    }

    try {
        matricula = await Matricula.findById({ _id: data.matricula });
        data.asesor = matricula.asesor;
    } catch (error) {
        res.status(200).send({ data: undefined, message: 'El código de la matricula no existe' });
    }

    let encuestas = await Encuesta.find({ cliente: cliente._id, matricula: matricula._id });

    if (encuestas.length == 0) {
        let encuesta = await Encuesta.create(data);
        await Matricula.findByIdAndUpdate({ _id: matricula._id }, { encuesta: true });
        generar_actividad_matricula(matricula._id, 'El cliente completo la encuesta.');
        res.status(200).send({ data: encuesta });
    } else {
        res.status(200).send({ data: undefined, message: 'Ya se envio la encuesta de la matricula' });
    }

}

const obtener_encuesta_cliente_admin = async function (req, res) {

    if (req.user) {
        let id = req.params['id'];
        try {
            let encuesta = await Encuesta.findOne({ matricula: id });
            res.status(200).send({ data: encuesta });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }


}

///////////////////////////////////////////////////////////////////////////////////////////
const generar_actividad_matricula = async function (matricula, actividad) {

    await Comentario_matricula.create({
        matricula: matricula,
        actividad: actividad
    })
}

const enviar_correo_verificacion = async function (email) {
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

    //OBTENER CLIENTE
    var cliente = await Cliente.findOne({ email: email });
    var token = jwt_cliente.createToken(cliente);

    readHTMLFile(process.cwd() + '/mails/account_verify.html', (err, html) => {

        let rest_html = ejs.render(html, { token: token });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'gfsp2001mou@gmail.com',
            to: email,
            subject: 'Verificación de cuenta',
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
    registro_cliente_admin,
    validar_correo_validacion,
    listar_clientes_filtro_admin,
    obtener_datos_cliente_admin,
    editar_cliente_admin,
    listar_clientes_ultimos30_admin,
    listar_clientes_modal_admin,
    cambiar_estado_cliente_admin,
    generar_token_encuesta_admin,
    enviar_encuesta_admin,
    obtener_encuesta_cliente_admin
}