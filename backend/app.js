const express=require('express');
const app=express();
const errorMiddleware=require('./middlewares/error')//middleware for error (created not in built)
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv');
const path = require('path')

//const dotenv = require('dotenv');
//dotenv.config({path:path.join(__dirname,"config/config.env")});
//const cors = require('cors'); // Import CORS middleware

//taken from server.js and putted below for payment(razorpay)
dotenv.config({path:path.join(__dirname,'config/config.env')});//connecting config and server.js


app.use(express.json());//this will accepts the json data from api body (POST req)
app.use(cookieParser());//using auth(login with cookie token) cookie parser

// Enable CORS
//app.use(cors());
//app.use(cors({ origin: '*' })); // Allow requests from any origin
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


//for avatar upload/user file(making it into static folder):
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

const products=require('./routes/product')//Backend\routes\product.js imported here
const auth=require('./routes/auth')//Backend\routes\auth.js imported here for user authendication
const order=require('./routes/order')//Backend\routes\order.js imported here for user new orders
const payment=require('./routes/payment')// for payment.js

app.use('/api/a1/',products)//use is a middleware function
app.use('/api/a1/',auth)//use is a middleware function for auth
app.use('/api/a1/',order)//use is a middleware function for order
app.use('/api/a1/',payment)//use is a middleware function for payment

app.use(errorMiddleware)//it should be last.it is for handling error as middleware

module.exports=app;