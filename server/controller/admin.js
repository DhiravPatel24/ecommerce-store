const Admin = require('../models/Admin.js');
const User = require('../models/User.js');
// const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

async function createAdmin (req, res){
    try {
        const { email, password } = req.body;


        const existingAdmin = await Admin.findOne({ email })

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }


        // const hashedPassword = await bcrypt.hash(password, 10);


        const newAdmin = new Admin({ email, password });
        const user = new User({ username:email, password: password });

        await newAdmin.save();
        await user.save()

        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


   async function adminlogin (req, res)  {
       
       const { email, password } = req.body;
       try {

        const admin = await Admin.findOne({ email });
      console.log(admin)
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
            
        }
        console.log(admin)

        // const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: admin.email,password:admin.password, isAdmin: true }, 'SECRET', { expiresIn: '1h' });
     
      res.status(200).json({ message: 'Login successful', token: token });
        
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
   }



module.exports = { createAdmin , adminlogin}
