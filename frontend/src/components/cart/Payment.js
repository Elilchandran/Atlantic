import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { validateShipping } from "../cart/Shipping";
import { createOrder } from "../../actions/orderActions";//after OrderSuccess.js
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {
    //real code variables stripe, elements not here
    //const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo")) || {};

    const { user } = useSelector((state) => state.authState);
    const { items: cartItems, shippingInfo } = useSelector((state) => state.cartState);
    const { error: orderError } = useSelector((state) => state.orderState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //below code when there is error in order
    useEffect(() => {
        if (!shippingInfo) {
            validateShipping(shippingInfo, navigate);
        }
        if (orderError) {
            toast.error(orderError, {
                position: "bottom-center",
                type: "error",
                onOpen: () => {
                    dispatch(clearOrderError());
                },
            });
        }
    }, [dispatch, navigate, orderError, shippingInfo]);
    

    const loadRazorpay = async () => {
        try {
            // Get Razorpay API key from the backend
            const { data } = await axios.get("/api/a1/stripeapi");
            const razorpayApiKey = data.razorpayApiKey;

            // Create an order from the backend
            const { data: orderData } = await axios.post("/api/a1/payment/process", {
                amount: orderInfo.totalPrice * 100,//newly added  Convert rupees to paise
            });

            const options = {
                key: razorpayApiKey, // Razorpay API Key
                amount: orderData.amount, // Amount in paise
                currency: "INR",
                name: "Atlantic Cart",
                description: "Order Payment",
                image: "/logo.png", // Optional: Add a company logo
                order_id: orderData.order_id, // Razorpay Order ID
                //new code
                handler: async function (response) {
                    if (!response.razorpay_payment_id) {
                        toast.error(
                            <div>
                                Payment Failed! <br />
                                <button 
                                    onClick={loadRazorpay} 
                                    style={{ 
                                        backgroundColor: "#3ac4a1", 
                                        color: "white", 
                                        border: "none", 
                                        padding: "5px 10px", 
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        marginTop: "5px"
                                    }}
                                >
                                    Try Again
                                </button>
                            </div>, 
                            {
                                position: "bottom-center",
                                autoClose: false, // Keep it open until user interacts
                            }
                        );
                        return;
                    }
                
                    toast.success("Payment Successful! Redirecting...", {
                        position: "bottom-center",
                        autoClose: 2000,
                    });
                
                    const order = {
                        orderItems: cartItems,
                        shippingInfo,
                        itemsPrice: orderInfo.itemsPrice,
                        shippingPrice: orderInfo.shippingPrice,
                        taxPrice: orderInfo.taxPrice,
                        totalPrice: orderInfo.totalPrice,
                        paymentInfo: {
                            id: response.razorpay_payment_id,
                            status: "Completed",
                        },
                    };
                
                    dispatch(orderCompleted());
                    dispatch(createOrder(order));
                    
                    navigate("/order/success");
                    //i want to delay then below code
                    // setTimeout(() => {
                    //     navigate("/order/success");
                    // }, 2500);
                },
                
                //old code 
                // handler: async function (response) {
                //     if (!response.razorpay_payment_id) {
                //         toast.error("Payment Failed! Try Again.", { position: "bottom-center" });
                //         return;
                //     }
                //     toast("Payment Successful!.. Redirecting...", {
                //         type: "success",
                //         position: "bottom-center",
                //         autoClose: 2000, // Show for 2 seconds before redirecting
                //     });

                //     const order = {
                //         orderItems: cartItems,
                //         shippingInfo,
                //         itemsPrice: orderInfo.itemsPrice,
                //         shippingPrice: orderInfo.shippingPrice,
                //         taxPrice: orderInfo.taxPrice,
                //         totalPrice: orderInfo.totalPrice,
                //         paymentInfo: {
                //             id: response.razorpay_payment_id,
                //             status: "Completed",
                //         },
                //     };

                //     dispatch(orderCompleted());
                //     dispatch(createOrder(order));

                //     //navigate("/order/success");
                //     setTimeout(() => {
                //         navigate("/order/success");
                //     }, 2500); // Wait 2.5 seconds before redirecting
                // },
                prefill: {
                    name: user.name,
                    //email: user.email,//Email is commented out in prefill. This is good for privacy; keep it that way.
                    //better to hide more shipping info
                    address:{
                        city: shippingInfo.city,
                        postal_code : shippingInfo.postalCode,
                        country: shippingInfo.country,
                        state: shippingInfo.state,
                        line1 : shippingInfo.address
                    },
                    contact: shippingInfo.phoneNo,
                },
                theme: {
                    color: "#48CAE4",
                },
            };
            //comment it bz to do below //newly added:
            // if (!window.Razorpay) {
            //     toast.error("Razorpay SDK not loaded. Refresh and try again.");
            //     return;
            // }
            //Handle Razorpay SDK Load Failure. Right now, if Razorpay SDK is not loaded, it just shows an error.Add a retry mechanism to reload the script dynamically.

            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                document.body.appendChild(script);
                script.onload = loadRazorpay;
                return;
            }
            
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment failed:", error);
            toast.error("Payment Failed! Try Again.", {
                type: "error",
                position: "bottom-center",
            });
        }
    };

    return (
        <div className="row wrapper" style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px" }}>
        <div className="col-10 col-lg-5">
            <div className="shadow-lg p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #ddd", borderRadius: "10px" }}>
                <h1 className="mb-4" style={{ color: "#333" }}>Payment</h1>
                <button
                    id="pay_btn"
                    type="submit"
                    className="btn btn-block py-3"
                    onClick={loadRazorpay}
                    style={{ backgroundColor: "#3ac4a1", color: "white", fontWeight: "bold", borderRadius: "5px" }}
                >
                    Pay - ₹{orderInfo && orderInfo.totalPrice}
                </button>
            </div>
        </div>
    </div>

    );
}
