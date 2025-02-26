//instead of using postman or inserting data in mongoDB below is created(seeder route)
const products=require('../data/products.json')
const Product=require('../models/productModel')//saving in mongoDB Compass
const dotenv=require('dotenv');//connecting config and seeder
const connectDatabase=require('../config/database')//DB Connection is in Backend/config/config.js using here

dotenv.config({path:'backend/config/config.env'});//connecting config and seeder
// Debugging environment variables
console.log('DB_LOCAL_URI:', process.env.DB_LOCAL_URI); // Check if this logs correctly

connectDatabase()//calling DB Connection 


const seedProducts=async ()=>{
    try{
        await Product.deleteMany();// it will delect previous product details in DB
        console.log('Products delected successfully')
        await Product.insertMany(products);
        console.log('Products seeded successfully');
    }catch(err){
        console.log(err.message)
    }
    process.exit();//this is to exit with out ctrl+c from terminal

}

seedProducts();