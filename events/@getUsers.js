const { io } = require("../modules/SocketIO")
const { UserSchema } = require("../models/UserModel");
const User = require("../class/User");
const bcrypt = require("bcrypt");

io.on("connection", (socket) => {
    socket.on("@getUsers", ({ token }, callback) => {
        UserSchema.find({})
            .then(users => {
                socket.send("@getUsers", callback({
                        code:"SUCCESS",
                        data : {
                            users : users.map((user) => {
                                return {
                                    username : user.username,
                                    picture_url : user.picture_url,
                                    awake : user.awake
                                }
                            })
                        }
                    }
                ))
            })
            .catch();
    });
})