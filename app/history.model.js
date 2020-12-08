const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let HistorySchema = new Schema({
    winner: { type: String, required: true, max: 1 },
    steps: { type: String, required: true },
}, { collection: 'history' });

module.exports = mongoose.model('History', HistorySchema);