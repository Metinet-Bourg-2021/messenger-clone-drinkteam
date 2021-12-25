const { io } = require("../modules/SocketIO")
const Association  = require("../modules/socketAssociation");
const {ConversationSchema} = require("../models/ConversationModel");
const Mongoose = require("mongoose");
const User = require("../class/User");
const JWT = require("jsonwebtoken");

io.on("connection", (socket) => {
    socket.on("@deleteMessage", async ({ token, conversation_id, message_id }, callback) => {
      await Association.associate(null,token,socket)

        let me = new User()
        let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
        await me.find(decoded.userId)

        console.log("@deleteMessage")

        // console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

        if (token) {
            let message = await ConversationSchema.findOne({
                _id: conversation_id,
                messages: {
                    $elemMatch: {
                        id : Mongoose.Types.ObjectId(message_id)
                    }
                }
            })

            if (message) message = message.messages.find(m => m.id.toString() === message_id)

            // console.log(message)

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
                    message.deleted = true

                    conversation.participants.forEach((participant) => {
                        if (participant !== me.username) {
                            let userSocket = Association.getAssociation(participant)
                            if (userSocket !== false) userSocket.emit("@deleteMessage", {
                                message : message.toJSON()
                            })
                        }
                    })


                    callback({
                        code: "SUCCESS",
                        data: {
                            "message": message.toJSON()
                        }

                    });

                }
            })

            const result = await ConversationSchema.updateOne(
                {
                    _id: conversation_id,
                    messages: {
                        $elemMatch: {
                            id : Mongoose.Types.ObjectId(message_id)
                        }
                    }
                },
                {
                    $pull: {
                        messages: message
                    }
                }
            )



            // console.log(result)

            callback({code:"SUCCESS", data:{}});
        }
    });
})