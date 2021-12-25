const { io } = require("../modules/SocketIO")
const User = require("../class/User");
const JWT = require("jsonwebtoken");
const {ConversationSchema} = require("../models/ConversationModel");

io.on("connection", (socket) => {
    socket.on("@seeConversation", async ({ token, conversation_id, message_id }, callback) => {

        let me = new User()
        let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
        await me.find(decoded.userId)

        const conversation = await ConversationSchema.findOne({ _id: conversation_id });

        if(!conversation){
            callback({code: "NOT_FOUND_CONVERSATION", data: {}})
        } else {

            let seen = conversation.seen;
            seen[me.username] = {
                message_id,
                time: new Date()
            };
            
            if(!seen){
                callback({code: "NOT_FOUND_MESSAGE", data: {}})
            } else {

                io.emit("@conversationSeen", {
                    conversation
                })

                await ConversationSchema.updateOne({_id: conversation_id}, {$set: {seen}})
                callback({
                    code: "SUCCESS", data: {
                        conversation
                    }
                });
            }
        }

    });
})