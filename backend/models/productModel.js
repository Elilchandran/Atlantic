//with help of schema middleware in mongoose(module) we can get data and change before saving
const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],//if data error or not came wt to give will be given in [true,(here it given)]
        trim:true,//no space before and after so trim
        maxLength:[100,'product name cannot exceed 100 charaters'],//max length of charaters
    },
    price:{
        type:Number,
        //required:[true,'please enter product price'], // if default:0.0 gave no required needed anyway it will correct it is 0.0
        default:0.0
    },
    description:{
        type:String,
        required:[true,'please enter product description'],
    },
    ratings:{
        type:String,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"], //the cateory we allow the user will be give inside enum
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message : "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [20, 'Product stock cannot exceed 20']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type : mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('Product', productSchema)

module.exports = schema
    