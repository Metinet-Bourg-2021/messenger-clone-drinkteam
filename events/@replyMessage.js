const { io } = require("../modules/SocketIO")
const User = require("../class/User");
const JWT = require("jsonwebtoken");
const {ConversationSchema} = require("../models/ConversationModel");
const Mongoose = require("mongoose");
const Message = require("../class/Message");

io.on("connection", (socket) => {
    socket.on("@replyMessage", async ({ token, conversation_id, message_id, content }, callback) => {
        console.log("@replyMessage")

        console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

        if (token) {
            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            let responseMessage = await ConversationSchema.findOne({ _id : conversation_id })
            if (responseMessage) responseMessage = responseMessage.messages.find(m => m.id.toString() === message_id)

            let messageObject = new Message()
            messageObject.id = Mongoose.Types.ObjectId()
            messageObject.from = me.username
            messageObject.content = content
            messageObject.posted_at = new Date()
            messageObject.delivered_to = []
            messageObject.reply_to = responseMessage
            messageObject.edited = false
            messageObject.deleted = false
            messageObject.reactions = {}

            messageObject.delivered_to[`${me.username}`] = new Date()

            // responseMessage.messages.forEach((message) => {
            //     console.log(`${message.id.toString()} : ${message_id}`)
            // })

            // console.log(responseMessage.messages.find(m => m.id === Mongoose.Types.ObjectId(message_id)))

            await ConversationSchema.updateOne(
                { _id : conversation_id },
                { $push : {
                        messages: messageObject.toJSON()
                    }}
            )

            console.log(messageObject.toJSON())

            callback({code:"SUCCESS", data: {
                    message : messageObject.toJSON()
                }});
        }
    });
})