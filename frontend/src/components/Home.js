import { Fragment,useEffect,useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import MetaData from "./layouts/MetaData";
import {getProducts} from '../actions/productActions';
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Include Toastify styles
import Pagination from 'react-js-pagination';


export default function Home() {
  //calling getProduct from productsAction.js in below useEffect(when refresh gave it take new data products)
   const dispatch = useDispatch();// getting from react redux hooks
   const {productsCount,resPerPage, products, loading, error}= useSelector((state)=>state.productsState)//this is for product listing in webpage
   //for pagination purpouse:
   const [currentPage, setCurrentPage] = useState(1);//1 bz for first page
   //console.log(currentPage)
   const setCurrentPageNo=(pageNo)=>{
    setCurrentPage(pageNo);
   }

   useEffect(() => {
    //if no data of product / fetch data error
    if(error){
            return toast.error(error, { //return gave bz it will return if error and not dispactch the below getProduct so return must
              position: 'bottom-center', // Specify position as string
            })
        } else {
        dispatch(getProducts(null,null, null,null, currentPage));
        }
      },[error,dispatch,currentPage]);

//   useEffect(() => {
//     if (error) {
//         toast.error(error, { position: 'bottom-center' });
//         return; // Early exit on error
//     }
//     if (!products || products.length === 0) { // Dispatch only if no products are present
//         dispatch(getProducts(currentPage));
//     }
// }, [dispatch, error, products, currentPage]); // Dependency on products to avoid repeated dispatches




  return (
    //for loading page visiblity before the products details double fragment
   <Fragment>
      {loading ? <Loader/>:
        <Fragment>
          <MetaData title={'Buy Best Products'}/>
          <h1 id="products_heading">Latest Products</h1>
        <section id="products" className="container mt-5">
          <div className="row">
              {products && products.map(product=>(
                <Product col={3} key={product._id} product={product} />//<Product/>//giving key={product._id} bz it helps react to indentify that single product and for pagination purpouse too
              ))}
          </div>
        </section>
        {productsCount > 0 && productsCount > resPerPage ?
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={currentPage} //created bz to know wt is in current pg and have to create separate var (1st page for 2ed below)
            onChange={setCurrentPageNo}//next page no
            totalItemsCount={productsCount}//total no of page/ products
            itemsCountPerPage={resPerPage}//given product per page as per backend productController
            nextPageText={'Next'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass={'page-item'}//from bootstrap
            linkClass={'page-link'}//from bootstrap
          />
        </div> : null}
        </Fragment> 
      }  
   </Fragment> 
    
  );
}
