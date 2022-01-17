import React, { useState, useEffect, useRef } from 'react'
import Footer from './Footer'
import Paper from '@mui/material/Paper';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import sweet from 'sweetalert2'
import jwt_decode from 'jwt-decode'
import Account from './Account';
import { changePass, updatePassword } from '../configFiles/services';
import { useDispatch } from 'react-redux';
import { Alert } from '@mui/material';
const paperStyle = { height: '70vh', width: 600, margin: '30px auto', paddingTop: '20px' }
const regForPass = RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/);
function ChangePassword() {

    const [eye, seteye] = useState(true);
    const [newEye, setNewEye] = useState(true);
    const [confirmEye, setConfirmEye] = useState(true);
    const [password, setpassword] = useState("password");
    const [newPass, setNewPass] = useState("password");
    const [confirmPass, setConfirmPass] = useState("password");
    const [flag, setFlag] = useState(false)
    const [data, setData] = useState();
    const [dataPass, setDataPass] = useState({
        oldPass:'',
        newPass:'',
        confirmPass:''
    });
    const[show,setShow]=useState(false)
    const[error,setError]=useState({
        oldPass:'',
        newPass:'',
        confirmPass:''
    })
    const navigate = useNavigate()
    const [user, setUser] = useState([])
    const [values, setValues] = useState({
        password: '',
        cpassword: '',
    })

    const pass = useRef(null);
    const confirmPassword = useRef(null);
    const dispatch=useDispatch()
    useEffect(() => {
        if(!localStorage.getItem("_token")){
            navigate('/login')
            window.location.reload()
        }
        dispatch({type:"cartLen"})
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setData(decode)
        }
    }, [])

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('userData'));
        setUser(user)
    }, [])
  
    const changeIt = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'oldPass':
                console.log(value+""+data.password)
                error.oldPass =!bcrypt.compareSync(value, data.password) ? 'old password should match' : '';
                break;
            case 'newPass':
                error.newPass = regForPass.test(value) ? '' : 'Password must be between 6 to 16 characters and must contain one number and one special character';
                break;
            case 'confirmPass':
                error.confirmPass =dataPass.newPass != value? 'password and confirm password should match' : '';
                break;
        }
        
        
        setDataPass({ ...dataPass, [name]: value })
        console.log(dataPass)  
        
    }
    const Eye = () => {
        if (password == "password") {
            setpassword("text");
            seteye(false);
        }
        else {
            setpassword("password");
            seteye(true);
        }
    }
    const newEyes = () => {
        if (newPass == "password") {
            setNewPass("text");
            setNewEye(false);
        }
        else {
            setNewPass("password");
            setNewEye(true);
        }
    }
    const confirmEyes = () => {
        if (confirmPass == "password") {
            setConfirmPass("text");
            setConfirmEye(false);
        }
        else {
            setConfirmPass("password");
            setConfirmEye(true);
        }
    }
    const submitPassword = (e) => {
        if(data.password==undefined){
            sweet.fire({
                title:  'you do not have old password',
                icon:"warning",
                timer:2000
              })
        }
        else if(dataPass.oldPass==''||dataPass.newPass==''||dataPass.confirmPass==''){
            setShow(true)
            setTimeout(() => {
                setShow(false)
            }, 3000);
        }
         
        else if (bcrypt.compareSync(dataPass.oldPass, data.password) && error.oldPass==''&& error.newPass==''&& error.confirmPass=='') {
            sweet.fire({
                title:  `Your Password has been changed please login now`,
                icon:"success",
                timer:3000
              })
             
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(dataPass.newPass, salt);
            console.log(JSON.parse(localStorage.getItem("cartData")))
            changePass({newPass:hash,id:data.id,cartData:JSON.parse(localStorage.getItem("cartData"))})
            localStorage.clear()
            navigate('/login')
            dispatch({type:"logout"})
        }
    }

    return (

        <div>
            <div className="col-12">
                <h1>My Account</h1>

            </div>
            <hr />

            <Container>
            {show==true && <Alert severity="error" className="fw-bold" style={{fontSize:"25px"}}>All Fields are Required!!!</Alert>}
                <Row>
                    <Col sm={6}>


                        <div className="container m-1" >

                            <div className="row">
                                <Account />
                            </div>
                        </div>


                    </Col>


                    <Col sm={6} >
                        <Paper elevation={5} style={paperStyle} >
                            <div className="container">
                                <div >
                                    <div className="text">
                                        <h3>Change Password</h3>

                                    </div>
                                    <form  >

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Control type={password} placeholder=" Old Password" onChange={changeIt} name="oldPass" required />
                                            <div className='placeIconEye' style={{cursor:"pointer"}}>
                                                <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </div>
                                            <p className='text-danger'>{error.oldPass}</p>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Control type={newPass} placeholder="New Password" onChange={changeIt} name="newPass" required />
                                            <div className='placeIconEye' style={{cursor:"pointer"}}>
                                                <i onClick={newEyes} className={`fa ${newEye ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </div>
                                            <p className='text-danger'>{error.newPass}</p>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Control type={confirmPass} placeholder="Confirm Password" onChange={changeIt} name="confirmPass" required />
                                            <div className='placeIconEye' style={{cursor:"pointer"}}>
                                                <i onClick={confirmEyes} className={`fa ${confirmEye ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </div>
                                            <p className='text-danger'>{error.confirmPass}</p>
                                        </Form.Group>

                                        <Button className="text-black" style={{ width: "35%", backgroundColor: "grey", border: "none" }} onClick={submitPassword}>Change Password</Button>


                                    </form>
                                </div>
                            </div>
                        </Paper>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default ChangePassword
