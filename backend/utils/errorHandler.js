class ErrorHandler extends Error{//creating class named ErrprHandler with parent class Error
    constructor(message, statusCode){//creating sending object.
        super(message);//calling super and  created bz it sending message, statusCode from constructor(to parent class(Error))
        this.statusCode = statusCode;//assigning statusCode to this object
        //stack property (captureStackTrace- method)function  *gives stack property for given object*
        Error.captureStackTrace(this,this.constructor)
    }
}

//creating Error Middleware
module.exports=ErrorHandler;//used in ProductController