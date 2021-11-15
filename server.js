require('dotenv/config');

// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");

/*
    MODULES INTERNES
 */

const { Mongoose } = require("./modules/Mongoose")

/*
    MODULES MONGOOSE
 */
const UserModel = require("./models/UserModel")

/*
    SERVEUR SOCKET.IO
 */

const { io, http, express, app } = require("./modules/SocketIO")
// const io = new Server(server, { cors: { origin: "*" } });

/*
    ROUTES EXPRESS
 */

app.get("/", (req, res) => {
    res.send("A utiliser pour du debug si vous avez besoin...");
});

http.listen(3000, () => {
    console.log("Server is listening");
});

process.setMaxListeners(0)

/*
    SOCKET IO MODULES
 */

const authenticate = require("./events/@authenticate")
const createManyToManyConversation = require("./events/@createManyToManyConversation")
const deleteMessage = require("./events/@deleteMessage")
const editMessage = require("./events/@editMessage")
const getConversations = require("./events/@getConversations")
const getOrCreateOneToOneConversation = require("./events/@getOrCreateOneToOneConversation")
const getUsers = require("./events/@getUsers")
const postMessage = require("./events/@postMessage")
const reactMessage = require("./events/@reactMessage")
const replyMessage = require("./events/@replyMessage")
const seeConversation = require("./events/@seeConversation")
const disconnect = require("./events/disconnect")

/*
    SOCKET IO
 */

io.on("connection", socket => {
    //Penser a conserver le socket pour pouvoir s'en servir plus tard
    //Remplacer les callbacks par des fonctions dans d'autres fichiers.

    // console.log(socket)

    // socket.on("@authenticate", ({ username, password }, callback) => {
    //     console.log(`New authentication from :\nUsername : ${username}\nPassword : ${password}`)
    //     callback({code:"SUCCESS", data:{}});
    // });
    
    // socket.on("@getUsers", ({token}, callback) => { callback({code:"SUCCESS", data:{}}); });
    //
    // socket.on("@getOrCreateOneToOneConversation", ({token, username}, callback) => { callback({code:"SUCCESS", data:{}});  });
    // socket.on("@createManyToManyConversation", ({token, usernames}, callback) => {callback({code:"SUCCESS", data:{}});});
    // socket.on("@getConversations", ({token}, callback) => {callback({code:"SUCCESS", data:{}});});
    
    // socket.on("@postMessage", ({token, conversation_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    // socket.on("@seeConversation", ({token, conversation_id, message_id}, callback) => {callback({code:"SUCCESS", data:{}}); });
    // socket.on("@replyMessage", ({token, conversation_id, message_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    // socket.on("@editMessage", ({token, conversation_id, message_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    // socket.on("@reactMessage", ({token, conversation_id, message_id, reaction, callback}) => {callback({code:"SUCCESS", data:{}});});
    // socket.on("@deleteMessage", ({token, conversation_id, message_id, content, callback}) => {callback({code:"SUCCESS", data:{}});});

    // socket.on("disconnect", (reason) =>{ });
});

// Addresse du serveur démo: wss://teach-vue-chat-server.glitch.me