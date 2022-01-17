import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import sweet from 'sweetalert2';

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
function Footer() {
  const [data,setData]=useState('');
  const [errors,setErrors]=useState()

  const handler=(event)=>{
    let name=event.target.name;
    let value=event.target.value;
    if(!regForEmail.test(value)){
      setErrors("Please enter proper email id")
    }
    else{
      setData({name:value})
      setErrors('')
    }
  }
  const subscribe=()=>{
    if(data==''){
      sweet.fire({
        title:  `Write your Email id`,
        icon:"warning",
        timer:4000
      })
    }
    else if(errors==''){
      sweet.fire({
        title:  `Hey Thank you for subscribing us! `,
        icon:"success",
        timer:3000
      })
    }
  }
    return (
        <div>
            <div class="mt-5 pt-5 pb-5 footer" >
<div class="container">
  <div class="row">
    <div class="col-lg-5 col-xs-12 about-company">
      <h3>About Company</h3>
      <p class="pr-5 text-white-50">Neosoft TechNology is here for your Easy and quick service for shopping.<br/>Contact Information:<br/>Email: contact@neosofttech.com<br/><i class="fa fa-phone fa-xs" aria-hidden="true" style={{fontSize:'18px'}}></i>Phone:01244858930<br/>MUMBAI INDIA  </p>
     </div>
    <div class="col-lg-3 col-xs-12 links">
      <h3 class="mt-lg-0 mt-sm-3">Information</h3>
        <ul class="m-0 p-0">
          <li>- <a href="/SodaPDF-converted-terms_conditions.pdf" target='_blank' >Terms and Conditions</a></li>
         
        </ul>
        <p class="pr-5 text-white-50">Gaurentee and return policy<br/>Contact Us <br/>Privacy policy<br/>
        <a href="https://www.google.com/maps/place/Neosoft+Technologies/@19.1410544,73.0088433,15z/data=!4m5!3m4!1s0x0:0x211c40a176ee4540!8m2!3d19.1410483!4d73.0088473" target="_blank">
        Locate Us</a> </p>
        
    </div>

    <div class="col-lg-4 col-xs-12">
          <h5 class="text-uppercase mb-4">Sign up to our newsletter</h5>

          <div class="form-outline form-white mb-4">
          <p  class="pr-5 text-white-50">SignUp to get More Exclusive Offer for our Favourite Brand</p>
            <input type="email" id="form5Example2" class="form-control"  onChange={handler} placeholder='Enter Email Address' name="email"/>
          <p className='text-danger'>{errors}</p>
          </div>
          <Button variant="light" onClick={subscribe}>Subscribe</Button>
        
        </div>
 
  </div>
  <div class="row mt-5">
    <div class="col copyright">
      <p class=""><small class="text-white-50">© CopyRight 2022-Neosoft Technologies. All Rights Reserved. | Designed By: Amruta Khamkar</small></p>
    </div>
  </div>
</div>
</div>

        </div>
    )
}

export default Footer
