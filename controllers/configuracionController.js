var Configuracion_general = require('../models/configuracion_general');
var Configuracion_finanza = require('../models/configuracion_finanza');
var fs = require('fs');
var path = require('path');


const obtener_configuracion_general_admin = async function (req, res) {

    if (req.user) {
        let configuracion_general = await Configuracion_general.findById({ _id: '640032547ea6380c242e52d1' });
        res.status(200).send({ data: configuracion_general });
    } else {
        res.status(404).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_configuracion_finanza_admin = async function (req, res) {

    if (req.user) {
        let configuracion_finanza = await Configuracion_finanza.findById({ _id: '640283c4f5179535c92f7399' });
        res.status(200).send({ data: configuracion_finanza });
    } else {
        res.status(404).send({ data: undefined, message: 'NoToken' });
    }
}


const actualizar_configuracion_general_admin = async function (req, res) {

    if (req.user) {

        let id = '640032547ea6380c242e52d1';
        let data = req.body;
        try {
            let config = await Configuracion_general.find();

            if (req.files) {
                // SI HAY IMAGEN
                var img_delete = config[0].logo;
                var path_img_delete = './uploads/configuracion/' + img_delete;
                fs.unlink(path_img_delete, function (err) {
                    if (err) throw new Error('No se pudo eliminar la imagen- ' + err);
                });

                var img_path = req.files.logo.path;
                var str_path = img_path.split('\\');
                var name = str_path[2];

                data.logo = name;
                let reg = await Configuracion_general.findByIdAndUpdate({ _id: id }, {
                    logo: data.logo,
                    razon_social: data.razon_social,
                    slogan: data.slogan,
                    background: data.background,
                    categorias: data.categorias,
                    canales: data.canales,
                    updatedAt: Date.now()
                });
                res.status(200).send({ data: reg });
            } else {
                //NO HAY IMAGEN
                let reg = await Configuracion_general.findByIdAndUpdate({ _id: id }, {
                    razon_social: data.razon_social,
                    slogan: data.slogan,
                    background: data.background,
                    categorias: data.categorias,
                    canales: data.canales,
                    updatedAt: Date.now()
                });
                res.status(200).send({ data: reg });
            }

        } catch (error) {
            console.log(error);
            res.status(403).send({ data: undefined, message: 'Ocurrio un problema al actualizar la configuracion.' });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const get_image_configuracion = async function (req, res) {
    var img = req.params['img'];
    fs.stat('./uploads/configuracion/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/configuracion/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));

        }
    });
}

const actualizar_configuracion_finanza_admin = async function (req, res) {

    if (req.user) {

        let id = '640283c4f5179535c92f7399';
        let data = req.body;

        try {
            let configuracion_finanza = await Configuracion_finanza.findByIdAndUpdate({ _id: id },
                {
                    ganancia_producto: data.ganancia_producto,
                    updatedAt: Date.now()
                });
            res.status(200).send({ data: configuracion_finanza });
        } catch (error) {

            res.status(200).send({ data: undefined, message: 'No se pudo actualizar las finanzas.' });
        }

    } else {
        res.status(404).send({ data: undefined, message: 'NoToken' });
    }
}

const verificar_token_admin = async function (req, res) {

    if (req.user) {
        res.status(200).send({ data: true });
    } else {
        res.status(403).send({ data: false, message: 'NoToken' });
    }
}


module.exports = {
    obtener_configuracion_general_admin,
    actualizar_configuracion_general_admin,
    get_image_configuracion,
    actualizar_configuracion_finanza_admin,
    obtener_configuracion_finanza_admin,
    verificar_token_admin
}