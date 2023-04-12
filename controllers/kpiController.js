var Pago = require('../models/pago');
var Curso = require('../models/curso');
var Cliente = require('../models/cliente');

const kpi_pagos_mensuales = async function (req, res) {

    if (req.user) {

        let today = new Date();
        let year = today.getFullYear();

        let first = year + '-01-01';
        let last = year + '-12-31';

        let meses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        let pagos = await Pago.find({
            createdAt: {
                $gte: new Date(first + 'T00:00:00'),
                $lt: new Date(last + 'T23:59:59'),
            }
        });
        for (item of pagos) {
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth() + 1
            if (month_element == 1) {
                meses[0] = meses[0] + item.monto;
            } else if (month_element == 2) {
                meses[1] = meses[1] + item.monto;
            } else if (month_element == 3) {
                meses[2] = meses[2] + item.monto;
            } else if (month_element == 4) {
                meses[3] = meses[3] + item.monto;
            } else if (month_element == 5) {
                meses[4] = meses[4] + item.monto;
            } else if (month_element == 6) {
                meses[5] = meses[5] + item.monto;
            } else if (month_element == 7) {
                meses[6] = meses[6] + item.monto;
            } else if (month_element == 8) {
                meses[7] = meses[7] + item.monto;
            } else if (month_element == 9) {
                meses[8] = meses[8] + item.monto;
            } else if (month_element == 10) {
                meses[9] = meses[9] + item.monto;
            } else if (month_element == 11) {
                meses[10] = meses[10] + item.monto;
            } else if (month_element == 12) {
                meses[11] = meses[11] + item.monto;
            }
        }
        res.status(200).send({ data: meses });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const kpi_pagos_tipo = async function (req, res) {

    if (req.user) {

        let year = req.params.year;
        let month = req.params.month;

        let inicio = year + '-' + month + '-01';
        let hasta = new Date(year + '-' + month + '-01T00:00:00');
        hasta.setDate(hasta.getDate() + 30);

        var monto_servicios = 0;
        var monto_productos = 0;

        let pagos_servicios = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            tipo: 'Matricula'
        });

        let pagos_productos = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            tipo: 'Venta'
        });

        for (var item of pagos_servicios) {
            monto_servicios = monto_servicios + item.monto;
        }

        for (var item of pagos_productos) {
            monto_productos = monto_productos + item.monto;
        }

        res.status(200).send({ data: [monto_servicios, monto_productos] });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const kpi_metodos_pago = async function (req, res) {

    if (req.user) {

        let year = req.params.year;
        let month = req.params.month;

        let inicio = year + '-' + month + '-01';
        let hasta = new Date(year + '-' + month + '-01T00:00:00');
        hasta.setDate(hasta.getDate() + 30);

        var monto_paypal = 0;
        var monto_transferencia = 0;
        var monto_deposito = 0;
        var monto_tarjeta = 0;

        let pagos_paypal = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            metodo: 'Paypal'
        });

        let pagos_transferencia = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            metodo: 'Transferencia'
        });

        let pagos_deposito = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            metodo: 'Deposito'
        });

        let pagos_tarjeta = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            metodo: 'Tarjeta crédito'
        });


        for (var item of pagos_paypal) {
            monto_paypal = monto_paypal + item.monto;
        }

        for (var item of pagos_transferencia) {
            monto_transferencia = monto_transferencia + item.monto;
        }

        for (var item of pagos_deposito) {
            monto_deposito = monto_deposito + item.monto;
        }

        for (var item of pagos_tarjeta) {
            monto_tarjeta = monto_tarjeta + item.monto;
        }

        res.status(200).send({ data: [monto_paypal, monto_transferencia, monto_deposito, monto_tarjeta] });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const kpi_curso_ganancia = async function (req, res) {

    if (req.user) {

        let year = req.params.year;
        let month = req.params.month;

        let inicio = year + '-' + month + '-01';
        let hasta = new Date(year + '-' + month + '-01T00:00:00');
        hasta.setDate(hasta.getDate() + 30);

        let cursos = [];
        let reg_cursos = await Curso.find();

        for (var item of reg_cursos) {
            cursos.push(item.titulo);
        }

        let reg_pagos = await Pago.find({
            createdAt: {
                $gte: new Date(inicio + 'T00:00:00'),
                $lt: new Date(hasta),
            },
            tipo: 'Matricula'
        }).populate({
            path: 'matricula_detalle',
            populate: {
                path: 'curso'
            }
        });

        let montos = [];
        //CURSOS BASE:
        //programacion //diseño 
        for (var item of cursos) {
            //programacion
            let monto = 0;

            for (var subitem of reg_pagos) {
                if (subitem.matricula_detalle) {
                    if (item == subitem.matricula_detalle.curso.titulo) {
                        monto = monto + subitem.monto;
                    }
                }
            }
            montos.push(monto);
        }

        res.status(200).send({ cursos, montos });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const kpi_prospectos_mensuales = async function (req, res) {

    if (req.user) {

        let today = new Date();
        let year = today.getFullYear();

        let first = year + '-01-01';
        let last = year + '-12-31';

        let meses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        let clientes = await Cliente.find({
            createdAt: {
                $gte: new Date(first + 'T00:00:00'),
                $lt: new Date(last + 'T23:59:59'),
            }
        });


        for (item of clientes) {
            let element_date = new Date(item.createdAt);
            let month_element = element_date.getMonth() + 1
            if (month_element == 1) {
                meses[0] = meses[0] + 1;
            } else if (month_element == 2) {
                meses[1] = meses[1] + 1;
            } else if (month_element == 3) {
                meses[2] = meses[2] + 1;
            } else if (month_element == 4) {
                meses[3] = meses[3] + 1;
            } else if (month_element == 5) {
                meses[4] = meses[4] + 1;
            } else if (month_element == 6) {
                meses[5] = meses[5] + 1;
            } else if (month_element == 7) {
                meses[6] = meses[6] + 1;
            } else if (month_element == 8) {
                meses[7] = meses[7] + 1;
            } else if (month_element == 9) {
                meses[8] = meses[8] + 1;
            } else if (month_element == 10) {
                meses[9] = meses[9] + 1;
            } else if (month_element == 11) {
                meses[10] = meses[10] + 1;
            } else if (month_element == 12) {
                meses[11] = meses[11] + 1;
            }
        }
        res.status(200).send({ data: meses });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const kpi_prospectos_genero = async function (req, res) {

    if (req.user) {

        let today = new Date();
        let year = today.getFullYear();

        let first = year + '-01-01';
        let last = year + '-12-31';

        let generos = [0, 0];

        let clientes = await Cliente.find({
            createdAt: {
                $gte: new Date(first + 'T00:00:00'),
                $lt: new Date(last + 'T23:59:59'),
            }
        });

        for (item of clientes) {
            if (item.genero == 'Masculino') {
                generos[0] = generos[0] + 1
            } else if (item.genero == 'Femenino') {
                generos[1] = generos[1] + 1
            }
        }
        res.status(200).send({ data: generos });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

module.exports = {
    kpi_pagos_mensuales,
    kpi_pagos_tipo,
    kpi_metodos_pago,
    kpi_curso_ganancia,
    kpi_prospectos_mensuales,
    kpi_prospectos_genero
}
