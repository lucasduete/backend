const express = require('express');
const server = express();
const cors = require('cors');

server.use(cors())
server.use(express.json());


//Controllers
require('./controllers/UserController')(server);


server.listen(8000,() => {
    console.log("Backend Inicializado com Sucesso!");
})