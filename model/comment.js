const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const User = require('../model/user');
const Word = require('../model/word');

class Comment extends Model {}
Comment.init({
    comment_id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    comment_desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    create_date: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    sequelize,
    modelName: 'comment'
});
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
Comment.belongsTo(Word, { foreignKey: 'word_id', as: 'Word' });

Word.hasMany(Comment, { foreignKey: 'word_id', as: 'Comments' } );

module.exports = Comment;