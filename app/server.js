const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./router');

const app = express();

require('./db'); // DB Connection

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Routes
app.use('/', routes);

// Server
let porta = 8080;
app.listen(porta, () => {
    console.log('Servidor em execução na porta ' + porta);
});