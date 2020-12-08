const express = require('express');
const router = express.Router();
const History = require('./history.model');

// Verifica e retorna as melhores possibilidades.
router.get('/check', function(req, res) {
    console.log('teste');
});

// Verifica e retorna as melhores possibilidades.
router.post('/register-history', function(req, res, next) {
    let history = new History({
        winner: req.body.winner,
        steps: req.body.steps
    });

    history.save(function (err) {
        if (err) {
            return next(err);
        }

        res.send(true);
    });
});

module.exports = router;