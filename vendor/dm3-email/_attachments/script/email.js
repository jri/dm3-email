function Email() {
    this.name = "Email"
}

Email.prototype = {

    __proto__: PlainDocument.prototype,

    // override method
    post_render_form: function() {
        // Note: super is not called here
        //
        // we add our own buttons
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "send_button", value: "Send"}))
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "save_button", value: "Save as draft"}))
        $("#send_button").click(this.do_send_email)
        $("#save_button").click(this.update_document)
    },

    do_send_email: function() {
        Email.prototype.update_document()
        //
        log("Sending mail")
        //
        var recipients = Email.prototype.get_recipients("To")
        Email.prototype.send_email(recipients)
    },

    send_email: function(recipients) {
        db.send_email(recipients)
    },

    get_recipients: function(field_id) {
        //
        var addressees = {}     // key: name as entered, value: true (identified) / false (not identified)
        var identified = {}     // key: name of identified contact, value: email address (may be empty)
        //
        var rcpts = get_field(current_doc, field_id).content.split(",")
        for (var i = 0; i < rcpts.length; i++) {
            rcpts[i] = jQuery.trim(rcpts[i])
        }
        log("..... recipients entered in \"" + field_id + "\" field (" + rcpts.length + ")")
        for (var i = 0, recipient; recipient = rcpts[i]; i++) {
            log(".......... \"" + recipient + "\"")
            addressees[recipient] = false   // not yet identified
        }
        // Contacts
        var rows = db.view("deepamehta3/dm3-contacts_by-name", null, rcpts).rows
        log("..... identified contacts (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            log(".......... \"" + row.key + "\" => \"" + row.value + "\"")
            addressees[row.key] = true      // identified
            identified[row.key] = row.value
        }
        // Workspaces
        var rows = db.view("deepamehta3/dm3-workspaces_by-name", null, rcpts).rows
        log("..... identified workspaces (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            log(".......... \"" + row.key + "\" (" + row.id + ")")
            addressees[row.key] = true      // identified
            var topic_ids = related_doc_ids(row.id)
            var topics = db.view("deepamehta3/dm3-email", null, topic_ids).rows
            for (var j = 0, topic; topic = topics[j]; j++) {
                log("............... \"" + topic.value[0] + "\" => \"" + topic.value[1] + "\"")
                identified[topic.value[0]] = topic.value[1]
            }
        }
        //
        log("..... not identified:")
        var count = 0
        for (var adr in addressees) {
            if (!addressees[adr]) {
                log(".......... \"" + adr + "\"")
                count++
            }
        }
        log("..... => " + count)
        //
        log("..... unknown email addresses:")
        var count = 0
        for (var rcpt in identified) {
            if (identified[rcpt] == "") {
                log(".......... \"" + rcpt + "\"")
                count++
            }
        }
        log("..... => " + count)
        //
        log("..... individual email addresses:")
        var recipients = {}     // key: recipient name, value: email address
        var count = 0
        for (var rcpt in identified) {
            if (identified[rcpt]) {
                log(".......... \"" + rcpt + "\" => \"" + identified[rcpt] + "\"")
                recipients[rcpt] = identified[rcpt]
                count++
            }
        }
        log("..... => " + count)
        //
        return recipients
    }
}
