const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class User extends Model {}
User.init({
    user_id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_pass: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    sequelize,
    modelName: 'user'
});

module.exports = User;