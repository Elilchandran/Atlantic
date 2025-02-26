const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const ErrorHandler=require('../utils/errorHandler')
const sendToken=require('../utils/jwt')
const sendEmail=require('../utils/email')//reset password through email token
const crypto=require('crypto')//for reset password

//Register User - /api/a1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body
//avatar is optional so below in separately
let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
    }

    //create (return user)data
    const user = await User.create({
        name,
        email,
        password,
        avatar
    });
//from /utils/jwt.js 
    sendToken(user, 201, res)

})

//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} =  req.body

    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //finding the user database
    const user = await User.findOne({email}).select('+password');//chain function select method(+password)

    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401))//401 unauthorized not incorrect passw/email
    }
    
    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res)
    
})

//Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
        res.cookie('token',null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        .status(200)
        .json({
            success: true,
            message: "Loggedout"
        })

}

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError( async (req, res, next)=>{
    const user =  await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    // console.log('Generated Reset Token:', resetToken);
    // console.log('Reset Token Hash:', user.resetPasswordToken);
    // console.log('Reset Token Expiry:', user.resetPasswordTokenExpire);
    await user.save({validateBeforeSave: false})// avoid changes for invalid user

    //Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

    try{
        sendEmail({
            email: user.email,
            subject: "Atlanticcart Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });

    }catch(error){
        user.resetPasswordToken = undefined;//this will not save changes in DB
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }

})  

 //Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError( async (req, res, next) => {
    const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex'); //taking mailtrap token(unhashed token) here and matching it with DB reset token(hashed token)
 //checking/matching mailtrap token(unhashed token) and  DB reset token(hashed token)
     const user = await User.findOne( {
         resetPasswordToken,
         resetPasswordTokenExpire: {
             $gt : Date.now()
         }
     } )
 
     //if token expire
     if(!user) {
         return next(new ErrorHandler('Password reset token is invalid or expired'));
     }


 //here new password and confirm pw
     if( req.body.password !== req.body.confirmPassword) {
         return next(new ErrorHandler('Password does not match'));
     }
 
     user.password = req.body.password;//new password
     //should take reset pw details from DB
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpire = undefined;
     await user.save({validateBeforeSave: false})
     sendToken(user, 201, res)
 
 })


//Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    //notion
    const user = await User.findById(req.user.id)//req.user.id= isAuthenticatedUser(authenticate.js) in decoded variable (req.user)
    res.status(200).json({
         success:true,
         user
    })
 })
 
 //Change Password  - api/v1/password/change
 exports.changePassword  = catchAsyncError(async (req, res, next) => {
     const user = await User.findById(req.user.id).select('+password');//in forget password used (userModel.js) used isModified here .select(+..)
     //check old password (userModel.js)
     if(!await user.isValidPassword(req.body.oldPassword)) {
         return next(new ErrorHandler('Old password is incorrect', 401));
     }
 
     //assigning new password
     user.password = req.body.password;
     await user.save();
     res.status(200).json({
         success:true,
     })
  })


  //Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    //user going to change
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //avatar is optional so below in separately (used in registrated user above)
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
        //code for newUserData update
        newUserData ={...newUserData,avatar}
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,//will give newly updated data *new:*
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })

})

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
         success: true,
         users
    })
 })
 
 //Admin: Get Specific User - api/v1/admin/user/:id
 exports.getUser = catchAsyncError(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if(!user) {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
     }
     res.status(200).json({
         success: true,
         user
    })
 });
 
 //Admin: Update User - api/v1/admin/user/:id
 exports.updateUser = catchAsyncError(async (req, res, next) => {
     const newUserData = {
         name: req.body.name,
         email: req.body.email,
         role: req.body.role //admin can change the role(profile user)
     }
 
     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
         new: true,
         runValidators: true,
     })
 
     res.status(200).json({
         success: true,
         user
     })
 })
 
 //Admin: Delete User - api/v1/admin/user/:id
 exports.deleteUser = catchAsyncError(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if(!user) {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
     }
     //await user.remove(); error it can be (deleteOne or findByIdAndDelete ) so below
     //await User.findByIdAndDelete(req.params.id);or
     await user.deleteOne(); // Deletes the specific user instance

     res.status(200).json({
         success: true,
     })
 })