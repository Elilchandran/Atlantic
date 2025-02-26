//user collection schema
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // instead of 'bcrypt'
const jwt=require('jsonwebtoken');
const crypto=require('crypto')


//mongoose module schema
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,//unique email id
        validate: [validator.isEmail, 'Please enter valid email address']// npm validator package for correct email validator
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false// it will not take pw to all places only selected filed like (Backend\controllers\authController.js) *+password*
    },
    //user profile pic
    avatar: {
        type: String,
        //required:true //is not used bz every user will not upload pic/img
    },
    role :{
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
})

//Problem: If the password is already hashed or undefined (e.g., during updates), this will fail.
// userSchema.pre('save',async function(next){
//     this.password= await bcrypt.hash(this.password, 10)
// })

//Adding a check to ensure the password is only hashed if it has been modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {   //modified tells true or false if there is no password better skip 
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//JWT for particular user
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

//using bcryt pw correct or compare
// userSchema.methods.isValidPassword = async function(enteredPassword){
//     return await bcrypt.compare(enteredPassword, this.password)
// }
userSchema.methods.isValidPassword = async function (enteredPassword) {
    //console.log('Entered Password:', enteredPassword);
    //console.log('Stored Password:', this.password);
    return bcrypt.compare(enteredPassword, this.password);
};


//reset password:
userSchema.methods.getResetToken = function(){
    //Generate Token
    const token = crypto.randomBytes(20).toString('hex');

    //Generate Hash and set to resetPasswordToken
   this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');

   //Set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}


let model =  mongoose.model('User', userSchema);


module.exports = model;