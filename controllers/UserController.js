const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const UserCallback = require('../callbacks/User')

router.use(authMiddleware);

router.get('/token',async (req,res) => {
    UserCallback(req.body, {type: "token_get", res});
})

router.post('/login', async (req,res) => {
    if(Object.keys(req.body).length == 2 && req.body.username && req.body.password) {
        UserCallback(req.body, { type: "login", res});
    }else {
        res.status(402).json({
            error: "Dados incorretos!"
        })
    }
})


router.post('/register', async (req, res) => {

    if (Object.keys(req.body).length == 3) {

        let verify = false;
        Object.values(req.body).forEach((value) => {
            if (!value)
                verify = true;
        })

        if (!verify)
            UserCallback(req.body, { type: "register", res });
        else
            res.status(402).json({
                error: "Dados incorretos!"
            })

    } else {
        res.status(402).json({
            error: "Dados incorretos!"
        })
    }


});


module.exports = server => server.use('/auth', router);  