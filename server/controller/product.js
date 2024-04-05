const multer = require('multer');
const Product = require('../models/Products');

    async function createProduct(req, res){
        try {

            const { name, price, description , image} = req.body;    
  
            const newProduct = new Product({
              name,
              price,
              description,
              image
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct); 

          } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal server error', error }); 
          }
      }

      async function getProductById(productId) {
       
        const Product = require('./models/Products.js');
        const product = await Product.findById(productId);
        return product;

    }
    
    async function deleteProduct(req, res){
        try {
            const productId = req.params.id;
        
    
            // if (!mongoose.Types.ObjectId.isValid(productId)) {
            //   return res.status(400).json({ error: 'Invalid product ID' });
            // }
        
    
            const deletedProduct = await Product.findByIdAndDelete(productId);
        
            if (!deletedProduct) {
              return res.status(404).json({ error: 'Product not found' });
            }
        
            res.status(200).json({ message: 'Product deleted successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          }
    }
    async function editProduct(req, res){
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
      }

  async function productdetails (req, res) {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  async function productimage (req, res)  {
    try {
      const products = await Product.find({}, 'name price description image');
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



module.exports = { createProduct, deleteProduct, editProduct, productdetails, productimage};