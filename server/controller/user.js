
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

async function createuser (req, res) {
    try {
      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating user'});
    }
  };
  


  async function loginuser (req, res) {
    try {
      
      const { username, password } = req.body;
const email = username
     
      const user = await User.findOne({ username,password });
    
      console.log(user)
      if (user) {
      
        const usertoken = jwt.sign({ username: user.username,password:user.password,  }, 'SECRET', { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Login successful' , usertoken:usertoken});
      } else {
      
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) { 
      console.error(error);
      res.status(500).json({ error: 'Internal server error' }); 
    }
  };




module.exports = {loginuser, createuser}