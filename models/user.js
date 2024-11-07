const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');


const User =  sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
 
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
        allowNull: false,
        unique: true,
    }, 
    password:  {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
        allowNull: false,
    }, 
    role: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING,  
        defaultValue: 'USER',
        allowNull: false,
    },
},
//  {
//     hooks: {
//         beforeCreate: async (user) => {
//             const hashedPassword = await bcrypt.hash(user.password, 10);
//             user.password = hashedPassword;
//         }
//     }
// }
);

module.exports = User ;