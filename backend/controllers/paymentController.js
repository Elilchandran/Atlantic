// // const catchAsyncError = require('../middlewares/catchAsyncError');
// // const stripe = require('razorpay')(process.env.STRIPE_SECRET_KEY);//1st time using outside request handler function

// // exports.processPayment  = catchAsyncError(async(req, res, next) => {
// //     const paymentIntent = await stripe.paymentIntents.create({
// //         amount: req.body.amount,
// //         currency: "usd",
// //         description: "TEST PAYMENT",
// //         metadata: { integration_check: "accept_payment"},
// //         shipping: req.body.shipping
// //     })

// //     res.status(200).json({
// //         success: true,
// //         client_secret: paymentIntent.client_secret//will use it in frontend (sereat key for every stuff done)
// //     })
// // })

// // exports.sendStripeApi  = catchAsyncError(async(req, res, next) => {
// //     res.status(200).json({
// //         stripeApiKey: process.env.STRIPE_API_KEY
// //     })
// // })
// const catchAsyncError = require('../middlewares/catchAsyncError');
// const Razorpay = require('razorpay');

// // Initialize Razorpay with your API keys
// const razorpay = new Razorpay({
//     key_id: process.env.STRIPE_API_KEY, // Razorpay Key ID
//     key_secret: process.env.STRIPE_SECRET_KEY // Razorpay Secret Key
// });

// exports.processPayment = catchAsyncError(async (req, res, next) => {
//     const options = {
//         amount: req.body.amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
//         currency: "INR",
//         receipt: `receipt_order_${Math.random()}`,
//         payment_capture: 1 // Auto capture
//     };

//     try {
//         const order = await razorpay.orders.create(options);

//         res.status(200).json({
//             success: true,
//             order_id: order.id, // Send order ID to frontend
//             amount: order.amount,
//             currency: order.currency
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
//     res.status(200).json({
//         razorpayApiKey: process.env.STRIPE_API_KEY // Razorpay Key ID
//     });
// });

const catchAsyncError = require('../middlewares/catchAsyncError');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.STRIPE_API_KEY, // Razorpay Key ID
    key_secret: process.env.STRIPE_SECRET_KEY // Razorpay Secret Key
});

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const options = {
        amount: req.body.amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${Math.random()}`,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Verify payment to prevent fraud
exports.verifyPayment = catchAsyncError(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Concatenate order_id and payment_id
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature using Razorpay secret
    const expectedSignature = crypto
        .createHmac("sha256", process.env.STRIPE_SECRET_KEY)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
});

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        razorpayApiKey: process.env.STRIPE_API_KEY
    });
});
