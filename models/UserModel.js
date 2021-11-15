const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
            type: String,
            required: true,
            unique: true
    },
    password: {
            type: String,
            required: true
    },
    token: {
            type: String,
            required: false
    },
    picture_url: {
        type: String,
        required: false
    },
    awake: {
        type: Boolean,
        required: false
    }
});

module.exports = {
    UserSchema : mongoose.model('users', UserSchema)
};

/* Code attribution token lors de la connection (Lucas)
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

 exports.login = (req, res, next) => {
    UserSchema.findOne({ username: req.body.username })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error : "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error : "Mot de passe incorrect !"});
                    }

                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expireIn: '24h'}
                    )

                    console.log(token)

                    res.status(200).json({
                        username: user._id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };
 */