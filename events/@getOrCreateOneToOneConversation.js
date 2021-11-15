const { io } = require("../modules/SocketIO")
const { conversationSchema } = require("../models/ConversationModel")
const { Conversation } = require("../class/Conversation")
const User = require("../class/User");
const { UserSchema } = require("../models/UserModel");
const { Conversationschema } = require("../models/ConversationModel");

io.on("connection", (socket,res) => {
    socket.on("@getOrCreateOneToOneConversation", async ({ token, username }, callback) => {
        if(token){
            Conversationschema.find({participants: username})
                .then(async (conversation) => {
                    console.log(conversation);

                    conversationSchema.findOne({id: id})
                        .then(async (conversation) => {
                            if (conversation === null) {

                                let conversationtoCreate = new Conversation();
                                conversationtoCreate.participants.push(username);
                            }
                        })
                })
        }
        callback({code:"SUCCESS", data:{}});
    })
})
