const { io } = require("../modules/SocketIO")
const { UserSchema } = require("../models/UserModel");
const User = require("../class/User");
const bcrypt = require("bcrypt");
const Association  = require("../modules/socketAssociation");


io.on("connection", (socket) => {
    socket.on("@getUsers",async ({ token }, callback) => {
        await Association.associate(null, token, socket)

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