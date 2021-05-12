const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const User = require('../model/user');

class Word extends Model {}
Word.init({
    word_id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    word: {
        type: Sequelize.STRING,
        allowNull: false
    },
    word_desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    create_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vote_up: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    vote_down: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    underscored: true,
    sequelize,
    modelName: 'word'
});
Word.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

module.exports = Word;