const { io } = require("../modules/SocketIO")
const {ConversationSchema} = require("../models/ConversationModel");
const Mongoose = require("mongoose");

io.on("connection", (socket) => {
    socket.on("@deleteMessage", async ({ token, conversation_id, message_id }, callback) => {
        console.log("@deleteMessage")

        console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

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

            console.log(message)

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
                    io.emit("@messageDeleted", {
                        "conversation_id" : conversation_id,
                        "message" : message
                    })
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



            console.log(result)

            callback({code:"SUCCESS", data:{}});
        }
    });
})