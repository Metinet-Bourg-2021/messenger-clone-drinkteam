const { io } = require("../modules/SocketIO")
const { conversationSchema, ConversationSchema} = require("../models/ConversationModel")
const Conversation = require("../class/Conversation")
const User = require("../class/User");
const { UserSchema } = require("../models/UserModel");
const { Conversationschema } = require("../models/ConversationModel");
const JWT = require("jsonwebtoken");


io.on("connection", (socket) => {
    socket.on("@createManyToManyConversation", async({ token, usernames }, callback) => {

        console.log("@createManyToManyConversation")

        if(token){

            let me = new User()
            let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
            await me.find(decoded.userId)

            usernames.push(me.username)

            ConversationSchema.findOne({ participants: usernames })
                .then(async (conversation) => {
                    if(!conversation){
                        console.log("> CONVERSATION -> NULL")

                        let conversationtoCreate = new Conversation()
                        conversationtoCreate.type = "many_to_many"
                        conversationtoCreate.participants = usernames
                        conversationtoCreate.title = null
                        conversationtoCreate.theme = "BLUE"
                        conversationtoCreate.messages = []
                        conversationtoCreate.updated_at = new Date()

                        const result = await ConversationSchema.create(conversationtoCreate.toJSON())
                        conversationtoCreate.id = result._id.toString()

                        console.log(conversationtoCreate.toJSON())

                        // socket.send("@getOrCreateOneToOneConversation", callback({
                        //     code:"SUCCESS",
                        //     data: {
                        //         "conversation" : conversationtoCreate.toJSON()
                        //     }
                        //
                        // }))

                        callback({
                            code:"SUCCESS",
                            data: {
                                "conversation" : conversationtoCreate.toJSON()
                            }

                        });
                    } else {
                        console.log("> CONVERSATION -> EXIST")

                        let conv = new Conversation()
                        await conv.createConversation(conversation)

                        console.log(conv.toJSON())

                        // socket.send("@getOrCreateOneToOneConversation", callback({code:"SUCCESS", data:{
                        //         "conversation": conv.toJSON()
                        //     }}))

                        callback({code:"SUCCESS", data:{
                                "conversation": conv.toJSON()
                            }});
                    }
                })
        } else {
            console.log("NO TOKEN")
            callback({code:"SUCCESS", data:{}});
        }
    });
})