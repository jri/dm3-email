function dm3_email() {
    doctype_implementation("vendor/dm3-email/script/email.js")

    db.send_email = function(sender, recipients, subject, message, doc_id) {
        var uri = this.uri + "_mailer/" + doc_id
        this.last_req = this.request("POST", uri, {body: JSON.stringify({
            sender: sender,
            recipients: recipients,
            subject: subject,
            message: message
        })})
        // if (this.last_req.status == 404)
        //    return null
        CouchDB.maybeThrowError(this.last_req)
        // return JSON.parse(this.last_req.responseText)
    }
}

dm3_email.prototype = {

    init: function() {
        types["Email"] = {
            fields: [
                {
                    id: "From",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "single line",
                        autocomplete_indexes: ["dm3-contacts"],
                        autocomplete_style: "default"
                    },
                    content: ""
                },
                {
                    id: "To",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "single line",
                        autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"],
                        autocomplete_style: "item list"
                    },
                    content: ""
                },
                {
                    id: "Cc",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "single line",
                        autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"],
                        autocomplete_style: "item list"
                    },
                    content: ""
                },
                {
                    id: "Bcc",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "single line",
                        autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"],
                        autocomplete_style: "item list"
                    },
                    content: ""
                },
                {
                    id: "Subject",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "single line"
                    },
                    content: ""
                },
                {
                    id: "Message",
                    model: {
                        type: "text",
                    },
                    view: {
                        editor: "multi line",
                        lines: 18
                    },
                    content: ""
                }
            ],
            implementation: "Email",
            icon_src: "vendor/dm3-email/images/envelope.png"
        }
    }
}
