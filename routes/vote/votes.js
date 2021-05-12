const express = require('express');
const votesRouter = express.Router();



let User = require('../../model/user');
let Word = require('../../model/word');
let Vote = require('../../model/vote');


// get votes by user id
votesRouter.post('/getVotesByUser',(req, res) => {
    Vote.findAll({where: {user_id: req.body.user_id}}).then(votes => {
        if (votes) {
            res.status(201).json({votes: votes});
        } else {
            res.status(409).json( { message: "No words found for such user" } );
        }
    });
});

module.exports = votesRouter;
