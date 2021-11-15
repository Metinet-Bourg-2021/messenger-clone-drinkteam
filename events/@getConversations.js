const { io } = require("../modules/SocketIO")

io.on("connection", (socket) => {
    socket.on("@getConversations", ({ username, password }, callback) => {
        // socket.send("@getConversations", {code:"SUCCESS", data:{conversations:[]}})
        callback({code:"SUCCESS", data:{conversations:[]}});
    });
})