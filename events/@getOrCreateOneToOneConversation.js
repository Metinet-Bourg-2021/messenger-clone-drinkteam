const { io } = require("../modules/SocketIO")
// const getOrCreateOneToOneConversation = require("./events/@getOrCreateOneToOneConversation")
const Conversation = require("../class/Conversation")
const User = require("../class/User");
const Association  = require("../modules/socketAssociation");
const { ConversationSchema } = require("../models/ConversationModel");
const JWT = require("jsonwebtoken")

io.on("connection", (socket) => {
    socket.on("@getOrCreateOneToOneConversation", async ({ token, username }, callback) => {
        await Association.associate(username, null, socket)

        console.log("@getOrCreateOneToOneConversation")

        if(token){

            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            ConversationSchema.findOne({ participants: [username, me.username] })
                .then(async (conversation) => {
                    if(!conversation){
                        // console.log("> CONVERSATION -> NULL")

                        let conversationtoCreate = new Conversation()
                        conversationtoCreate.type = "one_to_one"
                        conversationtoCreate.participants = [username, me.username]
                        conversationtoCreate.title = null
                        conversationtoCreate.theme = "BLUE"
                        conversationtoCreate.messages = []
                        conversationtoCreate.updated_at = new Date()

                        const result = await ConversationSchema.create(conversationtoCreate.toJSON())
                        conversationtoCreate.id = result._id.toString()

                        // console.log(conversationtoCreate.toJSON())

                        // io.emit("@conversationCreated", {
                        //     "conversation" : conversationtoCreate.toJSON()
                        // })

                        let userSocket = Association.getAssociation(username)
                        if (userSocket !== false) userSocket.emit("@conversationCreated", {
                            conversation : conversationtoCreate.toJSON()
                        })

                        callback({
                            code:"SUCCESS",
                            data: {
                                "conversation" : conversationtoCreate.toJSON()
                            }

                        });
                    } else {
                        // console.log("> CONVERSATION -> EXIST")

                        let conv = new Conversation()
                        await conv.createConversation(conversation)

                        // console.log(conv.toJSON())

                        callback({code:"SUCCESS", data:{
                            "conversation": conv.toJSON()
                        }});
                    }
                })
        } else {
            // console.log("NO TOKEN")
            callback({code:"SUCCESS", data:{}});
        }
    })
})