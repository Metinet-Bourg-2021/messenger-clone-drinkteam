const User = require("../class/User");
const JWT = require("jsonwebtoken");

let socketsAssociation = []

async function associate(username = null, token = null, socket) {
    if (!socket) return;

    if (username === null) {
        let me = new User()
        let decoded = JWT.decode(token, 'RANDOM_TOKEN_SECRET')
        let result = await me.find(decoded.userId)

        if(!result) return;

        if (socketsAssociation.find(s => s.username === me.username) === undefined) {
            socketsAssociation.push({
                username : username,
                socket : socket
            });
        } else {
            socketsAssociation.find(s => s.username === me.username).socket = socket
        }
    } else {
        if (socketsAssociation.find(s => s.username === username) === undefined) {
            socketsAssociation.push({
                username : username,
                socket : socket
            });
        } else {
            socketsAssociation.find(s => s.username === username).socket = socket
        }
    }
}

function getAssociation(username = null) {
    if (username === null) return false;
    console.log(`Get association for : ${username}`)
    const association = socketsAssociation.find(s => s.username === username);

    if (association === undefined) return false;
    else return association.socket
}

module.exports = {
    associate,
    getAssociation
}