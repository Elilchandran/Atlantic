import { Fragment,useEffect,useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import MetaData from ".././layouts/MetaData";
import {getProducts} from '../../actions/productActions';
import Loader from ".././layouts/Loader";
import Product from ".././product/Product";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Include Toastify styles
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';// for search product display+ price filter
import 'rc-slider/assets/index.css';//from npm
import Tooltip from 'rc-tooltip';//for black box in price range
import 'rc-tooltip/assets/bootstrap.css'//from npm 

export default function ProductSearch() {
    //calling getProduct from productsAction.js in below useEffect(when refresh gave it take new data products)
    const dispatch = useDispatch();// getting from react redux hooks
    const {productsCount,resPerPage, products, loading, error}= useSelector((state)=>state.productsState)//this is for product listing in webpage
    //for pagination purpouse:
    const [currentPage, setCurrentPage] = useState(1);//1 bz for first page
    //according to price product should display:
    const[price, setPrice]=useState([1,1000]); 
    //accord to price product should display as per onChange handler:
    const[priceChanged, setPriceChanged]=useState(price); 
    //create state for click change peoduct in categories:
    const [category, setCategory] = useState(null); // for category filter (null bz intially there is no caterories)
    //for rating
    const [rating, setRating] = useState(0); // for category filter (null bz intially there is no caterories)

   // for keyword api in search product
   const{keyword} =useParams(); 
   //caterories below to price range (list from backend=> productModel.js=> caterories )
   const categories=[  
    'Electronics',
    'Mobile Phones',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
];
   


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
    }
        dispatch(getProducts(keyword,priceChanged,category,rating,currentPage)); 
        
  
  },[error,dispatch,currentPage,keyword,priceChanged,category,rating]);

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
          <h1 id="products_heading">Search Products</h1>
        <section id="products" className="container mt-5">
          <div className="row">
            {/*inside to the below 2 div 1 is for slider and another search products */}
              <div className="col-6 col-md-3 mb-5 mt-5">
                  {/* Price Filter */}
                    <div className="px-5" onMouseUp={()=>setPriceChanged(price)}>
                    <Slider
                        range={true}
                        marks={{
                          1: "$1",
                          1000: "$1000"
                        }}
                        min={1}
                        max={1000}
                        defaultValue={price}
                        //cannot use below but just seeing how it works:
                        onChange={(price)=>{
                          setPrice(price)
                        }}
                        //using tooltip inside Slider bz when moving the range the black box should come so
                        handleRender={
                          renderProps => {
                            //below is the logic for tooltip
                              return (
                                  <Tooltip  overlay={`$${renderProps.props['aria-valuenow']}`}  >
                                       <div {...renderProps.props}>  </div>
                                  </Tooltip>
                              )
                          }
                      }
                    />
                    </div>
                  <hr className="my-5" />        
                  {/* Category Filter */}
                  <div className="mt-5">
                        <h3 className="mb-3">Categories</h3> 
                          <ul className="pl-0">
                          {categories.map(category =>
                                <li
                                style={{
                                    cursor:"pointer",
                                    listStyleType: "none"
                                }}
                                key={category}
                                //below helps to click the categories in list and take that product 
                                onClick={()=>{
                                  setCategory(category);
                                }}
                                >
                                    {category}
                                </li>
                              
                              )}
                              
                          </ul>
                  </div>
                  <hr className="my-5" /> 
                  {/* Ratings Filter */}
                  <div className="mt-5">
                      <h4 className="mb-3">Ratings</h4>
                      <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map(star =>
                                <li
                                style={{
                                    cursor:"pointer",
                                    listStyleType: "none"
                                }}
                                key={star}
                                onClick={()=>{
                                  setRating(star)
                                }}
                                >
                                  <div className="rating-outer">
                                      <div 
                                      className="rating-inner"
                                      style={{
                                          width: `${star * 20}%`
                                      }}
                                      > 

                                      </div>
                                  </div>
                                </li>
                              
                              )}
                              
                          </ul>
                  </div>
                    
              </div>
                
              <div className="col-6 col-md-9">
                <div className="row">
                  {products && products.map(product=>(
                      <Product col={4} key={product._id} product={product} />//<Product/>//giving key={product._id} bz it helps react to indentify that single product and for pagination purpouse too
                    ))}
                </div>
              </div>
              
              
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
