import React, { useEffect,useState } from 'react';
import { Carousel, Container,Card,Button } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom';
import { addSocialUser, findSocialUser, getProducts, gets, updateCart } from '../configFiles/services';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { Alert, Rating } from '@mui/material';
import jwtDecode from 'jwt-decode';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

function Dashboard() {
  const[products,setProducts]=useState()
  const[show,setShow]=useState(false)
  const[data,setData]=useState()
  const dispatch = useDispatch()
  const navigate=useNavigate()
  useEffect(() => {
    getProducts().then((res)=>{
      const result=res.data;
      let popular=result.filter(result=>result.productRating ==5);
      console.log(popular)
      setProducts(popular.slice(0,8))
    })
    setTimeout(() => {
      dispatch({ type: "cartLen" })
    }, 100);
    if (localStorage.getItem("_token")) {
      let token = localStorage.getItem('_token');
      let decode = jwt_decode(token);
      console.log(decode)
      setData(decode)
      if (decode.provider == "social") {
        localStorage.removeItem("_token")
        findSocialUser({ email: decode.emailAdd }).then(res => localStorage.setItem("_token", res.data.token))
        dispatch({ type: "cartLen" })
        setTimeout(() => {
          dispatch({ type: "cartLen" })
          if (localStorage.getItem("cartData") && localStorage.getItem("_token")) {
            let cartDetails = JSON.parse(localStorage.getItem("cartData"));
            console.log(cartDetails)
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode.cartData)
            let arr = cartDetails.concat(decode.cartData)
            console.log(arr)
            let jsonObject = arr.map(JSON.stringify);
            console.log(jsonObject);

            let uniqueSet = new Set(jsonObject);
            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
            console.log(uniqueArray)
            dispatch({ type: "oldCart", payload: uniqueArray.length })
            setTimeout(() => {
              dispatch({ type: "cartLen" })
            }, 100);
            dispatch({ type: "cartLen" })
            console.log(uniqueArray);
            updateCart({ id: decode.id, cartData: uniqueArray }).then(res => {
              localStorage.clear()
              localStorage.setItem("_token", res.data)
            })
            dispatch({ type: "cartLen" })
          }
        }, 300);

      }
      else if (localStorage.getItem("cartData") && localStorage.getItem("_token")) {
        dispatch({ type: "cartLen" })
        let cartDetails = JSON.parse(localStorage.getItem("cartData"));
        console.log(cartDetails)
        let token = localStorage.getItem('_token');
        let decode = jwt_decode(token);
        console.log(decode.cartData)
        let arr = cartDetails.concat(decode.cartData)
        console.log(arr)
        let jsonObject = arr.map(JSON.stringify);
        console.log(jsonObject);
  
        let uniqueSet = new Set(jsonObject);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        console.log(uniqueArray)
        setTimeout(() => {
          dispatch({ type: "oldCart", payload: uniqueArray.length })
        }, 200);
  
        console.log(uniqueArray);
        dispatch({ type: "cartLen" })
        updateCart({ id: decode.id, cartData: uniqueArray }).then(res => {
          localStorage.clear()
          localStorage.setItem("_token", res.data)
        })

      }
    }
    
  }, [])
  const addToCart = (pro) => {
let proData=[]
    if (localStorage.getItem("_token") != undefined) {
        let productData = {
            id: pro._id,
            productImage: pro.productImage,
            productCost: pro.productCost,
            productName: pro.productName,
            productStock: pro.productStock,
            productProducer: pro.productProducer,
            quantity: 1,

        }
        proData.push(productData)
        if (localStorage.getItem("cartData") != undefined) {
            let cart = JSON.parse(localStorage.getItem("cartData"));
            for (let index = 0; index < cart.length; index++) {
                if (cart[index].id == pro._id) {
                  Toastify({
                    text: "Product is available in cart",
                    className: "primary",
                }).showToast();
                    navigate('/cart')
                    return;
                }
            }
            console.log("hello")
            cart.push(productData)
          
            Toastify({
              text: "Product is added in the Cart",
              className: "info",
              style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
              }
          }).showToast();
            dispatch({ type: "addCart" })
            localStorage.setItem("cartData", JSON.stringify(cart))

        }
        else{
         let token=localStorage.getItem("_token");
         let decode=jwtDecode(token)
          for (let index = 0; index < decode.cartData.length; index++) {
            if (decode.cartData[index].id == pro._id) {
              Toastify({
                text: "Product is available in cart",
                className: "primary",
            }).showToast();
                navigate('/cart')
                alert("there")
                return;
            }
        }
          decode.cartData.push(productData)
          Toastify({
            text: "Product is added in the Cart",
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
          dispatch({ type: "addCart" })
          localStorage.setItem("cartData", JSON.stringify(decode.cartData))
      }

    }
    else {

      let productData = {
        id: pro._id,
        productImage: pro.productImage,
        productCost: pro.productCost,
        productName: pro.productName,
        productStock: pro.productStock,
        productProducer: pro.productProducer,
        quantity: 1,
    }
    proData.push(productData)
    if (localStorage.getItem("cartData") != undefined) {
        let cart = JSON.parse(localStorage.getItem("cartData"));
    for (let index = 0; index < cart.length; index++) {
        if (cart[index].id == pro._id) {
          Toastify({
            text: "Product is available in cart",
            className: "primary",
        }).showToast();
          navigate('/cart')
            return;
        }
    }

    console.log("hello")
    cart.push(productData)
  
    Toastify({
      text: "Product is added in the Cart",
      className: "info",
      style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
  }).showToast();
    dispatch({ type: "addCart" })
    localStorage.setItem("cartData", JSON.stringify(cart))

}
else{
    localStorage.setItem("cartData",JSON.stringify(proData))
    dispatch({ type: "addCart" })
    setShow(true)
    Toastify({
      text: "Product is added in the Cart",
      className: "info",
      style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
  }).showToast();
}
}
}

//  const orderDetails = (id) => {
//         localStorage.setItem("productId", id);
//         navigate('/specificproduct')
//     }

  return (
    <div>

      <Carousel>
        <Carousel.Item interval={1000} style={{ height: "80vh" }}>
          <img
            className="d-block w-100" style={{ height: "80vh" }}
            src="https://media.istockphoto.com/photos/top-view-of-a-luxurious-living-room-in-a-large-house-by-the-sea-picture-id1284941004?b=1&k=20&m=1284941004&s=170667a&w=0&h=p1fReSMFn2cVt75N1FNz5bqeMFlXCokx7Zd7FuFiZeg="
            alt="First slide"
          />
          <Carousel.Caption classna>
            <h3>Furniture</h3>
            <p>Furniture refers to movable objects intended to support various human activities such as seating, eating, and sleeping</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500} style={{ height: "80vh" }}>
          <img
            className="d-block w-100" style={{ height: "80vh" }}
            src="https://images.unsplash.com/photo-1618377385011-b861fcfb18f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=626&q=80"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Sofas</h3>
            <p>Furniture is also used to hold objects at a convenient height for work, or to store things.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: "80vh" }}>
          <img
            className="d-block w-100" style={{ height: "80vh" }}
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=857&q=80"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Decoration</h3>
            <p>Furniture can be a product of design and is considered a form of decorative art.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container fluid>
      {show==true && <Alert  className="fw-bold" style={{fontSize:"25px"}}>Woahhh ! Product Added in Cart</Alert>}

        <h1 className="text-center"> Our Popular Products</h1>

        {products!=undefined &&
          products.map((pro, index) =>
            <Card  className='mx-3 my-2' style={{ width: "290px", border: '1px solid grey', padding: '10px', display: "inline-block", cursor: "pointer" }}>
            <Card.Img  height="200px" width="200px" src={pro.productImage} />
              <Card.Body>
              <p >{pro.productName}</p>
               <Card.Text>
                 Price: {pro.productCost}
                </Card.Text>
                  <Card.Text>
                <Rating
                  name="read-only"
                 value={(pro.productRating)}
                  readOnly
                  precision={0.5}
               />
              </Card.Text>
              <Button onClick={() => addToCart(pro)} variant="primary">Add to Cart</Button>
                 </Card.Body>
                </Card>
                            )
                        }
      </Container>


    </div>
  )

}

export default Dashboard
