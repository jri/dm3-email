function(doc) {

    function get_field(field_id) {
        for (var i = 0, field; field = doc.fields[i]; i++) {
            if (field.id == field_id) {
                return field
            }
        }
    }

    if (doc.type == "Topic") {
        var email_field = get_field("Email")
        if (email_field) {
            emit(doc._id, [doc.fields[0].content, email_field.content])
        }
    }
}
