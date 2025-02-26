//GET PRODUCT API SERVICES (getting one or more products)
import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name: 'products',//common name for this particular file/slice
    initialState: {// this slice intital it should be false
        loading: false// loading filed
    },//after loading below stuffs will happens/ changes taken reducer property gives object
    reducers: {
        //after login 
        productsRequest(state, action){ // this object is created 
            return {
                loading: true 
            }
        },
        //after login it takes product data from backend to here
        productsSuccess(state, action){// action takes the data and give here
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.count, //for pagination (totalItemsCount)
                resPerPage:action.payload.resPerPage,//same as above,change is no of product in one page
                // productsCount: action.payload.count,
                // resPerPage : action.payload.resPerPage
            }
        },
        //wt if error in taking data 
        productsFail(state, action){
            return {
                loading: false,
                error:  action.payload
            }
        },
        //this will take care of code from backend/route/produt.js to frontend (allowing admin alone to see the dashboard)
        adminProductsRequest(state, action){
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action){
            return {
                loading: false,
                products: action.payload.products,
            }
        },
        adminProductsFail(state, action){
            return {
                loading: false,
                error:  action.payload
            }
        },
        clearError(state, action){
            return {
                ...state,
                error:  null
            }
        }
    }
});

//reducers action creatores (this change as per state)
const { actions, reducer } = productsSlice;

export const { //action creatores name
    productsRequest, 
    productsSuccess, 
    productsFail,
    adminProductsFail,
    adminProductsRequest,
    adminProductsSuccess

} = actions;

export default reducer; // this going to store.js
