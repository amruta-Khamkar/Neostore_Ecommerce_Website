import React, { useState, useEffect } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ReorderIcon from '@mui/icons-material/Reorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import jwtDecode from 'jwt-decode';
import { getAll, updateProfilePhoto } from '../configFiles/services';
import { useDispatch } from 'react-redux';

export default function Account() {
    const [data, setData] = useState([]);
    const [newUser, setNewUser] = useState(
        {
            photo: '',
            id: ''
        }
    );
    const [temp, setTemp] = useState(false);
    const[profile,setProfile]=useState(false)
    let token = localStorage.getItem("_token")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token);
            console.log(decode)
            setData(decode);
        }
    }, [token])
    const handleSubmit = (e) => {
        e.preventDefault()  
        console.log(newUser.photo)
        console.log(data)
        let formData = new FormData()
        formData.append('photo', newUser.photo)
        formData.append('emailAdd', data.emailAdd)
        formData.append('id', data.id)
        formData.append('firstName', data.firstName)
        formData.append('phoneNum', data.phoneNum)
        formData.append('lastName', data.lastName)
        formData.append('gender', data.gender)
        formData.append('password', data.password)
        formData.append('cartData', localStorage.getItem('cartData'))
        console.log(data.emailAdd)
        updateProfilePhoto(formData).then(res => {
            if (res.data.err === 0) {
                alert(res.data.message)
                console.log(res.data)
                localStorage.removeItem('_token');
                localStorage.setItem('_token', res.data.token)
                setTemp(prev => !prev);
                setProfile(false)
                if (!localStorage.getItem("cartData")) {
                    localStorage.setItem('cartData', [])
                }
            }
            else alert(res.data.message)
        })
        
      

    }
    const handlePhoto = (e) => {
        console.log({ photo: e.target.files[0] })
        setNewUser({ ...newUser, photo: e.target.files[0] });
        console.log(newUser.photo)
    }
 
    return (
        <div>
                <img src={data.photo} alt="userIcon" height="150px" style={{ borderRadius: "100%" }} />
            
            {
                profile==true &&
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="photo"
                    onChange={handlePhoto} />
               <input className='py-2 border-primary bg-white text-primary px-4' style={{ marginLeft: '-80px'}}type='submit' />
            </form>
            }
            <h4 className="text-danger mt-2">{data.firstName} {data.lastName}</h4>
            <div className="mb-2"><Button variant="outlined" onClick={()=>setProfile(true)} style={{ marginLeft: '10px', marginTop: '20px', width: '200px' }} fullWidth><ReorderIcon /> &nbsp;Change Profile</Button></div>
            <div className="mb-2"><Link to="/order"><Button variant="outlined" style={{ marginLeft: '10px', marginTop: '20px', width: '200px' }} fullWidth><ReorderIcon /> &nbsp;Order</Button></Link></div>
            <div className="mb-2"><Link to="/profile"><Button variant="outlined" style={{ marginLeft: '10px', marginTop: '20px', width: '200px' }} fullWidth><PersonIcon /> &nbsp; Profile</Button></Link></div>
            <div className="mb-2"><Link to="/address"><Button variant="outlined" style={{ marginLeft: '10px', marginTop: '20px', width: '200px' }} fullWidth><MenuBookIcon /> &nbsp; Addresses</Button></Link></div>
            <div className="mb-2"><Link to="/changepassword"><Button variant="outlined" style={{ marginLeft: '10px', marginTop: '20px', width: '200px' }} fullWidth><SyncAltIcon /> &nbsp; Change Password</Button></Link></div>
        </div>
    )
}
