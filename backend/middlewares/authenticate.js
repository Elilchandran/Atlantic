const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel')
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');//decoding the token id

exports.isAuthenticatedUser = catchAsyncError( async (req, res, next) => {
    const { token  }  = req.cookies;//in app.js cookie parser used in app.use(co..()) so no error 
   
    if( !token ){
         return next(new ErrorHandler('Login first to handle this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)// there is verify available in jwt package for decoding the token from cookie
    req.user = await User.findById(decoded.id)
    next();
 })

 exports.authorizeRoles = (...roles) => {
    return  (req, res, next) => {
         if(!roles.includes(req.user.role)){
             return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
         }
         next()//in product.js it take to newProduct after admin
    }
 }   