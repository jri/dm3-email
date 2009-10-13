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
        var sender = Email.prototype.get_sender()
        var recipients = {
            to: Email.prototype.get_recipients("To"),
            cc: Email.prototype.get_recipients("Cc"),
            bcc: Email.prototype.get_recipients("Bcc")
        }
        var subject = get_field(current_doc, "Subject").content
        var message = get_field(current_doc, "Message").content
        Email.prototype.send_email(sender, recipients, subject, message)
    },

    send_email: function(sender, recipients, subject, message) {
        db.send_email(sender, recipients, subject, message)
    },

    /**
     * Identifies contacts and workspaces as entered in the field and returns the identified recipients.
     *
     * @return  Identified recipients, as object: key - recipient name, value - email address.
     */
    get_recipients: function(field_id) {
        //
        var addressees = {}     // key: name as entered, value: true (identified) / false (not identified)
        var identified = {}     // key: name of identified contact, value: email address (may be empty)
        //
        var rcpts = get_field(current_doc, field_id).content.split(",")
        log("..... recipients entered in \"" + field_id + "\" field (" + rcpts.length + ")")
        for (var i = 0; i < rcpts.length; i++) {    // Note: can' use the other for idiom because may be empty (false)
            rcpts[i] = jQuery.trim(rcpts[i])
            log("............... \"" + rcpts[i] + "\"")
            addressees[rcpts[i]] = false            // not yet identified
        }
        // identify contacts
        var rows = db.view("deepamehta3/dm3-contacts_by-name", null, rcpts).rows
        log(".......... identified contacts (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            log("............... \"" + row.key + "\" => \"" + row.value + "\"")
            addressees[row.key] = true              // identified
            identified[row.key] = row.value
        }
        // identify workspaces
        var rows = db.view("deepamehta3/dm3-workspaces_by-name", null, rcpts).rows
        log(".......... identified workspaces (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            log("............... \"" + row.key + "\" (" + row.id + ")")
            addressees[row.key] = true              // identified
            var topic_ids = related_doc_ids(row.id)
            var topics = db.view("deepamehta3/dm3-email", null, topic_ids).rows
            for (var j = 0, topic; topic = topics[j]; j++) {
                log(".................... \"" + topic.value[0] + "\" => \"" + topic.value[1] + "\"")
                identified[topic.value[0]] = topic.value[1]
            }
        }
        //
        log(".......... not identified:")
        var count = 0
        for (var adr in addressees) {
            if (!addressees[adr]) {
                log("............... \"" + adr + "\"")
                count++
            }
        }
        log(".......... => " + count)
        //
        log(".......... unknown email addresses:")
        var count = 0
        for (var rcpt in identified) {
            if (!identified[rcpt]) {
                log("............... \"" + rcpt + "\"")
                count++
            }
        }
        log(".......... => " + count)
        //
        log(".......... individual email addresses:")
        var recipients = {}     // key: recipient name, value: email address
        var count = 0
        for (var rcpt in identified) {
            if (identified[rcpt]) {
                log("............... \"" + rcpt + "\" => \"" + identified[rcpt] + "\"")
                recipients[rcpt] = identified[rcpt]
                count++
            }
        }
        log(".......... => " + count)
        //
        return recipients
    },

    get_sender: function() {
        var sender = {}
        var sender_name = get_field(current_doc, "From").content
        var rows = db.view("deepamehta3/dm3-contacts_by-name", {key: sender_name}).rows
        if (rows.length == 0) {
            log("..... sender: \"" + sender_name + "\" => not identified")
        } else if (rows.length == 1) {
            row = rows[0]
            log("..... sender: \"" + row.key + "\" => \"" + row.value + "\"")
            sender[row.key] = row.value
        } else {
            log("..... sender: \"" + sender_name + "\" => more than one contact found (" + rows.length + ")")
        }
        return sender
    }
}
