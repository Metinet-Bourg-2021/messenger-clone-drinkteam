const { conversationSchema } = require("../models/ConversationModel")
const Bcrypt = require("bcrypt");
const {UserSchema} = require("../models/UserModel");


module.exports = class Conversation {
    id = null
    type = null
    participants = null
    messages = []
    title = null
    theme = null
    updated_at = null
    seen = {}
    typing = {}

    constructor(id = null,
                type = null,
                participants = null,
                messages = [],
                title = null,
                theme = null,
                updated_at = null,
                seen = {},
                typing = {})
    {
        this.id = id
        this.type = type
        this.participants = participants
        this.messages = messages
        this.title = title
        this.theme = theme
        this.updated_at = updated_at
        this.seen = seen
        this.typing = typing
    }


    async createConversation(conversation = null)
    {
            this.id = conversation._id.toString() || null
            this.type = conversation.type
            this.participants = conversation.participants
            this.messages = conversation.messages || []
            this.title = conversation.title
            this.theme = conversation.theme
            this.updated_at = conversation.updated_at
            this.seen = conversation.seen
            this.typing = conversation.typing

    }

    toJSON(associative = false) {
        if (associative) {
            return {
                _id : this.id,
                type: this.type,
                participants: this.participants,
                messages: this.messages,
                title: this.title,
                theme: this.theme,
                updated_at: this.updated_at,
                seen: this.seen,
                typing: this.typing
            }
        } else {
            return {
                id : this.id || null,
                type: this.type,
                participants: this.participants,
                messages: this.messages,
                title: this.title,
                theme: this.theme,
                updated_at: this.updated_at,
                seen: this.seen,
                typing: this.typing
            }
        }
    }
}
