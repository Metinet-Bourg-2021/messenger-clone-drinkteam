const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@replyMessage", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})