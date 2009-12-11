function dm3_email() {

    doctype_implementation("vendor/dm3-email/script/email_document.js")
    css_stylesheet("vendor/dm3-email/style/dm3-email.css")

    types["Email"] = {
        fields: [
            {id: "From",    model: {type: "text"}, view: {editor: "single line", autocomplete_indexes: ["dm3-contacts"],                   autocomplete_style: "default"},   content: ""},
            {id: "To",      model: {type: "text"}, view: {editor: "single line", autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"], autocomplete_style: "item list"}, content: ""},
            {id: "Cc",      model: {type: "text"}, view: {editor: "single line", autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"], autocomplete_style: "item list"}, content: ""},
            {id: "Bcc",     model: {type: "text"}, view: {editor: "single line", autocomplete_indexes: ["dm3-contacts", "dm3-workspaces"], autocomplete_style: "item list"}, content: ""},
            {id: "Subject", model: {type: "text"}, view: {editor: "single line"},           content: ""},
            {id: "Message", model: {type: "html"}, view: {editor: "multi line", lines: 18}, content: ""}
        ],
        view: {
            icon_src: "vendor/dm3-email/images/envelope.png",
            label_field: "Subject"
        },
        implementation: "EmailDocument"
    }

    db.send_email = function(sender, recipients, subject, message, format, doc_id) {
        var uri = this.uri + "_mailer/" + doc_id
        this.last_req = this.request("POST", uri, {body: JSON.stringify({
            sender: sender,
            recipients: recipients,
            subject: subject,
            message: message,
            "message-format": format
        })})
        CouchDB.maybeThrowError(this.last_req)
        return JSON.parse(this.last_req.responseText)
    }
}
