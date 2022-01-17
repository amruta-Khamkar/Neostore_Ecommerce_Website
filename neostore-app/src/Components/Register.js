import React, { useState } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { addSocialUser, checkSocial, findSocialUser, getUser,addUser, sendEmail } from '../configFiles/services';
import bcrypt from 'bcryptjs';
import SocialButton from './SocialButton';
import { Navigate, useNavigate,Link } from 'react-router-dom';
import sweet from 'sweetalert2'
import { useDispatch } from 'react-redux';

const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForUName = RegExp(/^[A-Za-z]{2,12}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
const RegForMobile = RegExp('^((\\+91-?)|0)?[0-9]{10}$')
function Register() {
    // showHide Password 
    const [data, setData] = useState({
        firstName:'',
        lastName:'',
        emailAdd:'',
        password:'',
        confirmPass:'',
        photo:''
    });
    const [eye, seteye] = useState(true);
    const [eyes, seteyes] = useState(true);
    const [password, setpassword] = useState("password");
    const [passwords, setpasswords] = useState("password");
    const [select, setSelect] = useState();
    const [state, setState] = useState({
        flag: 0
    })
    const [Errors, SetError] = useState({
        firstName: '',
        lastName: '',
        emailAdd: '',
        password: '',
        phoneNum: '',
        confirmPass: ''
    })
    const navigate=useNavigate()
    const dispatch=useDispatch()
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

    const handleRegisterData = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'firstName':
                Errors.firstName = regForName.test(value) ? '' : ' name should be between 2 to 10 letters';
                break;
            case 'lastName':
                Errors.lastName = regForName.test(value) ? '' : ' last name should be between 2 to 10 letters';
                break;
            case 'phoneNum':
                Errors.phoneNum = RegForMobile.test(value) ? '' : 'Phone Number should be valid';
                break;

            case 'emailAdd':
                Errors.emailAdd = regForEmail.test(value) ? '' : 'invalid email';
                break;

            case 'password':
                Errors.password = regForPass.test(value) ? '' : 'Password must be between 6 to 16 characters and must contain one number and one special character';
                break;

            case 'confirmPass':
                Errors.confirmPass=data.password==value?'':'password and confirm password should match'

        }
        setSelect({ Errors, [name]: value }, () => {
            console.log(Errors)
        })

        setData({ ...data, [name]: value })
        console.log(data)
    }

    const submitRegisterData = () => {
        var getSelectedValue = document.querySelector( 'input[name="gender"]:checked');   
        if(data.firstName==''|| data.lastName==''||data.emailAdd==''||data.password==''|| data.confirmPass==''||data.phoneNum==''){
            sweet.fire({
                title: 'All Fields Are Required',
                icon:"warning",
                timer:1000
              })
        }
        else if(getSelectedValue == null){
            sweet.fire({
                title: 'Please select gender',
                icon:"warning",
                timer:1000
              })
        }
        else if(Errors.firstName==''&& Errors.lastName==''&& Errors.emailAdd=='' && Errors.password==''&& Errors.confirmPass=='' && Errors.phoneNum==''){
        const saltRounds = 10;
        const myPlaintextPassword = data.password;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        console.log(hash)
        addUser({ firstName:data.firstName, lastName: data.lastName, emailAdd: data.emailAdd, password:hash, phoneNum: data.phoneNum, gender: data.gender, photo: "user.png"}).then(res => {
            if (res.data.err == 1) {
                sweet.fire({
                    title: res.data.message,
                    icon:"warning",
                    timer:2000
                  })
            }
            else {
                sweet.fire({
                    title: res.data.message,
                    text:"Thank you for your patience !verification link is sent to your email address! kindly verify to login",
                    icon:"success",
                  })
                navigate('/login')
            }
        })
    }
    }

    const verifyEmail=()=>{
        sendEmail({emailAdd:data.emailAdd})
    }
    return (
        <div>
            <div className='centeredDiv'>
            <SocialButton
                   className="my-2 me-5 py-3" style={{ width: "45%", backgroundColor: "#3b5998" }}
                   provider="facebook"
                   appId="839088120121430"
                   onLoginSuccess={handleSocialLogin}
                   onLoginFailure={handleSocialLoginFailure}

                > <FacebookIcon style={{ fontSize: "45px" }} /> Log in With FaceBook</SocialButton>


                <SocialButton
                    className="my-3 px-5 py-3 bg-danger" style={{ width: "45%" }}
                    provider="google"
                    appId="941644477844-r3f9mn9in6ihn735j15jd7k2m9h8q1kf.apps.googleusercontent.com"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}

                > <GoogleIcon style={{ fontSize: "45px" }} />Log in With Google</SocialButton>

            </div>

            <Container className='my-5 border' style={{ width: "60%" }}>
                <h1>Register to Neostore</h1>
                <Form>
                    {Errors.firstName.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.firstName}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="text" placeholder="First Name" className='py-2' name="firstName" onChange={handleRegisterData} />
                        <div className='placeIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
                            <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z" />
                        </svg></div>
                    </Form.Group>
                    {Errors.lastName.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.lastName}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type="text" placeholder="Last Name" className='py-2' name="lastName" onChange={handleRegisterData} />
                        <div className='placeIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
                            <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z" />
                        </svg></div>
                      
                    </Form.Group>
                    {Errors.emailAdd.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.emailAdd}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type="email" placeholder="Email Address" className='py-2' name="emailAdd" onChange={handleRegisterData} />
                        <div className='placeIcon'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg></div>
                    </Form.Group>
                    {Errors.password.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.password}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type={password} placeholder="Password" onChange={handleRegisterData} name="password" required />
                        <div className='placeIcon'>
                            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                    </Form.Group>
                    {Errors.lastName.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.confirmPass}</span>}
                    {Errors.confirmPass.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.confirmPass}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type={passwords} placeholder=" Confrim Password" onChange={handleRegisterData} name="confirmPass" required />
                        <div className='placeIcon'>
                            <i onClick={Eyes} className={`fa ${eyes ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                    </Form.Group>

                    {Errors.phoneNum.length > 0 &&
                        <span style={{ color: "red" }}>{Errors.phoneNum}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type="number" placeholder="Mobile Number" className='py-2' name="phoneNum" onChange={handleRegisterData} />
                        <div className='placeIcon'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                        </svg></div>
                    </Form.Group>

                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" id="gens" onChange={handleRegisterData} value="Female" />
                        <label class="form-check-label" for="flexRadioDefault1" value="Female" >
                            Female
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" id="flexRadioDefault2" onChange={handleRegisterData} value="Male" />
                        <label class="form-check-label" for="flexRadioDefault2">
                            Male
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" id="flexRadioDefault2" onChange={handleRegisterData} value="Others" />
                        <label class="form-check-label" for="flexRadioDefault2">
                            Others
                        </label>
                    </div>
                    <Button className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} onClick={submitRegisterData}>Register</Button>
                    <span>Already Registered user?</span><Link to="/login" style={{ marginLeft: "10px", color: "black" }}>Login here</Link>
                </Form>
        
            </Container>

        </div>
    )
}

export default Register
