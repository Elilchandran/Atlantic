const express = require('express');
const { newOrder,getSingleOrder,myOrders,orders,updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/authenticate');

router.route('/order/new').post(isAuthenticatedUser,newOrder);//from orderCotroller.js
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);//from orderCotroller.js
router.route('/myorders').get(isAuthenticatedUser,myOrders);//from orderCotroller.js

//Admin Routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), orders)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
router.route('/admin/order/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)
                        


module.exports = router;