import Sidebar from "./Sidebar";
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import { getAdminProducts } from "../../actions/productActions";
import {getUsers} from '../../actions/userActions'
import {adminOrders as adminOrdersAction} from '../../actions/orderActions'
import { Link } from "react-router-dom";

export default function Dashboard () {
    const { products = [] } = useSelector( state => state.productsState);//length of products of admin (products.length)
    const { adminOrders = [] } = useSelector( state => state.orderState);// correct orders count in dashboard
    const { users = [] } = useSelector( state => state.userState ||{});// correct users count in dashboard
    const dispatch = useDispatch();

    let outOfStock = 0;//out of stock in dashboard
    if (products.length > 0) {
        products.forEach( product => {
            if( product.stock === 0  ) {
                outOfStock = outOfStock + 1;
            }
        })
    }

    //total amount in dashboard (all ordered product amt)
    let totalAmount = 0;
    if (adminOrders.length > 0) {
        adminOrders.forEach( order => {
            totalAmount += order.totalPrice
        })
    }



    useEffect( () => {
       dispatch(getAdminProducts);
       dispatch(getUsers);// correct users count in dashboard
       dispatch(adminOrdersAction)// correct orders count in dashboard
    }, [dispatch])


    return (
        <div className="row">
            <div className="col-12 col-md-2">{/*this is for side bar */}
                    <Sidebar/>
            </div>
            <div className="col-12 col-md-10">{/*this is for Dashboard */}
                <h1 className="my-4">Dashboard</h1>
                <div className="row pr-4">
                    <div className="col-xl-12 col-sm-12 mb-3">
                        <div className="card text-white bg-primary o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Total Amount<br /> <b>${totalAmount}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pr-4">
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-success o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Products<br /> <b>{products.length}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                <span className="float-left">View Details</span>
                                <span className="float-right">
                                    <i className="fa fa-angle-right"></i>
                                </span>
                            </Link>
                        </div>
                    </div>


                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-danger o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Orders<br /> <b>{adminOrders.length}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                <span className="float-left">View Details</span>
                                <span className="float-right">
                                    <i className="fa fa-angle-right"></i>
                                </span>
                            </Link>
                        </div>
                    </div>


                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-info o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Users<br /> <b>{users.length}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                <span className="float-left">View Details</span>
                                <span className="float-right">
                                    <i className="fa fa-angle-right"></i>
                                </span>
                            </Link>
                        </div>
                    </div>


                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-warning o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}