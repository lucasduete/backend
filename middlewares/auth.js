const routes_block_middleware = [
    "/register",
    "/login",
    "/token"
]

module.exports = (req, res, next) => {

    if (routes_block_middleware.includes(req.path))
        return next()

    const _auth = req.headers.auth;
    if (!_auth)
        return res.status(402).json({
            error: "Token não encontrado!"
        })
}