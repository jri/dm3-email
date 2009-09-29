function Email() {
    this.name = "Email"
}

Email.prototype = {

    __proto__: PlainDocument.prototype,

    // override method
    post_render_form: function() {
        // Note: super is not called here
        //
        // append our own buttons
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "send_button", value: "Send"}))
        $("#lower_toolbar").append($("<input>").attr({type: "button", id: "save_button", value: "Save as draft"}))
        $("#send_button").click(this.send_email)
        $("#save_button").click(this.update_document)
    },

    send_email: function() {
        alert("send_email:")
    }
}
