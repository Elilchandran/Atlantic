import {useEffect, useState} from 'react';
import {useDispatch, useSelector } from 'react-redux'
import { register, clearAuthError } from '../../actions/userActions'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    //for entering details
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    });
    //img creating while registation
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.authState)

    //Getting register input value in userData & setUserData in onChange
    const onChange = (e) => {
        if(e.target.name === 'avatar') {
           const reader = new FileReader();//from file we coming to read data so FileReader
           reader.onload = () => {
                if(reader.readyState === 2) { //readyState is a field inside reader
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0])
                }
           }


           reader.readAsDataURL(e.target.files[0])//file data taken or assumed as url after this above reader.onload will works
        }else{
            setUserData({...userData, [e.target.name]:e.target.value })
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();//prevents browser loading
        const formData = new FormData();//its a js class
        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('password', userData.password)
        formData.append('avatar', avatar);
        dispatch(register(formData))
    }

    //gives error it user missed any detail or didt give any details in register page
    useEffect(()=>{
        if(isAuthenticated) {
            navigate('/');//if authendicated it should take details in DB
            return
        }
        if(error)  {
            toast.error(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[error, isAuthenticated, dispatch, navigate])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                <h1 className="mb-3">Register</h1>

            <div className="form-group">
                <label htmlFor="email_field">Name</label>
                <input name='name' onChange={onChange} type="name" id="name_field" className="form-control" />
            </div>

                <div className="form-group">
                <label htmlFor="email_field">Email</label>
                <input
                    type="email"
                    id="email_field"
                    name='email' 
                    onChange={onChange}
                    className="form-control"
                  
                />
                </div>
    
                <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                    name='password' 
                    onChange={onChange}
                    type="password"
                    id="password_field"
                    className="form-control"
                  
                />
                </div>

                <div className='form-group'>
                <label htmlFor='avatar_upload'>Avatar</label>
                <div className='d-flex align-items-center'>
                    <div>
                        <figure className='avatar mr-3 item-rtl'>
                            <img
                                src={avatarPreview}
                                className='rounded-circle'
                                alt='Avatar'
                            />
                        </figure>
                    </div>
                    <div className='custom-file'>
                        <input
                            type='file'
                            name='avatar'
                            onChange={onChange}
                            className='custom-file-input'
                            id='customFile'
                        />
                        <label className='custom-file-label' htmlFor='customFile'>
                            Choose Avatar
                        </label>
                    </div>
                </div>
            </div>
    
                <button
                id="register_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading}//this value from redux state in console used after clicking register button
                >
                REGISTER
                </button>
            </form>
            </div>
        </div>
    )
}