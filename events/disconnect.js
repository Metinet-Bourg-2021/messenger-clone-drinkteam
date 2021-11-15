const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("disconnect", (reason) => {

    });
})