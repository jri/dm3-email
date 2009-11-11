function EmailDocument() {

    this.do_send_email = function() {
        EmailDocument.prototype.update_document()
        //
        log("Sending mail")
        //
        var sender = get_sender()
        var recipients = {
            to: get_recipients("To"),
            cc: get_recipients("Cc"),
            bcc: get_recipients("Bcc")
        }
        var subject = get_field(current_doc, "Subject").content
        var message = get_field(current_doc, "Message").content
        send_email(sender, recipients, subject, message, current_doc._id)
    }

    function send_email(sender, recipients, subject, message, doc_id) {
        db.send_email(sender, recipients, subject, message, doc_id)
    }

    /**
     * Identifies contacts and workspaces as entered in the field and returns the identified recipients.
     *
     * @return  Identified recipients (object, key: recipient name, value: email address).
     */
    function get_recipients(field_id) {
        //
        var addressees = {}     // key: name as entered, value: true (identified) / false (not identified)
        var identified = {}     // key: name of identified contact, value: email address (may be empty)
        // "rcpts": Array of recipients as entered in the field. Each recipient is trimmed.
        var rcpts = get_field(current_doc, field_id).content.split(",")
        //
        log("..... recipients entered in \"" + field_id + "\" field (" + rcpts.length + ")")
        for (var i = 0; i < rcpts.length; i++) {    // Note: can't use the other for idiom because recipients may be empty (false)
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
    }

    function get_sender() {
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

    /**
     * @return  the contact names (array of string)
     */
    this.get_workspace_contacts = function(workspace_name) {
        log("Find contacts of workspace \"" + workspace_name + "\"")
        var contact_names = []
        // identify workspace
        var rows = db.view("deepamehta3/dm3-workspaces_by-name", {key: workspace_name}).rows
        log("..... identified workspaces (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            var topic_ids = related_doc_ids(row.id)
            var topics = db.view("deepamehta3/dm3-email", null, topic_ids).rows
            log(".......... \"" + row.key + "\" (" + row.id + "), " + topics.length + " contacts:")
            for (var j = 0, topic; topic = topics[j]; j++) {
                log("............... \"" + topic.value[0] + "\" => \"" + topic.value[1] + "\"")
                contact_names.push(topic.value[0])
            }
        }
        return contact_names
    }
}

EmailDocument.prototype = {

    __proto__: PlainDocument.prototype,

    /*** Overriding hooks ***/

    post_render_form: function() {
        // Note: super is not called here
        //
        // we add our own buttons
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "send_button", value: "Send"}))
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "save_button", value: "Save as draft"}))
        $("#send_button").click(this.do_send_email)
        $("#save_button").click(this.update_document)
    },

    /**
     * Renders one item of the suggestion menu.
     *
     * @param   item    the item as returned by the fulltext index function (array).
     * @return  The HTML rendering of the item (string).
     */
    render_autocomplete_item: function(item) {
        var html = "<img src=\"" + get_icon_src(item[0]) + "\" border=\"0\" align=\"absmiddle\"> " + item[1]
        switch (item[0]) {
            case "Contact":
                if (item[2]) {
                    return html + " <span style=\"color: gray\">&lt;" + item[2] + "></span>"
                } else {
                    return html + " <span style=\"color: gray\">&lt;<span style=\"color: red; font-weight: bold\">unknown email address</span>></span>"
                }
            case "Workspace":
                return html
            default:
                alert("EmailDocument.render_autocomplete_item: unexpected item: " + JSON.stringify(item))
        }
    },

    process_autocomplete_selection: function(item) {
        switch (item[0]) {
            case "Contact":
                return item[1]
            case "Workspace":
                return this.get_workspace_contacts(item[1]).join(", ")
            default:
                alert("EmailDocument.process_autocomplete_selection: unexpected item: " + JSON.stringify(item))
        }
    }
}
