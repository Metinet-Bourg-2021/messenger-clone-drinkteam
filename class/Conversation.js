const { conversationSchema } = require("../models/ConversationModel")
const Bcrypt = require("bcrypt");
const {UserSchema} = require("../models/UserModel");


module.exports = class Conversation {
    id = null
    type = null
    participants = null
    messages = null
    title = null
    theme = false
    updated_at = false
    seen = false
    typing = false

    constructor(id = null,
                type = null,
                participants = null,
                messages = null,
                title = null,
                theme = null,
                updated_at = null,
                seen = null,
                typing = null)
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


    async create(type = null,
                 participants = null,
                 messages = null,
                 title = null,
                 theme = null,
                 updated_at = null,
                 seen = null,
                 typing = null)
    {

            this.type = type
            this.participants = participants
            this.messages = messages
            this.title = title
            this.theme = theme
            this.updated_at = updated_at
            this.seen = seen
            this.typing = typing

            await conversationSchema.create(this.toJSON())

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