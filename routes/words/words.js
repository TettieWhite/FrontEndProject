const express = require('express');
const wordsRouter = express.Router();

const wordDeleteLimit = -3;

let User = require('../../model/user');
let Word = require('../../model/word');
let Vote = require('../../model/vote');
let Comment = require('../../model/comment');

// add new word info
wordsRouter.post('/add', (req, res) => {
    //console.log(req);
    Word.findOne({ where: { user_id: req.body.user_id, word: req.body.word }}).then(obj => {
        if (obj) {
            res.status(409).json( { message: "Word for such user already exists" } );
        } else {
            Word.create({
                word: req.body.word,
                word_desc: req.body.desc,
                create_date: req.body.date,
                user_id: req.body.user_id,
                vote_up: 0,
                vote_down: 0,
                deleted: false
            }).then(word => {
                res.status(201).json({newWord: word});
            });
        }
    });
});

// update word info
wordsRouter.post('/update', (req, res) => {
    //console.log(req);
    Word.findOne({ where: { word_id: req.body.word_id }}).then(obj => {
        if (obj) {
            obj.update({
                word_desc: req.body.desc,
            }).then(word => {
                res.status(201).json({word: word});
            });
        } else {
            res.status(409).json( { message: "Word for such id doesn't exists" } );
        }
    });
});

// get word full info by id
wordsRouter.post('/getByID', (req, res) => {
    //console.log(req);
    Word.findOne({ where: { word_id: req.body.word_id, deleted: false }}).then(word => {
        if (word) {
            res.status(201).json({word: word});
        } else {
            res.status(409).json( { message: "Word for such id doesn't exists" } );
        }
    });
});

// get word full info by name and user
wordsRouter.post('/getByNameAndUser', (req, res) => {
    //console.log(req);
    Word.findOne({ where: { word: req.body.word, user_id: req.body.user_id, deleted: false }}).then(word => {
        if (word) {
            res.status(201).json({word: word});
        } else {
            res.status(409).json( { message: "Word not found for name and user" } );
        }
    });
});

// get list of words by date
wordsRouter.post('/listByDate', (req, res) => {
    //console.log(req);
    Word.findAll({ where: { create_date: req.body.date, deleted: false }}).then(words => {
        if (words) {
            res.status(201).json({words: words});
        } else {
            res.status(409).json( { message: "No words found for such date" } );
        }
    });
});

// get list of words by user
wordsRouter.post('/listByUser', (req, res) => {
    //console.log(req);
    Word.findAll({ where: { user_id: req.body.user_id, deleted: false }}).then(words => {
        if (words) {
            res.status(201).json({words: words});
        } else {
            res.status(409).json( { message: "No words found for such user" } );
        }
    });
});

// get list of words
wordsRouter.post('/list', (req, res) => {
    //console.log(req);
    Word.findAll({ where: { deleted: false }}).then(words => {
        if (words) {
            res.status(201).json({words: words});
        } else {
            res.status(409).json( { message: "No words found for such user" } );
        }
    });
});


// user vote for word by id
wordsRouter.post('/vote', (req, res) => {
    //console.log(req);
    Word.findOne({ where: { word_id: req.body.word_id, deleted: false }}).then(word => {
        if (!word) {
            res.status(409).json({ message: "Word not found" });
        } else {
            Vote.findOne({ where: { user_id: req.body.user_id, word_id: req.body.word_id}}).then(vote => {
                if (vote) {
                    if (((vote.vote_value == 1) && (req.body.isUp)) ||
                        ((vote.vote_value == -1) && (!req.body.isUp))) {
                        res.status(409).json({ message: "Vote limit for this word"});
                    } else {
                        vote.update({ vote_value: (req.body.isUp ? (vote.vote_value + 2) : (vote.vote_value - 2)) }).
                        then(vote => {
                            if (req.body.isUp) {
                                word.update({vote_up: (word.vote_up + 1), vote_down: (word.vote_down - 1)}).
                                then(word => {
                                    res.status(201).json({ word: word});
                                })
                            } else {
                                word.update({vote_down: (word.vote_down + 1), vote_up: (word.vote_up - 1)}).
                                then(word => {
                                    res.status(201).json({ word: word});
                                })
                            }
                        })
                    }
                } else {
                    Vote.create({ word_id: req.body.word_id, user_id: req.body.user_id,
                    vote_value: (req.body.isUp ? 1 : -1) }).then(vote => {
                        if (req.body.isUp) {
                            word.update({vote_up: (word.vote_up + 1)}).
                            then(word => {
                                res.status(201).json({ word: word});
                            })
                        } else {
                            word.update({vote_down: (word.vote_down + 1)}).
                            then(word => {
                                res.status(201).json({ word: word});
                            })
                        }
                    })
                }
            })
        }
    });
});

// make comment for word
wordsRouter.post('/comment', (req, res) => {
    Word.findOne({where: {word_id: req.body.word_id, deleted: false}}).then(word => {
        if (!word) {
            res.status(409).json({message: "Word not found"});
        } else {
            Comment.create({
                comment_desc: req.body.text, word_id: req.body.word_id,
                user_id: req.body.user_id, create_date: new Date().toDateString()
            }).then(comment => {
                res.status(201).json({ message: 'Comment added'});
            })
        }
    })
});

// delete word
wordsRouter.post('/delete', (req, res) => {
    res.status(409).json( { message: "todo delete" } );
});


module.exports = wordsRouter;