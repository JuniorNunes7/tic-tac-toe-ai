const mongoose = require('mongoose');
const host = '127.0.0.1';
const port = '27017';
const database = 'tic-tac-toe';

let url = `mongodb://${host}:${port}/${database}`;
let mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Ligação ao MongoDB'));