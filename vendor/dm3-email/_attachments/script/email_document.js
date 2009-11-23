function EmailDocument() {

    var obj = this

    this.do_send_email = function() {
        EmailDocument.prototype.update_document()
        //
        log("Sending mail")
        //
        var sender = get_sender()
        // identify recipients
        var recipients_to = get_recipients("To")
        var recipients_cc = get_recipients("Cc")
        var recipients_bcc = get_recipients("Bcc")
        // check for invalid recipients
        var not_identified = [].concat(recipients_to[1], recipients_cc[1], recipients_bcc[1])
        var address_unknown = [].concat(recipients_to[2], recipients_cc[2], recipients_bcc[2])
        if (!do_proceed(not_identified, address_unknown)) {
            return
        }
        // send mail
        var recipients = {
            to: recipients_to[0],
            cc: recipients_cc[0],
            bcc: recipients_bcc[0]
        }
        var subject = get_field(current_doc, "Subject").content
        var message = get_field(current_doc, "Message").content
        send_email(sender, recipients, subject, message, current_doc._id)
    }

    function send_email(sender, recipients, subject, message, doc_id) {
        var response = db.send_email(sender, recipients, subject, message, doc_id)
        if (response.success) {
            alert("Sending mail SUCCESSFUL.\n\n" + response.message)
        } else {
            alert("Sending mail FAILED.\n\n" + response.message)
        }
    }

    /**
     * Identifies contacts as entered in the field and returns the result.
     *
     * @return  Array of 3 objects:
     *          [0] - Identified recipients (object, key: recipient name, value: email address).
     *          [1] - For error report: Not identified recipients (array of recipient names).
     *          [2] - For error report: Identified recipients but with unknown email address (array of recipient names).
     */
    function get_recipients(field_id) {
        //
        var addressees = {}     // key: name as entered, value: true (identified) / false (not identified)
        var identified = {}     // key: name of identified contact, value: email address (may be empty)
        // "rcpts": Array of recipients as entered in the field. Each recipient is trimmed.
        var rcpts = get_field(current_doc, field_id).content.split(",")
        //
        log("..... recipients entered in \"" + field_id + "\" field")
        var count = 0
        for (var i = 0; i < rcpts.length; i++) {    // Note: can't use the other for idiom because recipients may be empty (false)
            rcpts[i] = jQuery.trim(rcpts[i])
            if (rcpts[i]) {
                log("............... \"" + rcpts[i] + "\"")
                addressees[rcpts[i]] = false            // not yet identified
                count++
            }
        }
        log("............... => " + count)
        // identify contacts
        var rows = db.view("deepamehta3/dm3-contacts_by-name", null, keys(addressees)).rows
        log(".......... identified contacts (" + rows.length + ")")
        for (var i = 0, row; row = rows[i]; i++) {
            log("............... \"" + row.key + "\" => \"" + row.value + "\"")
            var email_address = obj.email_address(row.value)
            if (email_address != row.value) {
                log(".................... WARNING: only the 1st email address is used")
            }
            identified[row.key] = email_address
            addressees[row.key] = true              // identified
        }
        //
        log(".......... not identified:")
        var not_identified = []
        var count = 0
        for (var adr in addressees) {
            if (!addressees[adr]) {
                log("............... \"" + adr + "\"")
                not_identified.push(adr)
                count++
            }
        }
        log("............... => " + count)
        //
        log(".......... unknown email addresses:")
        address_unknown = []
        var count = 0
        for (var rcpt in identified) {
            if (!identified[rcpt]) {
                log("............... \"" + rcpt + "\"")
                address_unknown.push(rcpt)
                count++
            }
        }
        log("............... => " + count)
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
        log("............... => " + count)
        //
        return [recipients, not_identified, address_unknown]
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

    function do_proceed(not_identified, address_unknown) {
        if (!not_identified.length && !address_unknown.length) {
            return true
        }
        var message = ""
        if (not_identified.length) {
            message += not_identified.length + " recipients can not be identified:\n"
            for (var i = 0, recipient; recipient = not_identified[i]; i++) {
                message += "     " + recipient + "\n"
            }
        }
        if (address_unknown.length) {
            message += address_unknown.length + " recipients have no email address:\n"
            for (var i = 0, recipient; recipient = address_unknown[i]; i++) {
                message += "     " + recipient + "\n"
            }
        }
        message += "Do you want send the mail anyway?"
        return confirm(message)
    }

    /**
     * Returns the first email address.
     *
     * @param   email_string    a string containing one ore more email addresses.
     *                          An arbitrary run of spaces, commas, and/or newlines is expected as the separator.
     */
    this.email_address = function(email_string) {
        return email_string.split(/[ ,\n]+/)[0]
    }
}

EmailDocument.prototype = {

    __proto__: PlainDocument.prototype,

    /*** Overriding Hooks ***/

    post_render_form: function() {
        // Note: super is not called here
        //
        // we add our own buttons
        $("#lower_toolbar").append("<button id='send_button'>")
        $("#lower_toolbar").append("<button id='save_button'>")
        ui.button("send_button", this.do_send_email, "Send", "mail-closed")
        ui.button("save_button", this.update_document, "Save as Draft", "check")
    },

    /**
     * Renders one item of the suggestion menu.
     *
     * @param   item    the item (array) as returned by the fulltext index functions ("dm3-contacts" and "dm3-workspaces").
     *                  item[0] - Topic type.
     *                  item[1] - Topic label.
     *                  item[2] - Email address (in case of "dm3-contacts").
     * @return  The HTML rendering of the item (string).
     */
    render_autocomplete_item: function(item) {
        var ac_item = $("<div>")
        ac_item.append(type_icon_tag(item[0], "menu-icon"))
        ac_item.append(item[1])
        switch (item[0]) {
            case "Person":
            case "Institution":
                // append email address
                var email = $("<span>").addClass("email-address")
                email.append("<")
                if (item[2]) {
                    email.append(this.email_address(item[2]))
                } else {
                    email.append($("<span>").addClass("email-unknown").text("unknown email address"))
                }
                email.append(">")
                //
                ac_item.append(email)
                break
            case "Workspace":
                break
            default:
                alert("EmailDocument.render_autocomplete_item: unexpected item: " + JSON.stringify(item))
        }
        return ac_item
    },

    process_autocomplete_selection: function(item) {
        switch (item[0]) {
            case "Person":
            case "Institution":
                return item[1]
            case "Workspace":
                return this.get_workspace_contacts(item[1]).join(", ")
            default:
                alert("EmailDocument.process_autocomplete_selection: unexpected item: " + JSON.stringify(item))
        }
    }
}
