import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import Account from './Account';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { getOrders } from '../configFiles/services';
import jwtDecode from 'jwt-decode';
import jspdf from 'jspdf';
import sweet from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
const paperStyle = { height: '600px', width: 800, margin: '60px auto', paddingTop: '20px', "overflow-y": "auto" }

function Order() {
    const [data, setData] = useState();
    const dispatch = useDispatch();
    const navigate=useNavigate()

    useEffect(() => {
        dispatch({ type: "cartLen" })
        if(!localStorage.getItem("_token")){
            sweet.fire({
                title: 'OOPS! you need to login to see your orders',
                icon: "warning",
                timer: 2000
            })
            navigate('/login')
            window.location.reload()
        }
        getOrders().then((res) => {
            const result = res.data;
            if (localStorage.getItem('_token') !== undefined) {
                let token = localStorage.getItem('_token');
                let decode = jwtDecode(token);
                console.log(decode)
                const orderData = result.filter(result => result.userId == decode.id)
                console.log(orderData)
                setData(orderData)
            }
        })
    }, [])

    return (
        <div>
            <div>
                <div className="col-12">
                    <h1>My Account</h1>
                </div>
                <hr />
                <Container>
                    <Row>
                        <Col sm={4}>
                            <div className="container mt-3" style={{ marginRight: '50px' }}>

                                <div className="row">
                                    <Account />
                                </div>
                            </div>
                        </Col>
                        <Col sm={8} >
                            <Paper elevation={5} style={paperStyle} >
                                <div className="container">
                                    <div >
                                        <div className="text">
                                            <h3>Orders</h3>
                                            {data != undefined &&
                                                data.map((ele, index) =>
                                                    <Card className="mt-3">
                                                        <Card.Header as="h5">TRANSIT order by:OREDNO_{index + 1}</Card.Header>
                                                        <p> &nbsp; &nbsp;placed on <span className='text-danger'>{ele.createdAt}</span>  &nbsp;Total : <span className='text-success'>Rs.{ele.total}</span></p>
                                                        <Container style={{ display: "flex" }}>
                                                            {
                                                                ele.order.map(img =>

                                                                    <Card.Img className="mx-2" style={{ width: "20%", height: "100px" }} variant="top" src={img.productImage} />
                                                                )
                                                            }
                                                        </Container>
                                                        <Card.Body>
                                                        <div className="row m-2" >
                                                        <button  onClick={() => navigate('/invoice', {state:{user:ele,total:ele.total,amount:ele.mainTotal,time:ele.createdAt,index:index,order:ele.order,}} )} className="btn btn-primary">View Invoice and Download The PDF</button>
                                                    </div>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Order
