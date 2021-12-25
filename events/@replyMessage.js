const { io } = require("../modules/SocketIO")
const User = require("../class/User");
const JWT = require("jsonwebtoken");
const {ConversationSchema} = require("../models/ConversationModel");
const Mongoose = require("mongoose");
const Message = require("../class/Message");
const Association  = require("../modules/socketAssociation");


io.on("connection", (socket) => {
    socket.on("@replyMessage", async ({ token, conversation_id, message_id, content }, callback) => {
        console.log("@replyMessage")
        await Association.associate(null,token,socket)
        // console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

        if (token) {
            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            let conv = await ConversationSchema.findOne({ _id : conversation_id })
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

            await ConversationSchema.updateOne(
                { _id : conversation_id },
                { $push : {
                        messages: messageObject.toJSON()
                    }}
            )

            conv.participants.forEach((participant) => {
                if (participant !== me.username) {
                    let userSocket = Association.getAssociation(me.username)
                    if (userSocket !== false) userSocket.emit("@replyMessage", {
                        message : messageObject.toJSON()
                    })
                }
            })

            // console.log(messageObject.toJSON())

            callback({code:"SUCCESS", data: {
                    message : messageObject.toJSON()
                }});
        }
    });
})