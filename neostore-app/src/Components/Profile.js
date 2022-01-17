import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Account from './Account';
import jwtDecode from 'jwt-decode';
import EditProfile from './EditProfile'
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import sweet from 'sweetalert2'


function Profile() {
    const [data, setData] = useState();
    const [flag, setFlag] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if(!localStorage.getItem("_token")){
            sweet.fire({
                title: 'OOPS! you need to login to see profile',
                icon: "warning",
                timer: 2000
            })
            navigate('/login')
            window.location.reload()
        }
        if (localStorage.getItem("cartData") != undefined) {
            dispatch({ type: "cartLen" })
        }
        else {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token);
            localStorage.setItem("cartData", JSON.stringify(decode.cartData))
            dispatch({ type: "cartLen" })
        }
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token);
            console.log(decode)
            setData(decode)
        }
    }, [])
    const editButton = () => {
        setFlag(1)
    }
    return (
        <div>
            <div>
                <div className="col-12">
                    <h1>My Account</h1>
                </div>
                <hr />
                <div className="container m-4">
                    <div className="row">
                        <div className="col-6 text-center">
                            <Account />
                        </div>

                        <div className="col-6">
                            {
                                flag == 0 ? <div className="container card" style={{ marginTop: '40px' }}>
                                    <div className="col-12">
                                        <h2 className="mb-5">Profile</h2>
                                        <hr />
                                        <div className="row mb-4 mt-5">
                                            <div className="col-4 mt-4 mb-4">
                                                <p className="font-weight-bolder">First Name</p>
                                                <p className="font-weight-bolder">Last Name</p>
                                                <p className="font-weight-bolder">Email</p>
                                                <p className="font-weight-bolder">Gender</p>

                                                <p className="font-weight-bolder">Mobile Number</p>

                                            </div>
                                            <div className='col-2'></div>
                                            <div className="col-6 mt-4 mb-4">
                                                {
                                                    data != undefined &&
                                                    <>
                                                        <p>{data.firstName}</p>
                                                        <p>{data.lastName}</p>
                                                        <p>{data.emailAdd}</p>
                                                        <p>{data.gender}</p>
                                                        <p>{data.phoneNum}</p>
                                                    </>
                                                }

                                                <hr />
                                                <Button onClick={editButton} className="btn"><EditIcon />&nbsp;Edit</Button>
                                            </div>
                                        </div>

                                    </div>
                                </div> : <EditProfile />
                            }


                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
