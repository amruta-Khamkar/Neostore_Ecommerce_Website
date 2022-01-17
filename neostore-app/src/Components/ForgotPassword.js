import React, { useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Form, Container, Button } from 'react-bootstrap';
import { getAll, otpSend, updatePassword } from '../configFiles/services';
import bcrypt from 'bcryptjs';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import sweet from 'sweetalert2'

const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForUName = RegExp(/^[A-Za-z]{2,12}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
const RegForMobile = RegExp('^((\\+91-?)|0)?[0-9]{6}$')
function ForgotPassword() {

    const [flag, setFlag] = useState(0);
    const [eye, seteye] = useState(true);
    const [eyes, seteyes] = useState(true);
    const [password, setpassword] = useState("password");
    const [passwords, setpasswords] = useState("password");
    const [otp, setOtp] = useState(0);
    const [show, setShow] = useState(false)
    const [shows, setShows] = useState(false)
    const [data, setData] = useState({
        emailAdd: '',
        code: '',
        pass: '',
        cPass: ''
    })
    const [errors, setErrors] = useState({
        emailAdd: '',
        code: '',
        pass: '',
        cPass: ''

    })
    const navigate = useNavigate()
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
    const Eyes = () => {
        if (passwords == "password") {
            setpasswords("text");
            seteyes(false);
        }
        else {
            setpasswords("password");
            seteyes(true);
        }
    }
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "emailAdd":
                errors.emailAdd = regForEmail.test(value) ? '' : 'Email is invalid';
            case 'code':
                errors.code = RegForMobile.test(value) ? '' : 'OTP should be of 6 digits';
                break;
            case 'pass':
                errors.pass = regForPass.test(value) ? '' : 'Password must be between 6 to 16 characters and must contain one number and one special character';
                break;
            case 'cPass':
                errors.cPass = data.pass == value ? '' : 'password and confirm password should match';
                break;

        }

        setData({ ...data, [name]: value })
        console.log(data)
    }
    const sendOtp = () => {
        if (data.emailAdd == '') {
            setShows(true)
            setTimeout(() => {
                setShows(false)
            }, 3000);
        }
        else if (errors.emailAdd == '') {
            const otp = Math.floor(100000 + Math.random() * 900000)
            otpSend({ otp: otp, email: data.emailAdd }).then(res => {
                console.log(res.data)
                if (res.data.err == 1) {
                    alert(res.data.message)
                }
                else {
                    setFlag(1)
                    setShow(true)
                    setTimeout(() => {
                        setShow(false)
                    }, 5000);
                    setOtp(res.data.otp)
                    localStorage.setItem("id", res.data.id)
                    console.log(res.data.otp)
                }
            })
        }
    }
    const submitPassword = () => {
        const saltRounds = 10;
        const myPlaintextPassword = data.pass;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        if (otp != data.code) {
            sweet.fire({
                title: 'Your OTP does not match',
                icon: "error",
                timer: 1000
            })
        }
        else if (otp == data.code && errors.code == '' && errors.pass == '' && errors.cPass == '') {

            sweet.fire({
                title: 'Your Password has been changed successfully please login now',
                icon: "success",
                timer: 1000
            })
            updatePassword({ password: hash, id: localStorage.getItem("id") })
            navigate('/login')
        }
    }
    return (
        <div>
            {show == true && <Alert className="fw-bold" style={{ fontSize: "25px" }}>OTP sent successfully! Please check your email id</Alert>}
            {shows == true && <Alert severity="error" className="fw-bold" style={{ fontSize: "25px" }}>Please write your email Address</Alert>}
            <Container className='my-5 border' style={{ width: "60%", backgroundColor: "rgb(223, 223, 223)" }}>
                <h1 className='text-center'>Recover Password</h1>
                <hr />
                <h1>Hey Enter your email id first</h1>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Control type="email" validate placeholder="Email Address" className='py-2' onChange={handler} name="emailAdd" />
                    <div className='placeIcon'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                    </svg></div>
                    <p className='text-danger'>{errors.emailAdd}</p>
                    <Button onClick={sendOtp} className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} >Submit</Button>

                </Form.Group>

                 {
                    flag == 1 && 
                    <Form>
                        <Form.Group className="mb-5" controlId="exampleForm.ControlInput2">
                            <Form.Control type="number" placeholder="Verification Code" name="code" onChange={handler} className='py-2' />
                        </Form.Group>
                        <p className='text-danger'>{errors.code}</p>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Control type={password} placeholder="Password" className='py-2' name="pass" onChange={handler} />
                        </Form.Group>
                        <div className='placeIcon' style={{top:"-54px"}}>
                            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                        <p className='text-danger'>{errors.pass}</p>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Control type={passwords} placeholder="Confirm Password" className='py-2' name="cPass" onChange={handler} />
                        </Form.Group>
                        <div className='placeIcon' style={{top:"-54px"}}>
                            <i onClick={Eyes} className={`fa ${eyes ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                        <p className='text-danger'>{errors.cPass}</p>
                        <Button onClick={submitPassword} className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} >Submit</Button>

                    </Form>
                }

            </Container>
        </div>
    )
}

export default ForgotPassword
