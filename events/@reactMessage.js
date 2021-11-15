const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@reactMessage", ({ username, password }, callback) => {
        callback({code:"SUCCESS", data:{}});
    });
})