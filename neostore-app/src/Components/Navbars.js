import React, { useState, useEffect } from 'react'
import { Navbar, Form, Container, Button, Nav, FormControl, NavDropdown, Dropdown } from 'react-bootstrap';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { BrowserRouter, Link, Navigate, useNavigate } from 'react-router-dom';
import { addCartData } from '../configFiles/services';
import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';


function Navbars() {
  const len = useSelector((state) => state.cartLength)
  const loginFlag = useSelector((state) => state.loginReducer)
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const logOut = () => {
    if (localStorage.getItem('_token') !== undefined) {
      let token = localStorage.getItem('_token');
      let decode = jwt_decode(token);
      console.log(decode)
      if (localStorage.getItem("cartData")) {
        addCartData({ id: decode.id, cartData: JSON.parse(localStorage.getItem("cartData")) })
      }
      else {
        addCartData({ id: decode.id, cartData: decode.cartData })
      }
    }
  localStorage.clear()
    dispatch({ type: "logout" })
    dispatch({type:"login"})
    navigate('/login')
  }
  return (
    <div>
      <Navbar bg="black" expand="lg" >
        <Container fluid>
          <Navbar.Brand href="#" className='me-5'><span className='text-white h2' >Neo</span><span className='text-danger h2'>STORE</span></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link className='text-white mx-5 px-3'> <Link className="decorateCart text-white" to="/">Home</Link></Nav.Link>
              <Nav.Link className='text-white mx-5 px-3'> <Link className="decorateCart text-white" to="/products">Products</Link></Nav.Link>
              <Nav.Link className='text-white mx-5 px-3' ><Link className="decorateCart text-white" to="/order">Orders</Link> </Nav.Link>
            </Nav>
            <Form className="d-flex"  style={{position:"relative",left:"-7%"}}>
            
              <Button className='mx-4 bg-white text-black'> <Link to="/cart" className='decorateCart'> <ShoppingCartIcon style={{ fontSize: "31px" }} /><span className='len'>{len}</span></Link> </Button>

              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {<AssignmentIndIcon style={{fontSize:"31px"}}/>}
                </Dropdown.Toggle>

                {
                  loginFlag?
                    <Dropdown.Menu>
                      <Dropdown.Item> <Link className='decorateCart' to="/profile">profile</Link></Dropdown.Item>
                      <Dropdown.Item onClick={logOut} ><Link className='decorateCart' to="/login"> Log Out</Link></Dropdown.Item>
                    </Dropdown.Menu>

                    :
                    <Dropdown.Menu>
                      <Dropdown.Item  ><Link className='decorateCart' to="/register">Register</Link></Dropdown.Item>
                      <Dropdown.Item ><Link className='decorateCart' to="/login">Log In</Link></Dropdown.Item>
                    </Dropdown.Menu>

                }
              </Dropdown>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Navbars
