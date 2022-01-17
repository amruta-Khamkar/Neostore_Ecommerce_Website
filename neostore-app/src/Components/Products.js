import React, { useState, useEffect, useRef } from 'react'
import { colorFilter, filterColor, filterData, getProducts, updateCart } from '../configFiles/services';
import { Card, Button, Row, Col, Container, Accordion ,FormControl} from 'react-bootstrap';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom'
import { display } from '@mui/system';
import jwt_decode from 'jwt-decode'
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import usePagination from './usePagination';
import { Rating } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css";
import SearchIcon from '@mui/icons-material/Search';

function Products() {
    const [postsPerPage] = useState(6);
    let [page, setPage] = useState(1);
    let [temp, setTemp] = useState(1);
    const PER_PAGE = 3;
    const [offset, setOffset] = useState(1);
    const [show, setShow] = useState(false)
    const [flag, setFlag] = useState(0);
    const [posts, setAllPosts] = useState([]);
    const [pageCount, setPageCount] = useState(0)
    const [products, setProducts] = useState([]);
    const [data, setData] = useState();
    const [cart, setCart] = useState({ cartData: [] })
    const [decodes, setDeocde] = useState()
    const navigate = useNavigate();
    const searchInput=useRef(null)
    useEffect(() => {
        getProducts().then(res => {
            setProducts(res.data)
        })
    }, [])
    const count = Math.ceil(products.length / postsPerPage);
    const temp_count = Math.ceil(temp.length / postsPerPage);
    const _DATA = usePagination(products, postsPerPage);
    const _TEMPDATA = usePagination(temp, postsPerPage);
    const handleChange = (e, p) => {
        setPage(p);
        flag ? _TEMPDATA.jump(p) : _DATA.jump(p);

    };
    const dispatch = useDispatch()
    useEffect(() => {
        if (localStorage.getItem("_token") != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode.cartData)
            setDeocde(decode.cartData)
            setCart({ cartData: decode.cartData })
            if (!localStorage.getItem("cartData")) {
                localStorage.setItem("cartData", JSON.stringify(decode.cartData))
            }
        }
    }, [])
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setOffset(selectedPage + 1)
    };
    const allData = () => {
        getProducts().then(res => setProducts(res.data))
        setData(null)
    }
    const showSofa = () => {
        filterData({ category: "Sofa" }).then((res) => {
            setProducts(res.data)
            setData(res.data)
        })
    }
    const bedData = () => {
        filterData({ category: "Bed" }).then((res) => {
            setProducts(res.data)
            setData(res.data)
        })
    }
    const chairData = () => {
        filterData({ category: "Chair" }).then((res) => {
            setProducts(res.data)
            setData(res.data)
        })
    }
    const wadData = () => {
        filterData({ category: "Wadrobe" }).then((res) => {
            setProducts(res.data)
            setData(res.data)
        })
    }
    const diningData = () => {
        filterData({ category: "Dining set" }).then((res) => {
            setProducts(res.data)
            setData(res.data)
        })
    }
    const blackData = () => {
        if(data!=null){
            filterColor({ colour: "Black", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
        }
        else{
            colorFilter({colour:"Black"}).then(res=>setProducts(res.data))
        }
    }
    const blueData = () => {
        if(data!=null){
        filterColor({ colour: "Blue", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
        }
        else{
            colorFilter({colour:"Blue"}).then(res=>setProducts(res.data))
        }
    }
    const brownData = () => {
        if(data!=null){
            filterColor({ colour: "Brown", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"Brown"}).then(res=>setProducts(res.data))
            }
    }
    const beigeData = () => {
        if(data!=null){
            filterColor({ colour: "Beige", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"Beige"}).then(res=>setProducts(res.data))
            }
    }
    const pinkData = () => {
        if(data!=null){
            filterColor({ colour: "Pink", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"Pink"}).then(res=>setProducts(res.data))
            }
    }
    const purpleData = () => {
        if(data!=null){
            filterColor({ colour: "Purple", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"Purple"}).then(res=>setProducts(res.data))
            }
    }
    const whiteData = () => {
        if(data!=null){
            filterColor({ colour: "White", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"White"}).then(res=>setProducts(res.data))
            }
    }
    const greyData = () => {
        if(data!=null){
            filterColor({ colour: "Grey", category: data[0].categoryId.categoryName }).then(res => setProducts(res.data))
            }
            else{
                colorFilter({colour:"Grey"}).then(res=>setProducts(res.data))
            }
    }
    const orderDetails = (id) => {
        localStorage.setItem("productId", id);
        navigate('/specificproduct')
    }

    const addToCart = (pro) => {
        let proData = []
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
                console.log("hello in if")
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
            else {
                console.log("hello in else")
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
    const ascendingPrice = () => {
        products.sort((a, b) => parseFloat(a.productCost) - parseFloat(b.productCost));
        console.log(products)
        const slice = products.slice(offset - 1, offset - 1 + postsPerPage)
        setAllPosts(slice);
    }
    const descendingPrice = () => {
        products.sort((a, b) => parseFloat(b.productCost) - parseFloat(a.productCost));
        const slice = products.slice(offset - 1, offset - 1 + postsPerPage)
        setAllPosts(slice);
    }
    const ratingWise = () => {
        products.sort((a, b) => parseFloat(b.productRating) - parseFloat(a.productRating));
        const slice = products.slice(offset - 1, offset - 1 + postsPerPage)
        setAllPosts(slice);
    }
    const searchProduct = () => {
        let arr = [];
        getProducts()
            .then(res => {
                arr = res.data;
                console.log(arr)
                let selectedproduct = arr.filter((value) => {
                    if (searchInput.current.value === "") {
                        return value
                    }
                    else if (value.productName.toLowerCase().includes(searchInput.current.value.toLowerCase())) {
                        return value
                    }
                })
                setProducts(selectedproduct)
            })
    }
    return (
        <>
            {show == true && <Alert className="fw-bold" style={{ fontSize: "25px" }}>Woahhh ! Product Added in Cart</Alert>}
            <Row style={{ width: "100%" }}>
                <Col sm={3} >

                    <Accordion defaultActiveKey="0" className="mt-3" >
                        <Accordion.Item eventKey="0">
                            <Accordion.Header onClick={allData}>All Products</Accordion.Header>
                           
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Categories</Accordion.Header>
                            <Accordion.Body className="pointer" onClick={showSofa}>Sofa</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={bedData}>Bed</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={chairData}>Chair</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={wadData}>Wadrobe</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={diningData}>Dining set</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Color</Accordion.Header>
                            <Accordion.Body className="pointer" onClick={blackData}>Black</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={blueData}>Blue</Accordion.Body>
                            <Accordion.Body  className="pointer" onClick={brownData}>Brown</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={purpleData}>Purple</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={whiteData}>White</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={beigeData}>Beige</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={greyData}>Grey</Accordion.Body>
                            <Accordion.Body className="pointer" onClick={pinkData}>Pink</Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col>  
                <FormControl
                type="search"
                placeholder="Search"
                aria-label="Search"
                className='mt-2'
                ref={searchInput} onChange={searchProduct}
                style={{ marginLeft: "49%", width: "45%",border:"5px solid grey"}}
              />
                    <Container >
                        <div className="mt-3" style={{ marginLeft: "75%" }}>Sort by
                            <Button variant="light" style={{ width: '50px' }} onClick={ratingWise}><StarIcon style={{ marginLeft: '5px' }} /></Button>
                            <Button variant="light" style={{ width: '50px' }} onClick={ascendingPrice}><ArrowUpwardIcon style={{ marginLeft: '5px' }} /></Button>
                            <Button variant="light" style={{ width: '50px' }} onClick={descendingPrice}><ArrowDownwardIcon style={{ marginLeft: '5px' }} /></Button>
                        </div>
                        {
                            _DATA.currentData().map((pro, index) =>
                                <Card className='mx-2 my-2 products' style={{ width: "290px", border: '1px solid grey', padding: '10px', display: "inline-block", cursor: "pointer" }}>
                                    <LazyLoadImage effect='blur' onClick={() => orderDetails(pro._id)} height="200px" width="265px" src={pro.productImage} />
                                    <Card.Body>
                                        <p onClick={() => orderDetails(pro._id)}>{pro.productName}</p>
                                        <Card.Text>
                                            Price: {pro.productCost}
                                        </Card.Text>
                                        <Card.Text>
                                            <Rating
                                                name="read-only"
                                                value={(pro.productRating)}
                                                precision={0.5}
                                                readOnly
                                            />
                                        </Card.Text>
                                        <Button onClick={() => addToCart(pro)} variant="primary">Add to Cart</Button>
                                    </Card.Body>
                                </Card>
                            )
                        }
                        <Pagination
                            className='align-self-center'
                            // style={{margin:"auto"}}
                            count={flag ? temp_count : count}
                            size="large"
                            page={page}
                            // variant="outlined"
                            // shape="rounded"
                            onChange={handleChange}
                            renderItem={(item) => (
                                <PaginationItem
                                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                />
                            )}
                        />


                    </Container>

                </Col>
            </Row>

        </>
    )
}

export default Products;
