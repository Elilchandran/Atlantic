import { Link } from "react-router-dom";

export default function CheckoutSteps({shipping, confirmOrder, payment}) {
    return (

        <div className="checkout-progress d-flex justify-content-center mt-5">
            {/*if shipping is true below */}
            {
            shipping ?
            <Link to="/shipping">
                <div className="triangle2-active"></div>
                <div className="step active-step">Shipping Info</div>
                <div className="triangle-active"></div>{/*triangle-active classes and similar are styles made ex:app.css */}
            {/*if below is not coming under shipping page means below */}
            </Link>:
             <Link to="/shipping">
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Shipping Info</div>
                <div className="triangle-incomplete"></div>
             </Link>
            }
            {/*if order is confirm */}
            { confirmOrder ?
            <Link to="/order/confirm">
                <div className="triangle2-active"></div>
                <div className="step active-step">Confirm Order</div>
                <div className="triangle-active"></div>
            </Link>:
             <Link to="/order/confirm">
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Confirm Order</div>
                <div className="triangle-incomplete"></div>
             </Link>
            }

            
            { payment ?
            <Link to="/payment">
                <div className="triangle2-active"></div>
                <div className="step active-step">Payment</div>
                <div className="triangle-active"></div>
            </Link>:
             <Link to="/payment">
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Payment</div>
                <div className="triangle-incomplete"></div>
             </Link>
            }
    
      </div>
    )
}