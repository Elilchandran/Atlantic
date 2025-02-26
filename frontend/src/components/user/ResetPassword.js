import { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearAuthError } from '../../actions/userActions';
import {useNavigate, useParams} from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ResetPassword() {
    const [password, setPassword] = useState("");//getting new user reset password
    const [confirmPassword, setConfirmPassword] = useState("");// confirm password 
    const dispatch = useDispatch();
    const { isAuthenticated, error }  = useSelector(state => state.authState)
    const navigate = useNavigate();
    const { token } = useParams();//useParamas used to take token from url
//same as forgot password below handler
    const submitHandler  = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        
        dispatch(resetPassword(formData, token))
    }

    //same as authSlice.js
    useEffect(()=> {
        if(isAuthenticated) {
            toast('Password Reset Success!', {
                type: 'success',
                position: "bottom-center"
            })
            navigate('/')
            return;
        }
        //error msg code id from forgot password
        if(error)  {
            toast.error(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[isAuthenticated, error, dispatch, navigate])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>

                </form>
            </div>
        </div>
    )
}