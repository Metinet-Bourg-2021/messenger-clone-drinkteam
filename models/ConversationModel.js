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
        required: true
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
    }
}, { minimize: false });



module.exports = mongoose.model('Conversation', conversationSchema);