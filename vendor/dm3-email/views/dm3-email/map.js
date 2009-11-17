function(doc) {

    // !code lib/helpers/helpers.js

    if (doc.type == "Topic") {
        var email_field = get_field("Email")
        if (email_field) {
            emit(doc._id, [topic_label(), email_field.content])
        }
    }
}
