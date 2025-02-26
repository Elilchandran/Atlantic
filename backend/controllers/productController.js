const Product=require('../models/productModel');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncError=require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');//Search Products by Keywords


//below is handler function with express.js also (express will give argument we can rec it as parameter as req,res,next)
//get product from api({{base_url}}/api/a1/products) route folder
exports.getProducts=catchAsyncError(async (req,res,next)=>{
    //page per page
    const resPerPage=3;//this controlls no.of product visible in page
    //Search Products by Keywords instead for below  created buildQuery for perfect pagination in froent and backend
    //const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    
    //pagination separately for ProductSearch.js(frontend) and separae for (home.js)frontend
    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }
    //no.of.product count in buildQuery will be stored below filteredProductsCount
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    
    //for all the product count in mongoDB:
    const totalProductsCount=await Product.countDocuments({})

    //creating variable it contains products details instead of (products variable below)
    //important logic
    let productsCount = totalProductsCount;

    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    //after waitind for search() apiFeature lined below
    const products= await buildQuery().paginate(resPerPage).query;
    
    //for error in no producct data 
    //return next(new ErrorHandler('Unable to send products!',400))
    //await new Promise(resolve=> setTimeout(resolve,3000)) //intentional loading page
    res.status(200).json({
        success:true,
        //count:products.length,for one product count
        count:productsCount,//for all the product no in mongoDB
        resPerPage,//while pagination in frontend it shows the 3 products
        products
    });

});

//create product-{{base_url}}/api/a1/product/newProduct

//app.use(express.json());//this will accepts the json data from api body (POST req)
/*exports.newProduct=async(req,res,next)=>{
    const product= await Product.create(req.body)
    res.status(201).json({
        success:true,
        product,// taking above product data here (product means key value pairs as per js syntax)
    })
}*/
//above is without catchAsyncError and below is includes it
exports.newProduct=catchAsyncError(async(req,res,next)=>{
    //below is to accept the new image(multiple) upload by admin from dashboard
    let images = []
    if(req.files.length > 0){
        req.files.forEach( file => {
            let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }
    req.body.images=images;//setting images

    req.body.user=req.user.id
    const product= await Product.create(req.body)
    res.status(201).json({
        success:true,
        product,// taking above product data here (product means key value pairs as per js syntax)
    })
});


/*//Get single product*{{base_url}}/api/a1/product/674eb...*
exports.getSingleProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);//req.params is object which contains all the parameters passed
    //if no product or empty.sending error
    //in C:\Users\Elil-Karthi\Documents\Atlantic\Backend\middlewares\error.js  below is the statusCode
    if(!product){
            return next(new ErrorHandler('Product not found testing', 400));// next will pass middleware to next 
    }//creating error middleware to take away it from below success response ()
    
        
    res.status(201).json({
        success:true,
        product
    })
}*/
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');//populate() helps to get some more extra data

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
//making delay after clicking the product or view product
//await new Promise(resolve=>setTimeout(resolve,3000))
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error); // Pass error to the middleware
    }
};


//update product- {{base_url}}/api/a1/product/674ee19efd61abd15edab4df
exports.updateProduct=async(req,res,next)=>{
    let product= await Product.findById(req.params.id);

//below is taken from create new product by admin:
//update img
let images = []

//giving option to admin for update image/ already there will be one img exist + this new img
if(req.body.imagesCleared === 'false' ) {
    images = product.images; //if images not cleared we keep existing images
}//this will upload new img if admin gave, if not will keep the old img

if(req.files.length > 0){
    req.files.forEach( file => {
        let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
        images.push({ image: url })
    })
}
req.body.images=images;//setting images

    //if no product or empty.sending error
    if(!product){
        return res.status(404).json({
            success:false,
            message:'Product not found'
        });
    }
    //if product is found then update it
    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,//new data not  a old data
        runValidators:true //models folder in proctectModel.js validation too checked by this method
    
    })

    res.status(200).json({
        success:true,
        product
    })
}

//delete product
exports.deleteProduct=async(req,res,next)=>{
    const product= await Product.findById(req.params.id);
    //if no product or empty.sending error
    if(!product){
        return res.status(404).json({
            success:false,
            message:'Product not found'
        });
    }
    await product.deleteOne();
    //if product is found then delete it
    res.status(200).json({
        success:true,
        message:'Product Deleted!'
    })
}

//Create Review - api/a1/review
exports.createReview = catchAsyncError(async (req, res, next) =>{
    const  { productId, rating, comment } = req.body;

    const review = {
        user : req.user.id,
        rating,
        comment
    }

        //only one time rvie from 1 customer/user
    const product = await Product.findById(productId);
   //finding user review exists
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()//THE USER ALREADY GIVEN REVIEW
    })


    if(isReviewed){
           //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
        //creating the review   //new reviewer
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    //iif product value is NaN below (value=0)
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })


})

//Get Reviews - api/a1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');//populate() helps to get some more extra data;

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Delete Review - api/a1/review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.productId);
    
    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
       return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })


});

// get admin products  - api/a1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});