import {Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../actions/userActions';
import MetaData from '../layouts/MetaData';
import { toast } from 'react-toastify';
import { Link,  useNavigate,useLocation } from 'react-router-dom';
 export default function Login() {
    const [email, setEmail] = useState("")//collecting value from login pg
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();//used while shipping/ Cart.js

    const { loading, error, isAuthenticated } = useSelector(state => state.authState)//will disable login button if login is true in authSlice.js
    const redirect = location.search?'/'+location.search.split('=')[1]:'/';//while going to shipping page checking if the user login or not if not user taken to login page

    //if form submit/ user gives email, password for get it
    const  submitHandler = (e) => {
        e.preventDefault();//it prevents reloading
        dispatch(login(email, password))
    }

    //if pasword or email is wrong below comes as error gave in backend
    useEffect(() => {
        //if login successfully isAuthenticated works
        if(isAuthenticated) {
            navigate(redirect)
        }

        if(error)  {
            toast.error(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }//clearing the error field in redux state
            })
            return
        }
    },[error, isAuthenticated, dispatch, navigate, redirect, location.search])

    return (
        <Fragment>
            <MetaData title={`Login`} />{/*for title in login page */}
            <div className="row wrapper"> 
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={e =>setEmail(e.target.value)}
                        />
                        </div>
            
                        <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={e =>setPassword(e.target.value)}
                        />
                        </div>

                        <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
            
                        <button
                        id="login_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading}
                        >
                        LOGIN
                        </button>

                        <Link to="/register" className="float-right mt-3">New User?</Link>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}