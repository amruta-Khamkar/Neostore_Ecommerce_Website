import React, { useEffect, useState } from 'react'
import { StepLabel, Step, Stepper, Paper } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import jwt_decode from 'jwt-decode';
import {addCartData, orderData, updateCart } from '../configFiles/services';
import {Button} from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';
import sweet from 'sweetalert2';
const paperStyle = { height: '70vh', width: 600, margin: '30px auto', paddingTop: '20px' }
function Cart() {
    
    const [cart, setCart] = useState({cartData:[]})
    const [total, setTotal] = useState()
    const [gst, setGST] = useState()
    const [mainTotal, SetMainTotal] = useState()
    const[decodes,setDecode]=useState()
    const[show,setShow]=useState()
    const navigate=useNavigate();
    const dispatch=useDispatch()
    useEffect(() => { 
        dispatch({type:"cartLen"})
        if(!localStorage.getItem("_token")){
            if(localStorage.getItem("cartData")!=undefined){
            let cartDetails=JSON.parse(localStorage.getItem('cartData'))
            setCart({cartData:cartDetails})
            let sum=0;
            cartDetails.forEach(ele => {
                console.log(ele.productCost + " "+ ele.quantity)
                sum += ele.productCost*ele.quantity
            })
            console.log(sum)
            setTotal(sum)
            setGST(Math.round(sum/100*5))
            SetMainTotal(sum+Math.round(sum/100*5))
            return
        }
        else{
            localStorage.setItem("cartData",[])
        }
        }
        else if(localStorage.getItem("_token")&& !(localStorage.getItem("cartData"))){
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            localStorage.setItem("cartData",JSON.stringify(decode.cartData))
            setCart({cartData:JSON.parse(localStorage.getItem('cartData'))})
            let sum = 0;
            let cartDetails=JSON.parse(localStorage.getItem('cartData'))
            cartDetails.forEach(ele => {
                console.log(ele.productCost + " "+ ele.quantity)
                sum += ele.productCost*ele.quantity
            })
            console.log(sum)
            setTotal(sum)
            setGST(Math.round(sum/100*5))
            SetMainTotal(sum+Math.round(sum/100*5))
           
           setDecode(decode)
        }
        else if((localStorage.getItem("_token") && localStorage.getItem('cartData'))){
            setCart({cartData:JSON.parse(localStorage.getItem('cartData'))})
            let sum = 0;
            let cartDetails=JSON.parse(localStorage.getItem('cartData'))
            cartDetails.forEach(ele => {
                console.log(ele.productCost + " "+ ele.quantity)
                sum += ele.productCost*ele.quantity
            })
            console.log(sum)
            setTotal(sum)
            setGST(Math.round(sum/100*5))
            SetMainTotal(sum+Math.round(sum/100*5))
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
           setDecode(decode)
            updateCart({id:decode.id,cartData:cartDetails}).then(res=>{
                localStorage.removeItem("_token")
                localStorage.setItem("_token",res.data)
            }
            )
        }
     
       
    }, []) 
    const additem = (id) => {
        const localCartData = JSON.parse(localStorage.getItem("cartData"))
        const index = localCartData.findIndex(res => { return res.id === id })
        if (localCartData[index].quantity > 0 && localCartData[index].quantity <= 9) {
            localCartData[index].quantity = localCartData[index].quantity + 1;
            localStorage.setItem('cartData', JSON.stringify(localCartData));
            let cartDetails=JSON.parse(localStorage.getItem('cartData'))
            let sum = 0;
            cartDetails.forEach(ele => {
                console.log(ele.productCost + " "+ ele.quantity)
                sum += ele.productCost*ele.quantity
            })
            console.log(sum)
            setTotal(sum)
            setCart({cartData:cartDetails})
            setGST(Math.round(sum/100*5))
            SetMainTotal(sum+Math.round(sum/100*5)) 
        }
    }
    const deleteitem = (id) => {
        const localCartData =JSON.parse(localStorage.getItem("cartData"))
        const index = localCartData.findIndex(res => { return res.id === id })
        if (localCartData[index].quantity > 1 && localCartData[index].quantity <= 10) {
            localCartData[index].quantity = localCartData[index].quantity - 1;
            localStorage.setItem('cartData', JSON.stringify(localCartData));
            let sum = 0;
            let cartDetails=JSON.parse(localStorage.getItem('cartData'))
            cartDetails.forEach(ele => {
                console.log(ele.productCost + " "+ ele.quantity)
                sum += ele.productCost*ele.quantity
            })
            setCart({cartData:cartDetails})
            console.log(sum)
            setTotal(sum)
            setGST(Math.round(sum/100*5))
            SetMainTotal(sum+Math.round(sum/100*5)) 

        }
    }

    const deleteData = (index) => {
       
     let state=JSON.parse(localStorage.getItem("cartData"))
        state.splice(index, 1)
        setShow(true)
        setTimeout(() => {
            setShow(false)
        }, 1000);
        dispatch({type:"delCart"})
        setCart({cartData:state})
        localStorage.setItem('cartData', JSON.stringify(state))
        let cartDetails=JSON.parse(localStorage.getItem('cartData'))
        let sum=0;
        cartDetails.forEach(ele => {
            console.log(ele.productCost + " "+ ele.quantity)
            sum += ele.productCost*ele.quantity
        })
        console.log(sum)
        setTotal(sum)
        setGST(Math.round(sum/100*5))
        SetMainTotal(sum+Math.round(sum/100*5)) 
        if(localStorage.getItem("_token")){
        updateCart({id:decodes.id,cartData:state}).then(res=>{
            localStorage.removeItem("_token")
            localStorage.setItem("_token",res.data)
        })
    }
    }

    const buyButton=()=>{
        if(localStorage.getItem("_token")!=undefined){
           if(JSON.parse(localStorage.getItem("cartData")).length<1){
            sweet.fire({
                title: 'OOPS! The cart is empty Add some products to Continue',
                icon:"warning",
                timer:1000
              })
           }
           else {
            localStorage.setItem("total",total)
            localStorage.setItem("gst",gst)
            localStorage.setItem("mainTotal",mainTotal)
            navigate('/selectAddress')
           }
           
        }
        else{
            sweet.fire({
                title: 'OOPS! Login in required',
                icon:"warning",
                timer:1000
              })
            navigate('/login')
        }
    }
    return (

        <div>
           {show==true && <Alert severity="error" className="fw-bold" style={{fontSize:"25px"}}>Product Deleted ! Dont worry you can add again in products:)</Alert>}
            <div className="container-fluid">
                <div className="container-fluid" >
                    <div className="row" style={{ marginTop: '20px' }}>
                        <Stepper activeStep={0} style={{ width: "100%" }}>

                            <Step >
                                <StepLabel>Cart</StepLabel>
                            </Step>
                            <Step >
                                <StepLabel>Delivery Address</StepLabel>
                            </Step>

                        </Stepper>
                    </div>

                    <div className="row" style={{ marginTop: '30px' }}>
                        <div className="col-8 ">
                            { cart.cartData.length>0 ?cart.cartData.map((el, index) =>
                            <Paper elevation={10}>
                                <div className="mt-3 mb-2" key={el.id} > 
                                     <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="row card-body">
                                                    <div className="col-2">Product
                                                        <br /><br />
                                                        <img src={el.productImage} alt='not found' style={{marginTop:"-21px"}}width="100%" />
                                                    </div>
                                                    <div className="col-3">
                                                        <span style={{ fontSize: "smaller" }}>{el.productName}&nbsp;

                                                            by {el.productProducer} <br />Status: {el.productStock > 0 ? <span style={{ color: "green" }}>In stock</span> : <span style={{ color: "red" }}>Not in stock</span>} </span>
                                                    </div>
                                                    <div className="col-3">Quantity
                                                        <br /><br />
                                                        <span className='border p-2 bg-danger rounded-circle ' style={{boxShadow:"2px 2px 1px black",cursor:"pointer"}}><RemoveIcon onClick={() => deleteitem(el.id)}/></span>  {el.quantity}  
                                                        <span className='border p-2 bg-danger rounded-circle' style={{boxShadow:"2px 2px 1px black",cursor:"pointer"}}><AddIcon
                                                            onClick={() => additem(el.id)} /></span>
                                                    </div>
                                                    <div className="col-2">Price
                                                        <br /><br />    {el.productCost}

                                                    </div>
                                                    <div className="col-2">Total
                                                        <br /><br />
                                                        <span >{el.productCost * el.quantity}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ float: "right" }}> <DeleteForeverIcon
                                                            onClick={() => deleteData(index)} style={{fontSize:"41px",marginTop:"-6px",cursor:"pointer"}}color="error" /></span></span>
                                                    </div>
                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </Paper>
                                ) 
                                :

                                <div className="row mt-5 ">
                                    <div className="text-center mb-4" style={{ marginLeft: "27px" }}>
                                        <img src='https://cdn.pixabay.com/photo/2013/07/12/14/53/cart-148964_960_720.png' alt="img" height="25%"/>
                                        <div className="text-center mt-4">
                                            <h3>YOUR CART IS CURRENTLY EMPTY</h3>
                                            <p>Before proceed to checkout you must add some products to your shopping cart.
                                                <br />You will find lots of intresting products on our products page</p>
                                            <Link to="/products" className="btn btn-primary">Return to product page</Link>
                                        </div>
                                    </div>
                                </div>
                        } 
                        
                        </div>
                        <div className="col-4 mb-3 card">
                            <div className="container">
                                <div><h2>Review Order</h2></div>
                                <br /><br />
                                <div className="row">
                                    <div className="col-6 text-left">
                                        <p>Subtotal</p>
                                    </div>
                                    <div className="col-6 text-right">
                                        <p>{total}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className="row">
                                    <div className="col-6 text-left">
                                        <p>GST(5%)</p>
                                    </div>
                                    <div className="col-6 text-right">
                                        <p>{gst}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className="row">
                                    <div className="col-6 text-left">
                                        <p>Order Total</p>
                                    </div>
                                    <div className="col-6 text-right">
                                        <p>{mainTotal}</p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                            <Button className="btn btn-primary" style={{ width: "100%" }} onClick={buyButton} >Proceed to Buy</Button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Cart
