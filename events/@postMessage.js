const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@postMessage", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})