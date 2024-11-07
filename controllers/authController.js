const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');


exports.createAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // null checking 
        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password should be provided"
            })
        }
        
        // check user exists or not
        let user = await User.findOne({
            where: { email }
        })

        if (user) {
            // user already exists
            return res.status(400).send({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'user registered successfully '});
    } catch (error) {
        res.status(400).json({error: error.message , mess: 'kkk'});
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: {email}});
        if (!user) {
            return res.status(400).json({ message: 'User not found'});
        }

        const validPassword = await bcrypt.compare(password, user.password) ;
        if (!validPassword) return res.status(400).json({ message: 'Invalid password'});
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        
        console.log(user)
        const { password: _, ..._user } = user.dataValues;
        
        res.json({ 
            message:'Login successful! ',  
            user: _user,
            token 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.adminRole = async (req, res) => {
    console.log(req.user.role)
    const selectedRole = req.user.role;
    try {
        const findAdmin = await User.findAll();

         res.status(200).json({ findAdmin, error: 'welcome admin !!!!!!!!!!' });
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
  

};

exports.userRole = async (req, res) => {
    console.log(req.user.role);
    
    const selectedRole = req.user.role;
    try {
        const findAdmin = await User.findAll({ where: 
            { 
                role: { [Op.in] : ['user', 'guest'] }
            } 
        });

         res.status(200).json({ findAdmin, error: 'welcome admin !!!!!!!!!!' });
    } catch (error) {
        res.status(400).json( {error: error.message} );
    }
  

};