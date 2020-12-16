const express = require('express');
const router = express.Router();
const History = require('./history.model');

// Verifica e retorna as melhores possibilidades.
router.get('/check', function(req, res) {
    const query = req.query.history;
    const step = (query.match(/;/g) || []).length;
    History.aggregate([
        {
            $match: {
            "steps": { "$regex": "^" + query }
            }
        },
        {
            $addFields: {
            nextStep: {
                $arrayElemAt: [ { $split: ["$steps", ";"] }, step+1 ]
            }
            }
        },
        {
            $group: {
            _id: "$nextStep",
            winRate: {
                $sum: {
                $switch: {
                    branches: [
                    { case: { $eq: ["$winner", "O"] }, then: 1 },
                    { case: { $eq: ["$winner", "X"] }, then: -5 },
                    { case: { $eq: ["$winner", "D"] }, then: 0 }
                    ]
                }
                }
            }
            }
        }
    ]).exec().then((result) => {
        let moves = {};
        for(let i in result) {
            let r = result[i];
            moves[r._id.substring(1)] = r.winRate;
        }
        console.log(moves);
        res.end(JSON.stringify(moves));
    }).catch((e) => {
        res.end('[]');
    });

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