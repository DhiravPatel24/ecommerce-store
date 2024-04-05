const Contact = require('../models/Contact.js')

async function contact (req, res)  {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
  }



async function addcontact (req, res) {
    try {
      const { name, email, message } = req.body;
  
     
      const newContact = new Contact({
        name,
        email,
        message
      });
  
     
      await newContact.save();
  
      res.status(201).json({ success: true, message: 'Contact form submitted successfully!' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ success: false, message: 'An error occurred while submitting the contact form.' });
    }
  };



module.exports = {contact, addcontact}  