const { io } = require("../modules/SocketIO")
const { ConversationSchema} = require("../models/ConversationModel")
const Conversation = require("../class/Conversation")
const User = require("../class/User");
const Association = require("../modules/socketAssociation");
const JWT = require("jsonwebtoken");

io.on("connection", (socket) => {
    socket.on("@createManyToManyConversation", async({ token, usernames }, callback) => {

        await Association.associate(null, token, socket)

        console.log("@createManyToManyConversation")

        if(token){

            if(!usernames){
                callback({code: "NOT_VALID_USERNAMES ", data: {}});
            } else {
                let me = new User()
                let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
                await me.find(decoded.userId)

                usernames.push(me.username)

                ConversationSchema.findOne({participants: usernames})
                    .then(async (conversation) => {
                        if (!conversation) {
                            // console.log("> CONVERSATION -> NULL")

                            let conversationtoCreate = new Conversation()
                            conversationtoCreate.type = "many_to_many"
                            conversationtoCreate.participants = usernames
                            conversationtoCreate.title = null
                            conversationtoCreate.theme = "BLUE"
                            conversationtoCreate.messages = []
                            conversationtoCreate.updated_at = new Date()

                            const result = await ConversationSchema.create(conversationtoCreate.toJSON())
                            conversationtoCreate.id = result._id.toString()

                            // console.log(conversationtoCreate.toJSON())

                            // io.emit("@conversationCreated", {
                            //     "conversation": conversationtoCreate.toJSON()
                            // })

                            usernames.forEach((username) => {
                                let userSocket = Association.getAssociation(username)
                                if (userSocket !== false) userSocket.emit("@conversationCreated", {
                                    conversation : conversationtoCreate.toJSON()
                                })
                            })

                            callback({
                                code: "SUCCESS",
                                data: {
                                    "conversation": conversationtoCreate.toJSON()
                                }

                            });
                        } else {
                            // console.log("> CONVERSATION -> EXIST")

                            let conv = new Conversation()
                            await conv.createConversation(conversation)

                            console.log(conv.toJSON())

                            callback({
                                code: "SUCCESS", data: {
                                    "conversation": conv.toJSON()
                                }
                            });
                        }
                    })
            }
        } else {
            console.log("NO TOKEN")
            callback({code:"SUCCESS", data:{}});
        }
    });
})