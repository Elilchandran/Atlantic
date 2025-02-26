const ErrorHandler = require("../utils/errorHandler");

//handles error (middlware)
module.exports=(err,req,res,next)=>{ //err property also gets
    err.statusCode=err.statusCode||500;// 500 means internal status code error

    //enivronment type error
    //this is for develoment side error
    if(process.env.NODE_ENV =='development'){
       //code:
       res.status(err.statusCode).json({//status is in bulit method
        success:false,
        message:err.message, //this will be from C:\Users\Elil-Karthi\Documents\Atlantic\Backend\utils\errorHandler.js from ErrorHandler
        //this is only for development side error
        stack:err.stack, //this is for getting extra details abt error with help of captureStackTrace(C:\Users\Elil-Karthi\Documents\Atlantic\Backend\utils\errorHandler.js)
        error:err,
    }) 
    }
/*//this is for production side error
    if(process.env.NODE_ENV =='production'){
        //code:
        res.status(err.statusCode).json({//status is in bulit method
         success:false,
         message:err.message, //this will be from C:\Users\Elil-Karthi\Documents\Atlantic\Backend\utils\errorHandler.js from ErrorHandler
     }) 
     }*/

     //above is not validation error example 
     if(process.env.NODE_ENV =='production'){
        //validation error
        let message=err.message;
        //error variable
        //let error={...err}; 
        //for fixing error in wrong id while getting single product is fixed
        let error=new ErrorHandler(message);
        if(err.name =='ValidationError'){
            message=Object.values(err.errors).map(value=>value.message);
            error=new ErrorHandler(message)
            err.statusCode=400;//email is vaid or not so 400
        }

        //Handling casting error
        if(err.name ==='CastError'){
            message=`Resource not found: ${err.path}`;
            error=new ErrorHandler(message)
            err.statusCode=400;
        }

        //for duplicate emailId / twice same emailId
        //if code run in (npm run dev = code value(error) available)
        if(err.code ==11000){  
            let message=`Duplicate ${Object.keys(err.keyValue)} error`;//see notion
            error=new ErrorHandler(message);
            err.statusCode=400;
        }

        //JSONWebToken error:
        if(err.name == 'JSONWebTokenError') {
            let message = `JSON Web Token is invalid. Try again`;
            error = new ErrorHandler(message);
            err.statusCode=400;
        }

         //JSONWebToken expires error:
         if(err.name == 'TokenExpiredError') {
            let message = `JSON Web Token is expired. Try again`;
            error = new ErrorHandler(message);
            err.statusCode=400;
        }

        //code:
        res.status(err.statusCode).json({//status is in bulit method
         success:false,
         //if give message alone it will give error class will be in array
         message:error.message || 'Internal Server Error', //this will be from C:\Users\Elil-Karthi\Documents\Atlantic\Backend\utils\errorHandler.js from ErrorHandler
     }) 
     }

    
}