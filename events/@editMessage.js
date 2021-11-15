const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@editMessage", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})