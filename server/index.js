const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Admin = require('./models/Admin'); 
const cors = require('cors');
const bcrypt = require('bcrypt');
const router = express.Router();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');



const Product = require('./models/Products.js')
const Contact = require('./models/Contact.js')


const app = express()

app.use(cors());
app.use(express.json())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static('public'))
app.use(cookieParser())
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/Product')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

    app.post('/products', async (req, res) => {
        try {

          const { name, price, description, image } = req.body;
      

          const newProduct = new Product({
            name,
            price,
            description,
            image
          });
      
     
          const savedProduct = await newProduct.save();
      
          res.status(201).json(savedProduct); 
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' }); 
        }
      });

      async function getProductById(productId) {
       
        const Product = require('./models/Products.js');
    
        
        const product = await Product.findById(productId);
    
        
        return product;
    }

      app.post('/checkout/:productId', async (req, res, next) => {
        try {
            
            const productId = req.params.productId;
    
            
            const product = await getProductById(productId);
    
          
            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: product.name,
                            
                        },
                        unit_amount: product.price*100, 
                    },
                    quantity: 1, 
                }],
                mode: 'payment',
                success_url: 'http://localhost:4242/success.html',
                cancel_url: 'http://localhost:4242/cancel.html'
            });
    
          
            res.status(200).json({ sessionId: session.id });
        } catch (error) {
            next(error);
        }
    });
    


      app.get('/api/images', async (req, res) => {
        try {
  
          const products = await Product.find({}, 'name price description image');
          res.json(products);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      const stripe = require('stripe')('sk_test_51OvdziSEeNnK6Y0xYneiw4ShDPm360BR1KHCuU7PC2Z8TxV4eMpWJfcHsZClVwg1Uwwf8MhYf9qxonZGVxd9Iz3q00cUZ6zLa7')
      app.post('/checkout', async(req, res, next) => {
        try {
            const session = await stripe.checkout.sessions.create({
                line_items: req.body.items.map((item) => ({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name,
                            // images: [item.image]
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                })),
                mode: 'payment',
                success_url: 'http://localhost:4242/success.html',
                cancel_url: 'http://localhost:4242/cancel.html'
            });
            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    });



    app.put('/products/:productId', async (req, res) => {
      try {
        const productId = req.params.productId;
        const { name, price, description, image } = req.body;
    
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
          name,
          price,
          description,
          image
        }, { new: true });
    
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        res.json(updatedProduct);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    
    app.delete('/products/:id', async (req, res) => {
      try {
        const productId = req.params.id;
    

        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: 'Invalid product ID' });
        }
    

        const deletedProduct = await Product.findByIdAndDelete(productId);
    
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/admin/add', async (req, res) => {
      try {
          const { email, password } = req.body;
  

          const existingAdmin = await Admin.findOne({ email });
  
          if (existingAdmin) {
              return res.status(400).json({ message: 'Admin already exists' });
          }
  

          const hashedPassword = await bcrypt.hash(password, 10);
  

          const newAdmin = new Admin({ email, password: hashedPassword });
  

          await newAdmin.save();
  
          res.status(201).json({ message: 'Admin added successfully' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
      }
  });
  




  app.post('/login',   async (req, res) => {
      const { email, password } = req.body;
  
      try {

          const admin = await Admin.findOne({ email });
      
          if (!admin) {
              return res.status(401).json({ message: 'Invalid email or password' });
              
          }

          const isPasswordValid = await bcrypt.compare(password, admin.password);
  
          if (!isPasswordValid) {
              return res.status(401).json({ message: 'Invalid email or password' });
          }
          const token = jwt.sign({ email: admin.email,password:admin.password, isAdmin: true }, 'SECRET', { expiresIn: '1h' });
       
        res.status(200).json({ message: 'Login successful', token: token });
          
         
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });

  app.get('/products/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  app.post('/contact', async (req, res) => {
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
  });
 

 
 
      module.exports = app;



app.listen(4242,()=>console.log('Server is Running on Port 4242'))