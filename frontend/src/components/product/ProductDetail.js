import { Fragment, useEffect,useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createReview, getProduct } from '../../actions/productActions';
import { useParams } from 'react-router-dom'; // for getting id using react method/ hooks
import Loader from '../layouts/Loader';
import { Carousel } from 'react-bootstrap';
import MetaData from '../layouts/MetaData';
import { addCartItem } from '../../actions/cartActions';
import {Modal} from 'react-bootstrap';//for review submit
import {clearReviewSubmitted, clearError, clearProduct} from '../../slices/productSlice';
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";//below and upper to fragement

export default function ProductDetail() {
  const { loading, product={}, isReviewSubmitted,error } = useSelector((state) => state.productState);
  const { user } = useSelector(state => state.authState);//only login user can give review/ click submit button
  const dispatch = useDispatch(); // getting from react redux hooks
  const { id } = useParams(); // in app.js gave Route path="/product/:id" element={<ProductDetail/>} 
  //for add/ sub quantity of products
  const [quantity, setQuantity] = useState(1);
  //incresing quantity
  const increaseQty = () => {
      const count = document.querySelector('.count')
      if(product.stock ===0 ||  count.valueAsNumber >= product.stock) return;
      const qty = count.valueAsNumber + 1;
      setQuantity(qty);
  }
  //decresing product quantity
  const decreaseQty = () => {
      const count = document.querySelector('.count')
      if(count.valueAsNumber === 1 ) return;
      const qty = count.valueAsNumber - 1;
      setQuantity(qty);
  }
  //bootstrap modal:(https://react-bootstrap-v4.netlify.app/components/modal/)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //inside modal-body rating
  const [rating, setRating] = useState(1);//minmun value should be 1
  //for comment creation:
  const [comment, setComment] = useState("");



  // useEffect(() => {
  //   dispatch(getProduct(id)); // using getting that id here
  // }, [id, dispatch]);

  const reviewHandler = () => {
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('productId', id);//useParamas id here
    dispatch(createReview(formData))

}

useEffect(()=>{
  //if review submitted
    if(isReviewSubmitted) {
        handleClose()
        toast('Review Submitted successfully',{
            type: 'success',
            position: "bottom-center",
            onOpen: () => dispatch(clearReviewSubmitted())
        })
        
    }
    if(error)  {
        toast.error(error, {
            position: "bottom-center",
            type: 'error',
            onOpen: ()=> { dispatch(clearError()) }
        })
        return
    }
    //below tells if new update in review by user update the new comment and star rating is below code
    if(!product._id || isReviewSubmitted) {
        dispatch(getProduct(id))
    }
//(after review submitting it gives only the product even we try to go home and click any product it give same product we review submitted so below solution)
    return () => {
        dispatch(clearProduct())
    }
    

},[dispatch,id,isReviewSubmitted, error])

  return (
    // double fragment bz while waiting for init and false to true in redex state (we cant give no data as product.name in h3)
    <Fragment>
      {loading ? <Loader /> : ( // if loading true it should not show loader component
        <Fragment>
          <MetaData title={product.name}/>
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause='hover'>
                {product.images && product.images.map((image,index) =>
                  // carousel class name as item
                  <Carousel.Item key={image._id || index}>
                    <img
                      className='d-block w-100'
                      src={image.image}
                      alt={product.name}
                      height="500"
                      width="500"
                    />
                  </Carousel.Item>
                )}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${product.ratings / 5 * 100}%` }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

              <hr />

              <p id="product_price">${product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
              </div>
              <button
                  type="button"
                  id="cart_btn"
                  disabled={product.stock === 0}
                  onClick={() => {
                    dispatch(addCartItem(product._id, quantity));
                    toast('Cart Item Added!', {
                      type: 'success',
                      position: "bottom-center",
                      onOpen: () => dispatch(clearReviewSubmitted()),
                    });
                  }}
                  className="btn btn-primary d-inline ml-4"
                >
                  Add to Cart
                </button>


              <hr />

              <p>
                Status: <span
                  className={product.stock > 0 ? 'greenColor' : 'redColor'}
                  id="stock_status"
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>

              <hr />

              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>

{/*only login user can give review for that */}
            {user ? 
              <button
                onClick={handleShow}
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
              >
                Submit Your Review
              </button>:
              <div className="alert alert-danger mt-5"> Login to Post Review</div>
              }

              <div className="row mt-2 mb-5">
                <div className="rating w-50">{/*below modal fade (className=''modal fade) take bz it is used in model-body */}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Submit Review</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="modal-body">
                          <ul className="stars" >
                                        {
                                            [1,2,3,4,5].map(star => (
                                                <li 
                                                key={star}// Adding unique key
                                                value={star}
                                                onClick={()=>setRating(star)}//Now clicking will set the rating 
                                                className={`star ${star<=rating?'orange':''}`}//below class name is to change star color into orange as per star review choosen
                                                //below is to change star color into yellow as per star review mouse hover actual code contails e.target i gave currentTarget
                                                onMouseOver={(e) => e.target.classList.add('yellow')}
                                                onMouseOut={(e) => e.target.classList.remove('yellow')}

                                                ><i className="fa fa-star"></i></li>
                                            ))
                                        }
                                       
                                       
                                    </ul>

                          <textarea
                          onChange={(e)=>setComment(e.target.value)}
                            name="review"
                            id="review"
                            className="form-control mt-3"
                          ></textarea>

                          <button disabled={loading} //after submit button loading will come
                           onClick={reviewHandler}
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            Submit
                          </button>
                        </div>
                        </Modal.Body>
                    </Modal>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
       {
                product.reviews && product.reviews.length > 0 ?
                <ProductReview reviews={product.reviews} /> : null
                }
    </Fragment>
  );
}
