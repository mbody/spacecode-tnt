const path = require('path')

export function adminController(req, res) {
    if (!req.cookies) {
        res.status(401).sendFile(path.normalize(__dirname + '/../../admin/unauthorized.html'))
        return
    }

    const token = req.cookies.auth_token
    if (!token) {
        res.status(401).sendFile(path.normalize(__dirname + '/../../admin/unauthorized.html'))
        return
    }

    if (token !== (process.env.AUTH_TOKEN || 'password')) {
        res.status(401).sendFile(path.normalize(__dirname + '/../../admin/unauthorized.html'))
        return
    }

    console.log("Someone is connecting to the admin panel !")
    res.status(200).sendFile(path.normalize(__dirname + '/../../admin/index.html'))
}