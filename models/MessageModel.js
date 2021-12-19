const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    posted_at : {
        type: String,
        required: true
    },
    delivered_to: {
        type: Array,
        required: true
    },
    reply_to: {
        type: String,
        required: true,
        default: null
    },
    edited: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    reactions: {
        type: JSON,
        required: true,
        default: {}
    }
}, { minimize: false });

module.exports = {
    MessageSchema : mongoose.model('Message', messageSchema)
}
