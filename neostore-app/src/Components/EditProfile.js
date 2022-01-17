import React, { useState, useEffect, useRef } from 'react'
import Account from './Account';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import jwtDecode from 'jwt-decode';
import { Form, Button } from 'react-bootstrap'
import { editProfile } from '../configFiles/services';
import { useDispatch } from 'react-redux';
const paperStyle = { height: '100vh', width: 600, margin: '30px auto', paddingTop: '10px' }

function EditProfile() {

    const [id, setId] = useState()
    const [data, setdata] = useState()
    const [edit, setEditData] = useState({
        firstName: '',
        lastName: '',
        emailAdd: '',
        phoneNum: '',
        gender: ''
    })
    const [values, setValues] = useState({
        name: '',
        lname: '',
        email: '',
        mobile: '',
        gender: ''
    })
    const dispatch = useDispatch()
    const fName = useRef(null);
    const lName = useRef(null);
    const email = useRef(null);
    const phone = useRef(null);
    const gen = useRef(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token);
            console.log(decode)
            setdata(decode)
        }
    }, [])

    const handleData = (event) => {
        edit.firstName = fName.current.value;
        edit.lastName = lName.current.value;
        edit.emailAdd = email.current.value;
        edit.phoneNum = phone.current.value;
        edit.gender = gen.current.value;
        const { name, value } = event.target;
        setEditData({ ...edit, [name]: value })
        console.log(edit)
    }


    const editData = (e) => {
        let gens=["female","male","others"]
        
        if (fName.current.value == data.firstName && lName.current.value == data.lastName && email.current.value == data.emailAdd && phone.current.value == data.phoneNum && gen.current.value == data.gender) {
            alert("Oops ! you have not updated anything !");
        }
        else if(gens.includes(gen.current.value.toLowerCase())){
            localStorage.removeItem('_token')
            editProfile({ firstName: edit.firstName, lastName: edit.lastName, emailAdd: edit.emailAdd, phoneNum: edit.phoneNum, gender: edit.gender, id: data.id }).then(res => {
                localStorage.setItem('_token', res.data.token)
                alert(res.data.message)
                window.location.reload()
            })
        }
        else{
            alert("gender should be female,male or others")
        }
    }
    return (
        <div>
            <div>
                <div className="container m-4">
                    <div className="col-6">
                        <Paper elevation={5} style={paperStyle} >
                            <div className="container">
                                <div >
                                    <div className="text">
                                        <h3>Edit Profile</h3>
                                    </div>
                                    <form  >

                                        {
                                            (data != undefined &&
                                                <div>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        <Form.Control type="text" placeholder="First Name" className='py-2' name="firstName" defaultValue={data.firstName} onChange={handleData} ref={fName} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                        <Form.Control type="text" defaultValue={data.lastName} placeholder="Last Name" className='py-2' name="lastName" onChange={handleData} ref={lName} />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                        <Form.Control type="email" placeholder="Email Address" defaultValue={data.emailAdd} className='py-2' name="emailAdd" onChange={handleData} ref={email} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                        <Form.Control type="number" placeholder="Mobile Number" defaultValue={data.phoneNum} className='py-2' name="phoneNum" onChange={handleData} ref={phone} />
                                                    </Form.Group>
                                                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type="text" placeholder="Gender" defaultValue={data.gender}className='py-2' name="gender" onChange={handleData} ref={gen}/>
                    </Form.Group>              

                                                </div>
                                            )}


                                        <div className="buttons" style={{ marginTop: '50px' }}>
                                            <Button onClick={editData} className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} >submit</Button>

                                        </div>


                                    </form>
                                </div>
                            </div>
                        </Paper>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
