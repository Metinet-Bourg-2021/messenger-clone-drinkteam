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

    }
}