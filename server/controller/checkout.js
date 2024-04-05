const stripe = require('stripe')('sk_test_51OvdziSEeNnK6Y0xYneiw4ShDPm360BR1KHCuU7PC2Z8TxV4eMpWJfcHsZClVwg1Uwwf8MhYf9qxonZGVxd9Iz3q00cUZ6zLa7')
const Order = require('../models/Order.js'); 


async function getProductById(productId) {
    const Product = require('../models/Products.js');
    const product = await Product.findById(productId);
    return product;
}

 async function checkoutproduct (req, res, next){
    try {
        
        const productId = req.params.productId;
        const { username } = req.body; 

        const product = await getProductById(productId);

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                       
                        name: product.name,
                    },
                    unit_amount: product.price*100, 
                },
                quantity: 1, 
            }],
            mode: 'payment',
            
            success_url: 'http://localhost:4242/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:4242/cancel.html',
            metadata: {
              productId: productId ,
              username:username,
              totalprice:product.price
            },           
        });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
        next(error);
    }
};


 async function success(req, res, next)  {
    try {
        const sessionId = req.body.sessionId;
       
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(stripeSession)

            const productId = stripeSession.metadata.productId;
            const username = stripeSession.metadata.username;
            const product = await getProductById(productId);

            const orders = new Order({
              username: username,
              name: product.name,
              price: product.price,
              quantity: 1, 
              totalprice:product.price

          });
        await orders.save();
        res.status(200).send('Payment successful. Product details saved.');
        
    } catch (error) {
        next(error);
    }
};


 async function checkoutcart(req, res, next) {
    try {
      const { username , items, totalprice} = req.body;
      const itemDetails = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalprice:totalprice

    }));
      const itemsString = JSON.stringify(itemDetails);
    
        const session = await stripe.checkout.sessions.create({
          
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount:( item.price * 100),
                },
                quantity: (item.quantity),
            })),
            mode: 'payment',
            success_url: 'http://localhost:4242/successcart.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:4242/cancel.html',
            metadata: {
              // productId: productId ,
            totalprice:totalprice,
            items: itemsString, 
              username:username
            },  
        });
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};


    async function successcart (req, res, next)  {
  try {
      const sessionId = req.body.sessionId;
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
     
          const totalprice = stripeSession.metadata.totalprice;
          const product = stripeSession.metadata.items;
          const username = stripeSession.metadata.username;
     
          const orders = new Order({
            username: username,
            totalprice:totalprice,
            item:product
        });
        await orders.save();
        res.status(200).send('Payment successful. Product details saved.');
  } catch (error) {
      next(error);
  }
}



module.exports = {checkoutproduct, success, checkoutcart, successcart}
