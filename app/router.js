const express = require('express');
const router = express.Router();
const History = require('./history.model');

// Verifica e retorna as melhores possibilidades.
router.get('/check', function(req, res) {
    const query = req.query.history;
    const step = (query.match(/;/g) || []).length;
    const startPlayer = query.charAt(0);
    const winPoints = (startPlayer === 'O') ? 2 : 1;
    const drawPoints = (startPlayer !== 'O') ? 2 : 0;

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
                    { case: { $eq: ["$winner", "O"] }, then: winPoints },
                    { case: { $eq: ["$winner", "X"] }, then: -1 },
                    { case: { $eq: ["$winner", "D"] }, then: drawPoints }
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
        res.end(JSON.stringify(moves));
    }).catch((e) => {
        res.end('[]');
    });

});

// Verifica e retorna as melhores possibilidades.
router.post('/register-history', function(req, res, next) {
    const data = {
        winner: req.body.winner,
        steps: req.body.steps
    };
    History.countDocuments(data).then((count) => {
        if (count === 0) {
            let history = new History(data);
        
            history.save(function (err) {
                if (err) {
                    return next(err);
                }
        
                res.send(true);
            });
        }
    });
});

module.exports = router;