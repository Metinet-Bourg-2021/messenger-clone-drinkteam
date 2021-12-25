const { io } = require("../modules/SocketIO");
const bcrypt = require("bcrypt");
const { UserSchema } = require("../models/UserModel");
const User = require("../class/User");
const JWT = require("jsonwebtoken");

const Association = require("../modules/socketAssociation")

io.on("connection", (socket) => {
    socket.on("@authenticate", async ({username, password}, callback) => {
        await Association.associate(username, null, socket)

        UserSchema.findOne({username: username})
            .then(async (user) => {
                if (user === null) {
                    let userToCreate = new User()
                    await userToCreate.register(username, password);
                    console.log(`New authentication from :\n    Username : ${username}\n    Password : ${password}`)

                    io.emit("@userCreated", {
                        "user" : {
                            "username" : userToCreate.username,
                            "password" : null,
                            "picture_url" : userToCreate.picture_url,
                            "last_activity_at" : new Date()
                        }
                    })

                    callback({code: "SUCCESS", data: userToCreate.toJSON()});
                } else {
                    bcrypt.compare(password, user.password)
                        .then(async (valid) => {
                            if (!valid) {
                                // console.log("mdp non valide");
                                callback({code: "NOT_AUTHENTICATED", data: {}});
                            }
                            console.log(`New authentication from :\n    Username : ${username}\n    Password : ${password}`)
                            let usr = new User()
                            if(await usr.authenticate(username, password)){
                                callback({code: "SUCCESS", data: usr.toJSON()});
                            } else {
                                callback({code: "NOT_FOUND_USER ", data: {}});
                            }
                            
                        }).catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    });
})