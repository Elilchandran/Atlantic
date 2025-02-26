const express = require('express');
//for installing multer for getting registered data (avatar image) in backend:
const multer = require('multer');
const path=require('path');


const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/user' ) )//'..' giving this tells tells one step back
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })



const {registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser}=require('../controllers/authController')
const router = express.Router();
const {isAuthenticatedUser,authorizeRoles}=require('../middlewares/authenticate')

router.route('/register').post(upload.single('avatar'),registerUser);//app.js
router.route('/login').post(loginUser);//app.js
router.route('/logout').get(logoutUser);//from authController.js to app.js
router.route('/password/forgot').post(forgotPassword);//from authController.js
router.route('/password/reset/:token').post(resetPassword);//from authController.js
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);//from authController.js
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/update').put(isAuthenticatedUser,upload.single('avatar'),updateProfile);//for updated/ remodified user profile details
//router.route('/update').post(isAuthenticatedUser,updateProfile);//from authController.js for including option avatar above code is good

//Admin routes ref(product.js for (admin))
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser)
                                .put(isAuthenticatedUser,authorizeRoles('admin'), updateUser)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);


module.exports = router;