

const { messageSchema } = require("../models/MessageModel")


module.exports = class Message {
    id = null
    from = null
    content = null
    posted_at = null
    delivered_to = null
    reply_to = null
    edited = false
    deleted = false
    reactions = {}

    constructor(id = null,
                from = null,
                content = null,
                posted_at = null,
                delivered_to = null,
                reply_to = null,
                edited = false,
                deleted = false,
                reactions = {})
    {
        
        this.id = id
        this.from = from
        this.content = content
        this.posted_at = posted_at
        this.delivered_to = delivered_to
        this.reply_to = reply_to
        this.edited = edited
        this.deleted = deleted
        this.reactions = reactions

    }

    async createMessage(message = null) {
        this.id = message._id.toString() || null
        this.from = message.from
        this.content = message.content
        this.posted_at = message.posted_at
        this.delivered_to = message.delivered_to
        this.reply_to = message.reply_to
        this.edited = message.edited
        this.deleted = message.deleted
        this.reactions = message.reactions
    }

    toJSON(associative = false) {
        if (associative) {
            return {
                _id : this.id,
                from: this.from,
                content : this.content,
                posted_at : this.posted_at,
                delivered_to : this.delivered_to,
                reply_to : this.reply_to,
                edited : this.edited,
                deleted : this.deleted,
                reactions : this.reactions
            }
        } else {
            return {
                id : this.id || null,
                from: this.from,
                content : this.content,
                posted_at : this.posted_at,
                delivered_to : this.delivered_to,
                reply_to : this.reply_to,
                edited : this.edited,
                deleted : this.deleted,
                reactions : this.reactions
            }
        }
    }
}