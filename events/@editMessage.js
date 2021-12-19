const { io } = require("../modules/SocketIO")

const User = require("../class/User");
const JWT = require("jsonwebtoken");

const { MessageSchema } = require("../models/MessageModel")
const Message = require("../class/Message")
const {ConversationSchema} = require("../models/ConversationModel");

const Mongoose = require("mongoose")

io.on("connection", (socket) => {
    socket.on("@editMessage", async ({ token, conversation_id, message_id, content }, callback) => {
        console.log("@editMessage")

        if (token) {
            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            console.log(`Find :\n> Conversation : ${conversation_id}\n> Message : ${message_id}`)

            // console.log(await ConversationSchema.findOne(
            //     {
            //         _id: conversation_id,
            //         messages: {
            //             $elemMatch: {
            //                 id : Mongoose.Types.ObjectId(message_id)
            //             }
            //         }
            //     }
            // ))

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
                    $set: {
                        "messages.$.content" : content,
                        "messages.$.edited" : true
                    }
                }
            )

            console.log(result)

            callback({code:"SUCCESS", data:{}});
        }
    });
})