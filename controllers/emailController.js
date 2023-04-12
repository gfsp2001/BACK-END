const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

const obtener_listas_contactos = async function (req, res) {

    if (req.user) {

        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let opts = {
            'limit': 10,
            'offset': 0
        };
        apiInstance.getLists(opts).then((data) => {

            res.status(200).send({ data: data });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });



    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const crear_lista_contactos = async function (req, res) {

    if (req.user) {

        let data = req.body;
        let apiInstance = new SibApiV3Sdk.ContactsApi();
        let createList = new SibApiV3Sdk.CreateList();

        createList.name = data.titulo;
        createList.folderId = 1;

        apiInstance.createList(createList).then((data) => {

            res.status(200).json({ data: data });

        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_detalle_lista = async function (req, res) {

    if (req.user) {

        let id = req.params.id;
        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let listId = id;

        apiInstance.getList(listId).then((data) => {
            res.status(200).send({ data: data });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const editar_lista_contactos = async function (req, res) {

    if (req.user) {

        let id = req.params.id;
        let data = req.body;

        let listId = id;
        let apiInstance = new SibApiV3Sdk.ContactsApi();
        let updateList = new SibApiV3Sdk.UpdateList();

        updateList.name = data.titulo;

        apiInstance.updateList(listId, updateList).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const eliminar_lista = async function (req, res) {

    if (req.user) {

        let id = req.params.id;
        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let listId = id;

        apiInstance.deleteList(listId).then((data) => {
            res.status(200).send({ data: true });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const importar_contactos = async function (req, res) {

    if (req.user) {

        let data = req.body;

        let apiInstance = new SibApiV3Sdk.ContactsApi();
        let requestContactImport = new SibApiV3Sdk.RequestContactImport();

        let arr_list = [];
        arr_list.push(data.idlist);

        requestContactImport.fileBody = data.str_import;
        requestContactImport.listIds = arr_list;
        requestContactImport.emailBlacklist = false;
        requestContactImport.smsBlacklist = false;
        requestContactImport.updateExistingContacts = true;
        requestContactImport.emptyContactsAttributes = false;

        apiInstance.importContacts(requestContactImport).then((data) => {
            res.status(200).send({ data: data });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const obtener_contactos_lista = async function (req, res) {

    if (req.user) {
        let id = req.params.id;

        let apiInstance = new SibApiV3Sdk.ContactsApi();
        let listId = id;

        let opts = {
            'limit': 500,
            'offset': 0
        };

        apiInstance.getContactsFromList(listId, opts).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const obtener_campaings = async function (req, res) {

    if (req.user) {

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

        let opts = {
            'type': "classic",
            'limit': 100,
            'offset': 0
        };
        apiInstance.getEmailCampaigns(opts).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });


    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const crear_campaign = async function (req, res) {

    if (req.user) {

        let data = req.body;
        let arr_list = [];
        arr_list.push(parseInt(data.listid));

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
        emailCampaigns = {
            tag: 'myTag',
            sender: { name: 'Giancarlo', email: 'gfsp2001@hotmail.com' },
            name: data.name,
            subject: data.subject,
            htmlContent: data.html_content,
            replyTo: 'gfsp2001@hotmail.com',
            recipients: { listIds: arr_list },
            inlineImageActivation: false,
            mirrorActive: false,
            recurring: false,
            type: 'classic',
        }
        apiInstance.createEmailCampaign(emailCampaigns).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const obtener_one_campaign = async function (req, res) {

    if (req.user) {

        let id = req.params.id;

        let campaignId = id;
        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

        apiInstance.getEmailCampaign(campaignId).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const editar_campaign = async function (req, res) {

    if (req.user) {

        let id = req.params.id;
        let data = req.body;
        let arr_list = [];
        arr_list.push(parseInt(data.listid));

        let campaignId = id;
        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let emailCampaign = new SibApiV3Sdk.UpdateEmailCampaign();

        emailCampaign = {
            tag: 'myTag',
            sender: { name: 'Giancarlo', email: 'gfsp2001@hotmail.com' },
            name: data.name,
            subject: data.subject,
            htmlContent: data.html_content,
            replyTo: 'gfsp2001@hotmail.com',
            recipients: { listIds: arr_list },
            inlineImageActivation: false,
            mirrorActive: false,
            recurring: false,
            type: 'classic',
        };

        apiInstance.updateEmailCampaign(campaignId, emailCampaign).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const eliminar_campaign = async function (req, res) {

    if (req.user) {

        let id = req.params.id;

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

        let campaignId = id;

        apiInstance.deleteEmailCampaign(campaignId).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const enviar_email_campaign = async function (req, res) {

    if (req.user) {

        let data = req.body;
        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let campaignId = data.id;

        apiInstance.sendEmailCampaignNow(campaignId).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

module.exports = {
    obtener_listas_contactos,
    crear_lista_contactos,
    editar_lista_contactos,
    eliminar_lista,
    importar_contactos,
    obtener_contactos_lista,
    obtener_campaings,
    obtener_one_campaign,
    crear_campaign,
    editar_campaign,
    eliminar_campaign,
    enviar_email_campaign,

}