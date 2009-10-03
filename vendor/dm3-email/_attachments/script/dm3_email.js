function dm3_email() {
    doctype_implementation("vendor/dm3-email/script/email.js")
    // css_stylesheet("vendor/dm3-workspaces/style/dm3-workspaces.css")
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
