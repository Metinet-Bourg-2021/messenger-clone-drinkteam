    const mongoose = require('mongoose');

// jbz vos daronnes

const conversationSchema = mongoose.Schema({
    type:{
        type :String,
        required: true
    },
    participants:{
        type :Array,
        required: true
    },

    title: {
        type :String,
        required: false,
        default: null
    },

    theme: {
        type:String,
        required: true
    },

    updated_at: {
        type:Date,
        required: true
    },

    seen: {
        type:JSON,
        required: true
    },

    typing: {
        type:JSON,
        required: true
    },

    messages: {
        type: Array,
        required: true,
        default: []
    }
}, { minimize: false });



module.exports = {
    ConversationSchema : mongoose.model('Conversation', conversationSchema)
};