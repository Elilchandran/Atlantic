// all states of the store/ project in below codes
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import productsReducer from "./slices/productsSlice";// every action it changes a state
import productReducer from "./slices/productSlice";// every action it changes a state for single product detail
import authReducer from './slices/authSlice';// for login auth
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice'

//reducer will be for each (products, orders, users)
const reducer = combineReducers({
     productsState: productsReducer,//productsState is a key
     productState: productReducer ,
     authState: authReducer,
     cartState: cartReducer,
     orderState: orderReducer,
     userState: userReducer
})

// //actual code
// const store = configureStore({
//     reducer,
//     middleware: [thunk]//thunk will do asynchronize operation (action without delay/ synchronized way)
// })
//Correct `middleware` configuration from chatgpt
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
//or
// Configure the Redux store with the reducer and middleware advance
// const store = configureStore({
//     reducer, // Root reducer
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add thunk for async actions
//     devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode
// });

export default store;//doing this bz to access state all over the project