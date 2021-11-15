const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@deleteMessage", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})