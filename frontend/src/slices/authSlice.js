//GET PRODUCT API SERVICES (getting one or more products)
import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',//user login or logout auth file/slice
    initialState: {// this slice intital it should be false
        loading: true,// loading filed
        isAuthenticated:false //initially user auth should be false
    },//after loading below stuffs will happens/ changes taken reducer property gives object
    reducers: {
        //after login 
        loginRequest(state, action){ // this object is created for login req
            return {
                //instead of this giving below line isAuthenticated:false 
                ...state,
                loading: true,
                
            }
        },
        //after login matches and success
        loginSuccess(state, action){// action takes the data and give here
            return {
                loading: false,
                isAuthenticated:true, //come true bz login successfully
                user:action.payload.user,//takes user detail from DB
            }
        },
        //wt if error in taking data 
        loginFail(state, action){
            return {
               //instead of this giving below line isAuthenticated:false 
                ...state, //if error comes/ password wrong then auth false
                loading: false,
                error:  action.payload
            }
        },
        clearError(state, action){
            return {
                ...state,
                error:  null
            }
        },
        registerRequest(state, action){
            return {
                ...state,
                loading: true,
            }
        },
        registerSuccess(state, action){
            return {
                loading: false,//after request gone to db everthing happens so it is false
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        registerFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload 
            }
        },
        loadUserRequest(state, action){
            return {
                ...state,
                isAuthenticated: false,
                loading: true,
            }
        },
        loadUserSuccess(state, action){
            return {
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        loadUserFail(state, action){
            return {
                ...state,
                loading: false,
                //error:  action.payload //not needed bz why logout before login this error comes so it not needed to show to the user
            }
        },
        logoutSuccess(state, action){
            return {
                loading: false,
                isAuthenticated: false,
            }
        },
        logoutFail(state, action){
            return {
                ...state,
                error:  action.payload
            }
        },
        updateProfileRequest(state, action){
            return {
                ...state,
                loading: true,
                isUpdated: false
            }
        },
        updateProfileSuccess(state, action){
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                isUpdated: true
            }
        },
        updateProfileFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        clearUpdateProfile(state, action){
            return {
                ...state,
                isUpdated: false
            }
        },updatePasswordRequest(state, action){
            return {
                ...state,
                loading: true,
                isUpdated: false
            }
        },
        //want to know password updated or not
        updatePasswordSuccess(state, action){
            return {
                ...state,
                loading: false,
                isUpdated: true
            }
        },
        updatePasswordFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        forgotPasswordRequest(state, action){
            return {
                ...state,
                loading: true,
                message: null //bz if mongoDB unknow password gave in network it will come forgotPasswordFail but in msg it shows mail sent so message=null
            }
        },
        forgotPasswordSuccess(state, action){
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        },
        forgotPasswordFail(state, action){
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        resetPasswordRequest(state, action){
            return {
                ...state,
                loading: true,
            }
        },
        resetPasswordSuccess(state, action){
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        resetPasswordFail(state, action){
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
       
    }
});

//reducers action creatores (this change as per state)
const { actions, reducer } = authSlice;

export const { //action creatores name
    loginRequest, 
    loginSuccess, 
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    clearUpdateProfile,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordFail,
    forgotPasswordSuccess,
    forgotPasswordRequest,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
   

} = actions;

export default reducer; // this going to store.js
