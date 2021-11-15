const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@seeConversation", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})