const { io } = require("../modules/SocketIO")
const { conversationSchema } = require("../models/ConversationModel")
const { Conversation } = require("../class/Conversation")
const User = require("../class/User");
const { UserSchema } = require("../models/UserModel");
const { Conversationschema } = require("../models/ConversationModel");


io.on("connection", (socket) => {
    socket.on("@createManyToManyConversation", async({ token, username }, callback) => {

        callback({code:"SUCCESS", data:{}});
    });
})