const { UserSchema } = require("../models/UserModel")
const JWT = require("jsonwebtoken")
const Bcrypt = require("bcrypt")

const ReturnCodes = require("../config/returnCodes.json")

const Pictures = require("../pictures")

module.exports = class User {
    id = null
    username = null
    password = null
    token = null
    picture_url = null
    awake = false

    constructor(id = null,
                username = null,
                password = null,
                token = null,
                picture_url = null,
                awake = false)
    {
        this.id = id
        this.username = username
        this.password = password
        this.token = token
        this.picture_url = picture_url
        this.awake = awake
    }

    async register(username = null,
             password = null,
             token = null,
             picture_url = Pictures.getRandomURL(),
             awake = false)
    {
        Bcrypt.hash(password, 10, async (error, result) => {
            this.username = username
            this.password = result
            this.token = token
            this.picture_url = picture_url
            this.awake = awake

            UserSchema.create(this.toJSON()).then(async () => {
                await this.authenticate(username, password)
                console.log(this)
            })
        })
    }

    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            UserSchema.findOne({ username : username}).then((user) => {
                if (!user) {
                    const code = ReturnCodes.find(r => r.code === "NOT_FOUND_USER")
                    resolve(code !== undefined ? code.code : "NOT_FOUND_USER")
                }

                let TOKEN = JWT.sign(
                    {userId : user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )

                this.id = user._id
                this.username = user.username
                this.token = TOKEN
                this.picture_url = user.picture_url

                // console.log("USER.AUTHENTICATE")
                // console.log(this)

                resolve(this)
            })
        })
    }

    toJSON(associative = false) {
        if (associative) {
            return {
                _id: this.id,
                username: this.username,
                password: this.password,
                token: this.token,
                picture_url: this.picture_url,
                awake: this.awake
            }
        } else {
            return {
                username: this.username,
                password: this.password,
                token: this.token,
                picture_url: this.picture_url,
                awake: this.awake
            }
        }
    }
}