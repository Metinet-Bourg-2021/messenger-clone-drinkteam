const { io } = require("../modules/SocketIO")
const User = require("../class/User");
const JWT = require("jsonwebtoken");
const {ConversationSchema} = require("../models/ConversationModel");
const Mongoose = require("mongoose");
const Association  = require("../modules/socketAssociation");


io.on("connection", (socket) => {
    socket.on("@reactMessage", async ({ token, conversation_id, message_id, reaction }, callback) => {
        await Association.associate(null, token, socket)

        console.log("@reactMessage")
        // console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

        if (token) {
            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            let result = await ConversationSchema.updateOne(
                {
                    _id: conversation_id,
                    messages: {
                        $elemMatch: {
                            id : Mongoose.Types.ObjectId(message_id)
                        }
                    }
                },
                {
                    $push: {
                        "messages.$.reactions" : reaction
                    }
                }
            )

            ConversationSchema.findOne({
                _id: conversation_id,
                messages: {
                    $elemMatch: {
                        id : Mongoose.Types.ObjectId(message_id)
                    }
                }
            }).then((conversation) => {
                let message = conversation.messages.find(m => m.id.toString() === message_id)
                if (message !== undefined) {
//                    io.emit("@messageReacted", {
//                        "conversation_id" : conversation_id,
//                        "message" : message
//                    })
                    conversation.participants.forEach((participant) => {
                        if (participant !== me.username) {
                            let userSocket = Association.getAssociation(participant)
                            if (userSocket !== false) userSocket.emit("@messageReacted", {
                                "conversation_id": conversation_id,
                                "message": message
                            })
                        }
                    })
                }
            })

            // console.log(result)

            callback({code:"SUCCESS", data:{}});
        }
    });
})