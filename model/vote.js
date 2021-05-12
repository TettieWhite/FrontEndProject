const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const User = require('../model/user');
const Word = require('../model/word');

class Vote extends Model {}
Vote.init({
    vote_id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    vote_value: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    underscored: true,
    sequelize,
    modelName: 'vote'
});
Vote.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
Vote.belongsTo(Word, { foreignKey: 'word_id', as: 'Word' });

Word.hasMany(Vote, { foreignKey: 'word_id', as: 'Votes' } );

module.exports = Vote;