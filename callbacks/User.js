const jwt = require('jsonwebtoken')
const mysqlConnection = require('../db')
const authConfig = require('../secret/auth.json')

const redis = require('redis');
const redisClient = redis.createClient();

const createAuthUser = async (id) => {
    await redisClient.set(`${id}_auth`, id, 'EX', 10, (error) => {
        if (error)
            return console.log("Erro ao criar autenticação")

        return console.log("Autenticação criada com sucesso para", id)

    });
}

const getAuthUser = async (id, res) => {
    await redisClient.get(`${id}_auth`, (error, result) => {
        if (error)
            res.status(500).json({ error: "Token Invalid" })

        if (result == id)
            res.json({ message: "Token OK" })
        else
            res.status(500).json({ error: "Token Invalid" })

    });
}


module.exports = async (data, view) => {

    switch (view.type) {
        case "token_get":
            if (!data.id)
                return view.res.status(402).json({ error: "Dados incorretos!" });
            getAuthUser(data.id, view.res);
            break;
        case "register":
            let id = jwt.sign(data.username, authConfig.secret_key);
            let password = jwt.sign(data.password, authConfig.secret_key);

            mysqlConnection.query("INSERT INTO users(id,username,email,password) VALUES (?,?,?,?)",
                [
                    id,
                    data.username,
                    data.email,
                    password,
                ],
                (error) => {
                    if (error)
                        return view.res.status(402).json({ error: "Erro ao tentar-se cadastrar!" })

                    return view.res.json({ message: "Cadastrado com Sucesso!" })
                }
            )
            break;

        case "login":

            mysqlConnection.query("SELECT * from users WHERE username=?", [data.username], (error, result) => {
                if (error)
                    return view.res.status(402).json({ error: "Erro ao retornar dados do usuario." });

                if (result.length == 0)
                    return view.res.status(402).json({ error: "Usuario não encontrado!" });

                if (jwt.verify(result[0].password, authConfig.secret_key) != data.password)
                    return view.res.status(402).json({ error: "Senha incorreta!" })

                createAuthUser(result[0].id, view.res)

                return view.res.json(result[0])

            });

            break;

        default:
            return view.res.status(402).json({ error: "?" })
    }
}