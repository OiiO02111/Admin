const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');


exports.createAdmin = async (req, res) => {
    
    try {
    const { name, email, password, role } = req.body;
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
    const newAdmin = await User.create( {
        name, email, password: hashedPassword, role
    });
    
     res.status(200).json({ message: `Generated a new ${role} successfully` ,
          m: {
             id: newAdmin.id , name: newAdmin.name, email: newAdmin.email
          }
        });
    
    } catch (error) {
        console.error(error)
        res.status(400).json({ M: 'U cannot create a new person'})
    }
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

        if ( user.email === 'danielwhite02111@gmail.com' || user.email === 'samuelgreen02111@gmail.com') {
            user.role = 'ADMIN';
            
        }
        await user.save();
        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET);
        
        console.log(user)
        const { password: _, ..._user } = user.dataValues;
        
        res.json({ 
            message:'Login successful! ',  
            // user,
            user: _user,
            token,
            role: user.role
            
        });
    } catch (error) {
        res.status(400).json({ error: "Unknown Error, your request is failed" });
    }
};

exports.adminRole = async (req, res) => {
    console.log(req.user.role)
    const selectedRole = req.user.role;
    try {
        const findAll = await User.findAll();
        console.log('Array length', findAll.length)
        let eachPerson = '';
        for (let i = 0 ; i < findAll.length ; i++) {
            console.log(i)
            // if ( findAll[i].email === 'danielwhite02111@gmail.com' || findAll[i].email === 'samuelgreen02111@gmail.com') {
            //     findAll[i].role = 'ADMIN';
            // }
            const eachPerson = findAll[i];
            const { password: _, ..._eachPerson } = eachPerson.dataValues;
            findAll[i] = _eachPerson ;
        }
       
        console.log('???------>',  findAll[0].role )

         res.status(200).json({  message: `welcome ${req.user.name}! ` , findAll  });
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
  };

exports.userRole = async (req, res) => {
    console.log(req.user);
    
    const selectedRole = req.user.role;
    try {
        const findUser = await User.findAll({ where: 
            { 
                // role: { [Op.in] : ['user', 'guest'] }
                role: 'USER'
            } 
        });
        console.log('Array length', findUser.length)
        let eachPerson = '';
        
        for (let i = 0 ; i < findUser.length ; i++) {
            console.log(i)
            const eachPerson = findUser[i];
            const { password: _, ..._eachPerson } = eachPerson.dataValues;
            findUser[i] = _eachPerson ;
        }
        console.log( req.user.name)

         res.status(200).json({ User: findUser, message: `welcome ${ req.user.name } USER !!!!!!!!!!` });
    } catch (error) {
        res.status(400).json( {error: error.message, message: "Unknown error, please wait me."} );
    }
  

};

exports.changePerson = async (req, res) => {
    console.log(" Here is changePerson function! ")
    const { email, role} = req.body ;
    const user = await User.findOne({ where: { email }});
    try {
        user.role = role;
        await user.save(); 
        res.status(200).json({ message: " You changed a person's role successfully! "});
    } catch (error) {
        res.json( ' You cannot change the person role. ');
    }
}