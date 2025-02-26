const express=require('express');
const { getProducts,newProduct, getSingleProduct, updateProduct, deleteProduct,createReview, getReviews, deleteReview, getAdminProducts} = require('../controllers/productController');
const router=express.Router();// taking product(fetch) route from (Backend\controllers\productController.js)
const {isAuthenticatedUser, authorizeRoles }=require('../middlewares/authenticate')
//for installing multer for getting registered data (avatar image) in backend:
const multer = require('multer');
const path=require('path');


//for uploading image in products/db from dashboard by admin
const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route('/products').get(getProducts);//Backend\controllers\productController.js and */products is parameter and handler function next to it*
router.route('/product/:id').get(getSingleProduct);//for getting single product with *id as parameter*
//router.route('/product/:id').put(updateProduct);//update //check below /admin/product/:id put..
//router.route('/product/:id').delete(deleteProduct);//delete //check below /admin/product/:id
router.route('/review').put(isAuthenticatedUser, createReview)
//router.route('/reviews').get(getReviews);//below added in admin
//router.route('/review').delete(deleteReview);

//admin routes:
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'),upload.array('images'), newProduct);//for new product
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'),getAdminProducts);//for new product
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'),deleteProduct);//for product delete
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'),upload.array('images'),updateProduct);//for new upadate product + image
router.route('/admin/reviews').get(isAuthenticatedUser, authorizeRoles('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticatedUser, authorizeRoles('admin'),deleteReview)

module.exports=router //now we can use it in App.js