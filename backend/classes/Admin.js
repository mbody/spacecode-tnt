const path = require('path')

const { PlayerManager } = require("./PlayerManager")

function checkAuth(req){
    if (!req.cookies) return false
    if(!req.cookies.auth_token) return false
    if(req.cookies.auth_token !== (process.env.AUTH_TOKEN || 'password')) return false
    return true
}

export function adminController(req, res) {
    if(!checkAuth(req)){
        res.status(401).sendFile(path.normalize(__dirname + '/../../admin/unauthorized.html'))
        return
    }

    console.log("Someone is connecting to the admin panel !")
    res.status(200).sendFile(path.normalize(__dirname + '/../../admin/index.html'))
}

export function adminBackupController(req, res) {
    console.log("Someone is requesting a backup !")
    if(!checkAuth(req)){
        res.sendStatus(401)
        return
    }

    PlayerManager.swapBackup()

    console.log("Someone is creating a backup !")
    res.sendStatus(200)
}

export function adminClearController(req, res) {
    if(!checkAuth(req)){
        res.sendStatus(401)
        return
    }

    console.log("DOESN'T WORK YET")
    res.sendStatus(500)
    return
    
    PlayerManager.removeAllPlayers()
    PlayerManager.saveBackupSync()

    console.log("Someone is clearing the database !")
    res.sendStatus(200)
}