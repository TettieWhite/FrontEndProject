let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const Sequelize = require('sequelize');
//const mysql = require('mysql2');

let app = express();

require('dotenv').config();

const sequelize = new Sequelize('cdd', 'root', 'TomFelton1812#sql', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

global.sequelize = sequelize;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let indexRouter = require('./routes/index');
app.use('/', indexRouter);

let usersRouter = require('./routes/user/users');
app.use('/user', usersRouter);

let wordsRouter = require('./routes/words/words');
app.use('/word', wordsRouter);

let votesRouter = require('./routes/vote/votes');
app.use('/vote', votesRouter);


sequelize.sync().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = app;
