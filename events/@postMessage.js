const { io } = require("../modules/SocketIO")
const User = require("../class/User");
const JWT = require("jsonwebtoken");

const { MessageSchema } = require("../models/MessageModel")
const Message = require("../class/Message")
const {ConversationSchema} = require("../models/ConversationModel");

const Mongoose = require("mongoose")

io.on("connection", (socket) => {
    socket.on("@postMessage", async ({ token, conversation_id, content }, callback) => {
        console.log("@postMessage")

        if (token) {
            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            let messageObject = new Message()
            messageObject.id = Mongoose.Types.ObjectId()
            messageObject.from = me.username
            messageObject.content = content
            messageObject.posted_at = new Date()
            messageObject.delivered_to = []
            messageObject.reply_to = null
            messageObject.edited = false
            messageObject.deleted = false
            messageObject.reactions = []

            messageObject.delivered_to[`${me.username}`] = new Date()

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