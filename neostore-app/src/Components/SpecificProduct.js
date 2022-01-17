import React, { useEffect, useState } from 'react'
import ReactImageMagnify from 'react-image-magnify'
import { Rating } from '@mui/material';
import { Tabs, Tab, Modal } from 'react-bootstrap'
import ShareIcon from '@mui/icons-material/Share';
import { WhatsappShareButton, WhatsappIcon, FacebookMessengerShareButton, FacebookIcon, EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon } from 'react-share'
import { Box } from '@mui/material';
import { getProducts, populate, updateRating } from '../configFiles/services';
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const url = 'http://localhost:3000/specificproduct'
let proData = []
function SpecificProduct() {
    const [specificProduct, setSpecificProduct] = useState([]);
    const [value, setValue] = React.useState(2);
    const [sum, setSum] = useState()
    const [lgShow, setLgShow] = useState(false);
    const [image, setImage] = useState()
    const[color,setColor]=useState()
    const[data,setData]=useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        populate().then(res => {
            const result = res.data
            const specificData = result.filter(result => result._id == localStorage.getItem("productId"))
            setSpecificProduct(specificData[0])
            console.log(specificData)
            setColor(specificData[0].colorId.colorName)
            setImage(specificData[0].productImage)
            setSum(specificData[0].productRating)
        })
        if(localStorage.getItem("_token")){
            let token=localStorage.getItem("_token")
            let decode=jwtDecode(token)
            setData(decode)
        }
    }, [])
    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        updateRating({ productratingvalue: value, id: localStorage.getItem('productId'), productRating: specificProduct.RatingArray }).then(res => {
            alert(res.data.message)
            navigate('/products')

        })
        setTimeout(() => {
            getProducts().then(res => {
                const result = res.data
                const specificData = result.filter(result => result._id == localStorage.getItem("productId"))
                setSpecificProduct(specificData[0])
                console.log(specificProduct)
            })
        }, 300);



    };

    const addToCart = () => {
        let proData = []
        if (localStorage.getItem("_token") != undefined) {
            let productData = {
                id: specificProduct._id,
                productImage: specificProduct.productImage,
                productCost: specificProduct.productCost,
                productName: specificProduct.productName,
                productStock: specificProduct.productStock,
                productProducer: specificProduct.productProducer,
                quantity: 1,

            }
            if (localStorage.getItem("cartData") != undefined) {
                let cart = JSON.parse(localStorage.getItem("cartData"));
                for (let index = 0; index < cart.length; index++) {
                    if (cart[index].id == specificProduct._id) {
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

        }
        else {
            
            let productData = {
                id: specificProduct._id,
                productImage: specificProduct.productImage,
                productCost: specificProduct.productCost,
                productName: specificProduct.productName,
                productStock: specificProduct.productStock,
                productProducer: specificProduct.productProducer,
                quantity: 1,
            }
            proData.push(productData)
            if (localStorage.getItem("cartData") != undefined) {
                let cart = JSON.parse(localStorage.getItem("cartData"));
                for (let index = 0; index < cart.length; index++) {
                    if (cart[index].id == specificProduct._id) {
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
            else {
                localStorage.setItem("cartData", JSON.stringify(proData))
                dispatch({ type: "addCart" })
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
    const imageSet = (img) => {
        setImage(img)
    }

    return (
        <div>
            <div className="container mt-5 mb-5">

                <div className="container">
                    <div className="row">
                        <div className="col-6 text-left card">
                            <div>
                                <ReactImageMagnify
                                    {...{
                                        smallImage: {
                                            alt: "product",
                                            src: image,
                                            width: 300,
                                            height: 300
                                        },
                                        largeImage: {
                                            src: image,
                                            width: 800,
                                            height: 1000,
                                        },
                                    }}
                                /></div>
                            <div className="d-flex justify-content-around pt-2 pb-2">
                                <div>
                                    {specificProduct.subImages != undefined &&
                                        specificProduct.subImages.map(imgs =>
                                            <img alt="sofa" onClick={() => imageSet(imgs)} src={imgs} style={{ width: "150px", height: "100px", margin: '10px',cursor:"pointer" }}
                                            />
                                        )
                                    }

                                </div>

                            </div>
                        </div>
                        <div className="col-6 card">
                            <h1> {specificProduct.productName}</h1>
                            <div>
                                <Rating
                                    name='read-only'
                                    value={parseInt(specificProduct.productRating)}
                                    precision={0.5}
                                    readOnly
                                />
                            </div>
                            <hr />
                            <h6>Price :-{specificProduct.productCost} </h6>

                                <h6>Color :-<span className="btn px-4 py-3" style={{backgroundColor:color}}></span></h6>
                            
                           
                            <h5 className="mt-3">Share&nbsp; <ShareIcon color="inherit" /></h5>
                            <div>
                                <div>
                                    <FacebookMessengerShareButton url={url} appId="598247578289958" quote={'Welcome to Neostore, Please find the below link to get exciting offer upto 50%'}><FacebookIcon size={32} round={true} /></FacebookMessengerShareButton>    &nbsp;
                                    <EmailShareButton url={url} subject={'Neostore Offeres'} body={'Welcome to Neostore, Please find the below link to get exciting offer upto 50%'}> <EmailIcon size={32} round={true} />&nbsp;</EmailShareButton>
                                    <WhatsappShareButton url={url} quote={'Welcome to Neostore, Please find the below link to get exciting offer upto 50%'} hashtag={'#Neostore'}><WhatsappIcon size={32} round={true} /> </WhatsappShareButton>&nbsp;
                                    <TwitterShareButton url={url} title={'Neostore offers'} hashtag={'#neostore'}>  <TwitterIcon size={32} round={true} />&nbsp;</TwitterShareButton>
                                </div>

                            </div>


                            <div className="row mt-3" >
                                <div className="col-6" ><button className="btn btn-primary" onClick={addToCart} >ADD TO CART</button></div>

                                <div className="col-6">
                                    <button
                                        className="btn btn-warning m-1"

                                        data-toggle="modal"
                                        data-target="#myModal"
                                        onClick={() => setLgShow(true)}
                                    >
                                        GIVE RATING
                                    </button>
                                </div>
                            </div>



                            <div className="modal fade" id="myModal">
                                <div className="modal-dialog modal-sm modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title">Rating</h4>
                                            <button type="button" className="close" data-dismiss="modal">
                                                &times;
                                            </button>
                                        </div>

                                        <div className="modal-body">
                                            <Box component="fieldset" mb={3}>

                                                <Rating />
                                            </Box>
                                        </div>
                                        <div className="row mt-3" >
                                            <div className="col-6" ><button className="btn btn-danger">ADD TO CART</button></div>

                                            <div className="col-6">
                                                <button
                                                    className="btn btn-warning m-1"

                                                    data-toggle="modal"
                                                    data-target="#myModal"
                                                    onClick={() => setLgShow(true)}

                                                >
                                                    GIVE RATING
                                                </button>
                                            </div>
                                        </div>
                                        <Modal
                                            size="lg"
                                            show={lgShow}
                                            onHide={() => setLgShow(false)}
                                            aria-labelledby="example-modal-sizes-title-lg"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title id="example-modal-sizes-title-lg">
                                                    Rating
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>

                                                <Box component="fieldset" mb={3}>
                                                    {/* <Rating name="read-only" readOnly onChange={this.handleRating} /> */}
                                                    <Rating
                                                        name="rating"
                                                        value={value}
                                                        onChange={(event, newValue) => {
                                                            setValue(newValue);
                                                        }}
                                                    />

                                                </Box>
                                                <div className="modal-footer text-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={handleRatingSubmit}
                                                        data-dismiss="modal"
                                                    >
                                                        Give Rating
                                                    </button>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="home" title="Description">
                            <p>{specificProduct.productDescrip}</p>
                        </Tab>
                        <Tab eventKey="profile" title="Feature">
                            <ul>
                                <li>  Product Material : {specificProduct.productMaterial}</li>
                                <li>  Product Dimession :{specificProduct.productDimension}</li>
                                <li> Product Rating : {specificProduct.productRating}</li>
                                <li> Product Producer :{specificProduct.productProducer}</li>
                                <li>  Product stock :{specificProduct.productStock}</li>
                            </ul>
                        </Tab>

                    </Tabs>


                </div>



            </div>
        </div>
    )
}

export default SpecificProduct
