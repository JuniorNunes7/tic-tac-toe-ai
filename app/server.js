const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./router');

const app = express();

require('./db'); // DB Connection

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

// Server
let porta = 8080;
app.listen(porta, () => {
    console.log('Servidor em execução na porta ' + porta);
});