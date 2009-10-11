function dm3_email() {
    doctype_implementation("vendor/dm3-email/script/email.js")

    db.send_email = function(recipients) {
        var uri = this.uri + "_mailer"
        this.last_req = this.request("POST", uri, {body: JSON.stringify(recipients)})
        // if (this.last_req.status == 404)
        //    return null
        CouchDB.maybeThrowError(this.last_req)
        // return JSON.parse(this.last_req.responseText)
    }
}

dm3_email.prototype = {

    init: function() {
        // alert("dm3_email.init:")
        types["Email"] = {
            fields: [
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
            implementation: "Email"
        }
    }
}
