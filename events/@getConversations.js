const { io } = require("../modules/SocketIO")
const Conversation = require("../class/Conversation")
const User = require("../class/User");
const { UserSchema } = require("../models/UserModel");
const { ConversationSchema } = require("../models/ConversationModel");
const JWT = require("jsonwebtoken")

io.on("connection", (socket) => {
    socket.on("@getConversations", async ({ token }, callback) => {

        let me = new User()
        let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
        await me.find(decoded.userId)

        ConversationSchema.find({ participants: { $in: [me.username] } })
            .then(async (mesConversations) => {
                let convs = []
                mesConversations.forEach((conversation) => {
                    let newConv = new Conversation()
                    newConv.createConversation(conversation)
                    newConv.id = conversation._id.toString()

                    convs.push(newConv.toJSON())
                })

                callback({code:"SUCCESS", data:{conversations:convs}})
            })
    });
})