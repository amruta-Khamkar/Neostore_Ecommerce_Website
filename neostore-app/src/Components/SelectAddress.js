import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Container, Form, FormControl, Button, Accordion, Card, Modal} from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import jwt_decode from 'jwt-decode'
import { addAddress, getAddress, deleteAddress, updateAddress, deliveryAdd, orderData } from '../configFiles/services';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sweet from 'sweetalert2'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css";
import { StepLabel, Step, Stepper } from '@mui/material'


const regForPin = RegExp(/^[1-9][0-9]{5}$/);
const regForCity = RegExp(/^[A-Za-z]{3,20}$/);
const regForState = RegExp(/^[A-Za-z]{3,20}$/);
const regForCountry = RegExp(/^[A-Za-z]{3,20}$/);
const regForDate=RegExp(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
function SelectAddress() {
    const [data, setData] = useState({});
    const [modalShow, setModalShow] = React.useState(false);
    const [select, setSelect] = useState()
    const [arr, setArr] = useState()
    const [flag, setFlag] = useState(false)
    const [bflag, setBflag] = useState(false)
    const [address, setAddress] = useState([]);
    const [indexvalue, SetIndex] = useState()
    const [index, setIndex] = useState(0)
    const [edit, setEditData] = useState({
        address: '',
        pincode: '',
        country: '',
        state: '',
        city: ''
    })
    const [Errors, SetError] = useState({
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',

    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const addressInput = useRef(null);
    const PinInput = useRef(null);
    const CityInput = useRef(null);
    const StateInput = useRef(null);
    const CountryInput = useRef(null);
    const creditCard=useRef(null)
    const date=useRef(null)
    const cvv=useRef(null)
    useEffect(() => {
        if (!localStorage.getItem("_token")) {
            sweet.fire({
                title: 'OOPS! you need to login to Select Address',
                icon: "warning",
                timer: 2000
            })
            navigate('/login')
            window.location.reload()
        }
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setData(decode)
            getAddress({ email: decode.emailAdd })

                .then(res => {
                    if (res.data.err === 1) {
                        alert(res.data.message)

                    }
                    else if (res.data.err === 0) {
                        setAddress(res.data.address)
                        console.log(res.data.address)
                    }
                })
        }


    }, [])

    const handler = (event) => {
        const { name, value } = event.target;
        edit.address = addressInput.current.value;
        edit.pincode = PinInput.current.value;
        edit.city = CityInput.current.value;
        edit.state = StateInput.current.value;
        edit.country = CountryInput.current.value;

        setEditData({ ...edit, [name]: value })
        console.log(edit)


        switch (name) {

            case 'pincode':
                Errors.pincode = regForPin.test(value) ? '' : ' Pincode should be 6 digits ';
                break;
            case 'city':
                Errors.city = regForCity.test(value) ? '' : 'City length should be more than 2 letters';
                break;

            case 'state':
                Errors.state = regForState.test(value) ? '' : 'State should not be less thatn 20 letters';
                break;

            case 'country':
                Errors.country = regForCountry.test(value) ? '' : 'Country length should be more than 2 letters';
                break;

        }
        setSelect({ Errors, [name]: value }, () => {
            console.log(Errors)
        })

        setData({ ...data, [name]: value })
        console.log(data)
    }

    const validate = (errors) => {
        let valid = true;
        Object.values(errors).forEach((val) =>
            val.length > 0 && (valid = false));
        return valid;
    }

    const submit = (e) => {
        e.preventDefault();
        setFlag(false)
        setBflag(false)

        if (validate(Errors)) {

            addAddress({ address: data.address, pincode: data.pincode, state: data.state, city: data.city, country: data.country, id: data.id }).then(res => {
                if (res.data.err == 1) {
                    alert(res.data.message)
                }

                setArr(res.data.address)
                console.log(res.data.address)
                getAddress({ email: data.emailAdd })

                    .then(res => {
                        if (res.data.err === 1) {
                            alert(res.data.message)

                        }
                        else if (res.data.err === 0) {
                            setAddress(res.data.address)
                            console.log(res.data.address)
                        }
                    })

            })


        }
    }

    const editDataFunc = (data) => {
        setEditData(data)

    }
    const EditAddress = (e) => {
        e.preventDefault()
        if (addressInput.current.value != '' && PinInput.current.value != '' && CityInput.current.value != '' && StateInput.current.value != ''
            && CountryInput.current.value != '') {
            updateAddress({ address: edit.address, pincode: edit.pincode, city: edit.city, state: edit.state, country: edit.country, address_id: address[indexvalue].address_id, id: data.id }).then(res => {
                console.log(res.data.address)
                setFlag(false)
                setBflag(false)
                getAddress({ email: data.emailAdd })

                    .then(res => {
                        if (res.data.err === 1) {
                            alert(res.data.message)

                        }
                        else if (res.data.err === 0) {
                            setAddress(res.data.address)
                            console.log(res.data.address)
                        }
                    })
            })

        }

    }
    const DeleteData = (index) => {
        address.splice(index, 1)
        console.log(address)
        deleteAddress({ address: address, id: data.id }).then(res => {
            if (res.data.err == 1) {
                alert(res.data.message)
            }
            getAddress({ email: data.emailAdd })

                .then(res => {
                    if (res.data.err === 1) {
                        alert(res.data.message)

                    }
                    else if (res.data.err === 0) {
                        setAddress(res.data.address)
                        console.log(res.data.address)
                    }
                })

        })
    }
    const deliveryAddress = (index) => {
        setModalShow(true)
        deliveryAdd({ id: data.id, addressId: address[index].address_id })
        setIndex(index)
    }

    const placeOrder = (e) => {
        e.preventDefault()
        if(creditCard.current.value.length!=16){
            Toastify({
                text: "Enter 16 digit card Number",
            }).showToast();
        }
        else if(!regForDate.test(date.current.value)){
            Toastify({
                text: "Enter date in mm/yy format",
            }).showToast();
        }
        else if(cvv.current.value.length!=3){
            Toastify({
                text: "cvv should contain 3 digits",
            }).showToast();
        }
        else{
            sweet.fire({
                title: 'Are You Sure, Do you want to Buy This product? ',
                showCancelButton: true,
                confirmButtonText: 'Buy',
            }).then((result) => {
                if (result.isConfirmed) {
                    sweet.fire({title:'THANKYOU , YOUR ORDER HAS BEEN PLACED SUCCESSFULLY!',icon:"success",timer:2000})
                    localStorage.removeItem("_token")
                    console.log(data.cartData)
                    orderData({ id: data.id, orders: JSON.parse(localStorage.getItem("cartData")), total: localStorage.getItem("total"), gst: localStorage.getItem("gst"), mainTotal: localStorage.getItem("mainTotal"), userId: data.id, deliveryAddress: address[index] }).then((res) => {
                        localStorage.setItem("_token", res.data)
                        localStorage.removeItem("cartData")
                        dispatch({ type: "logout" })
                        navigate('/order')
                    })
                }
            })
        }
       
    }
    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>

                    <div class="forms " >
                        <form className='form cardpay'>
                            <h3><i class="material-icons">lock</i> New Payment Method</h3>
                            <h4><i class="material-icons">credit_card</i> Enter Payment Information</h4>
                            <div id="cc">
                                <label className='label'>Card Number <span class="pull-right card-type"></span></label>
                                <input class="form-control input" type="number" required placeholder="1111 2222 3333 4444" ref={creditCard} name="creditcard" />
                            </div>
                            <div class="flexrow">
                                <div id="date">
                                    <label className='label'>Expiration Date</label>
                                    <div class="flexrow flow-left">
                                        <input className='input form-control' style={{ width: "40%" }} required name="date" placeholder='mm/yy'
                                        ref={date} />
                                    </div>
                                </div>
                                <div id="csv">
                                    <label className='label'>CVC</label>
                                    <div class="flexrow flow-right">
                                        <input type="text" class="form-control input" maxlength="3" name="cvc" autocomplete="no"  placeholder="XXX"  pattern="[0-9]{3}" required title="Three letter country code" ref={cvv}/>
                                    </div>
                                </div>
                            </div>
                            <div class="flexrow flow-right buttonrow">
                                <span className='mx-1 fw-bold h3'>Total: Rs.{localStorage.getItem("mainTotal")}</span><button class="confirm button" onClick={placeOrder}>Checkout</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
    return (
        <div>
             <div className="row" style={{ marginTop: '20px' }}>
                        <Stepper activeStep={1} style={{ width: "100%" }}>

                            <Step >
                                <StepLabel>Cart</StepLabel>
                            </Step>
                            <Step >
                                <StepLabel>Delivery Address</StepLabel>
                            </Step>

                        </Stepper>
                    </div>

            <div>
                <div>
                    <Container>
                        <Button className="btn btn-light" onClick={() => { setFlag(true); setEditData({ address: '', pincode: '', country: '', state: '', city: '' }) }} ><HomeIcon />&nbsp;Add Address</Button>
                        <div className="container " style={{ padding: '20px' }}>
                            <div >
                                <div className="text">
                                    <h3> Shipping Address</h3>
                                </div>
                                {flag ? <>
                                    <div className="container card " style={{ padding: '30px' }}>
                                        <Form >
                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontaladdress">
                                                <Form.Label column sm={2}>
                                                    Address
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control as="textarea" placeholder="Enter Address" name='address' defaultValue={edit.address} ref={addressInput} onChange={handler} required />
                                                </Col>
                                            </Form.Group>


                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalpincode">
                                                <Form.Label column sm={2}>
                                                    Pincode
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder=" Enter Pincode" name='pincode' defaultValue={edit.pincode} ref={PinInput} onChange={handler} required />
                                                </Col>
                                            </Form.Group>
                                            {Errors.pincode.length > 0 &&
                                                <span style={{ color: "red" }}>{Errors.pincode}</span>}

                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalcity">
                                                <Form.Label column sm={2}>
                                                    City
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Enter City" name='city' defaultValue={edit.city} ref={CityInput} onChange={handler} required />
                                                </Col>
                                            </Form.Group>
                                            {Errors.city.length > 0 &&
                                                <span style={{ color: "red" }}>{Errors.city}</span>}
                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalstate">
                                                <Form.Label column sm={2}>
                                                    State
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Enter State " defaultValue={edit.state} ref={StateInput} name='state' onChange={handler} required />
                                                </Col>
                                            </Form.Group>
                                            {Errors.state.length > 0 &&
                                                <span style={{ color: "red" }}>{Errors.state}</span>}
                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                                <Form.Label column sm={2}>
                                                    Country
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Enter Country" defaultValue={edit.country} ref={CountryInput} name='country' onChange={handler} required />
                                                </Col>
                                            </Form.Group>
                                            {Errors.country.length > 0 &&
                                                <span style={{ color: "red" }}>{Errors.country}</span>}

                                            {
                                                bflag == false ?


                                                    <div className="buttons" style={{ marginTop: '50px' }}>
                                                        <button onClick={submit} className='btn btn-primary' >Save</button>
                                                    </div> : <div>
                                                        <div className="buttons" style={{ marginTop: '50px' }}>
                                                            <button onClick={EditAddress} className='btn btn-warning' >Update</button>
                                                        </div>
                                                    </div>
                                            }
                                            <br />
                                            <div className="mb-2"><Button variant="contained-light" onClick={() => { setFlag(false); setBflag(false) }} className='btn btn-success' fullwidth>&nbsp;Cancel</Button></div>
                                        </Form>
                                    </div>
                                </> : <div className='card' style={{ padding: '50px' }}>
                                    <div>
                                        <div className="container " >
                                            <div>
                                                {address.map((ele, index) =>
                                                    <Card className='mx-2 my-2' style={{ width: '28rem', height: "20rem", display: "inline-block" }}>
                                                        <Card.Body>
                                                            <Card.Title>{data.firstName + " " + data.lastName}</Card.Title>
                                                            <Card.Text>
                                                                <p> address: {ele.address}</p>
                                                                <p>Pincode: {ele.pincode}</p>
                                                                <p>City: {ele.city}</p>
                                                                <p>State: {ele.state}</p>
                                                                <p>Country: {ele.country}</p>
                                                            </Card.Text>
                                                            <Button onClick={() => { SetIndex(index); setBflag(true); setFlag(true); editDataFunc({ address: ele.address, pincode: ele.pincode, state: ele.state, city: ele.city, country: ele.country }) }} ><EditIcon />&nbsp;Edit</Button>&nbsp;&nbsp;
                                                            <Button className="btn-danger" onClick={() => DeleteData(index)} ><DeleteForeverIcon />&nbsp;Delete</Button>
                                                            <Button className="btn-warning mx-1" onClick={() => deliveryAddress(index)} > <HomeIcon />Deliver on this Address</Button>
                                                            <MyVerticallyCenteredModal
                                                                show={modalShow}
                                                                onHide={() => setModalShow(false)}
                                                            />
                                                        </Card.Body>
                                                    </Card>
                                                )}




                                            </div>



                                        </div>


                                    </div>

                                </div>
                                }

                            </div>

                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default SelectAddress
