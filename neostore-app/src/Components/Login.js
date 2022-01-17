import React, { useRef, useState, useEffect } from 'react'
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import EmailIcon from '@mui/icons-material/Email';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import { addSocialUser, checkSocial, findSocialUser, getUser } from '../configFiles/services';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialButton from './SocialButton';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert } from '@mui/material';
import sweet from 'sweetalert2'

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);

function Login() {
    const [loginData, setLoginData] = useState({
        emailAdd:'',
        password:''
    })
    const [eye, seteye] = useState(true);
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const[show,setShow]=useState(false)
    const [state, setState] = useState({
        flag: 0
    })
    const dispatch = useDispatch()
    useEffect(() => {
        if (localStorage.getItem("cartData")) {
            dispatch({ type: "cartLen" })
        }
    }, [])
    const history = useLocation();
    const Eye = () => {
        if (password == "password") {
            setpassword("text");
            seteye(false);
            settype(true);
        }
        else {
            setpassword("password");
            seteye(true);
            settype(false);
        }
    }
    const navigate = useNavigate()
    const handleLoginData = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value })
        console.log(loginData)
    }
    const loggedIn = () => {
        if(loginData.emailAdd==''|| loginData.password==''){
            setShow(true)
            setTimeout(() => {
                setShow(false)
            }, 3000);
        }
        else{
        checkSocial({ email: loginData.emailAdd ,password:loginData.password}).then((res) => {
             if (res.data.err == 0) {
                getUser({ emailAdd: loginData.emailAdd, password: loginData.password }).then((res) => {
                    if (res.data.err == 0) {
                        sweet.fire({
                            title:  res.data.message,
                            icon:"success",
                            timer:2000
                          })
                          localStorage.setItem("_token", res.data.token);
                          dispatch({type:"login"})
                        navigate('/')
                        dispatch({ type: "cartLen" })

                    } else if (res.data.err == 1) {
                        sweet.fire({
                            title:  res.data.message,
                            icon:"error",
                            timer:1000
                          })

                    }
                })
            }
            else if(res.data.err==1){
                sweet.fire({
                    title:  res.data.message,
                    icon:"warning",
                    timer:1000
                  })
            }
        })
    }

    }

    const handleSocialLogin = (user) => {
        console.log(user);
                addSocialUser({ firstName: user.profile.firstName, lastName: user.profile.lastName, emailAdd: user.profile.email, provider: "social",photo:user.profile.profilePicURL}).then((res) => {
                    if (res.data.err == 0) {
                        sweet.fire({
                            title:  res.data.message,
                            icon:"success",
                            timer:2000
                          })
                        localStorage.setItem("_token", res.data.token);
                        dispatch({type:"login"})
                        console.log(res.data.token)
                    navigate('/')
                        setState({
                            flag: 1
                     })
            }
        })
    };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
        window.location.reload()
    };

    return (
        <div>
            {show==true && <Alert severity="error" className="fw-bold" style={{fontSize:"25px"}}>All Fields are Required!!!</Alert>}
            <Row style={{ width: "100%" }}>
                <Col>
                    <Card style={{ width: '33rem', height: "90%" }} className="mt-3 mx-5 px-4" >
                        <Card.Body>
                            <SocialButton
                                className="mb-5 mt-5 me-5 py-3" style={{ width: "95%", backgroundColor: "#3b5998" }}
                                provider="facebook"
                                appId="839088120121430"
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}

                            > <FacebookIcon style={{ fontSize: "45px" }} /> Login With FaceBook</SocialButton>

                            <SocialButton
                                className="mt-5 px-5 py-3 bg-danger" style={{ width: "95%" }}
                                provider="google"
                                appId="941644477844-r3f9mn9in6ihn735j15jd7k2m9h8q1kf.apps.googleusercontent.com"
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}

                            > <GoogleIcon style={{ fontSize: "45px" }} />Login With Google</SocialButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col style={{ width: "50%" }}>
                    <FormControl sx={{ border: "2px solid rgb(223, 223, 223)", width: "90%" }} className="p-3 my-3 py-5">
                        <h1>Login To NeoStore</h1>
                        <TextField
                            style={{ width: "100%", border: "1px solid rgb(223, 223, 223)", outline: "none" }} className="my-4"
                            id="outlined-basic" variant="outlined" placeholder='Email Address' name="emailAdd" onChange={handleLoginData} required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <TextField
                                style={{ width: "100%", border: "1px solid rgb(223, 223, 223)", outline: "none" }} className="my-4" id="outlined-basic" variant="outlined" placeholder='Password' name="password" type={password} onChange={handleLoginData} required>
                            </TextField>
                            <div style={{ position: "absolute", right: "37px", bottom: "140px", fontSize: "21px", cursor: "pointer", fontWeight: "bold" }}>
                                <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </div>
                        </Form.Group>
                        <Button className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} onClick={loggedIn}>Login</Button>
                    </FormControl>
                    <Link to="/register" style={{ marginLeft: "10px", textDecoration: "none", color: "black" }}>Register Now</Link>
                    <Link to="/forgotpassword" style={{ marginLeft: "10px", textDecoration: "none", color: "black" }}>Forgot password?</Link>
                </Col>
            </Row>
            {
                state.flag == 1 && <Navigate to="/dashboard" />
            }
        </div>
    )
}

export default Login
