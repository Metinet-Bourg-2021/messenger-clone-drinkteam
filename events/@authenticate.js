const { io } = require("../modules/SocketIO");
const bcrypt = require("bcrypt");
const { UserSchema } = require("../models/UserModel");
const User = require("../class/User")

io.on("connection", (socket) => {
    socket.on("@authenticate", ({username, password}, callback) => {
        UserSchema.findOne({username: username})
            .then(async (user) => {
                if (user === null) {
                    let userToCreate = new User()
                    await userToCreate.register(username, password);
                    console.log(`New authentication from :\n    Username : ${username}\n    Password : ${password}`)

                    callback({code: "SUCCESS", data: userToCreate.toJSON()});
                } else {
                    bcrypt.compare(password, user.password)
                        .then(async (valid) => {
                            if (!valid) {
                                console.log("mdp non valide");
                            }
                            console.log(`New authentication from :\n    Username : ${username}\n    Password : ${password}`)
                            let usr = new User()
                            await usr.authenticate(username, password)
                            console.log(usr.token);
                            callback({code: "SUCCESS", data: usr.toJSON()});
                        }).catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    });
})