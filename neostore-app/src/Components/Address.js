import React,{useState,useEffect,useRef} from 'react'
import { Row, Col, Container,Form,FormControl,Button,Accordion ,Card} from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Account from './Account';
import jwt_decode from 'jwt-decode'
import { addAddress ,getAddress,deleteAddress,updateAddress,deliveryAdd, orderData} from '../configFiles/services';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const regForPin = RegExp(/^[1-9][0-9]{5}$/);
const regForCity = RegExp(/^[A-Za-z]{3,20}$/);
const regForState = RegExp(/^[A-Za-z]{3,20}$/);
const regForCountry = RegExp(/^[A-Za-z]{3,20}$/);
function Address() {
    const[data,setData] =useState({});
    const [select,setSelect]=useState()
    const[arr,setArr]=useState()
    const[flag,setFlag]=useState(false)
    const[bflag,setBflag]=useState(false)
    const [address,setAddress]=useState([]);
    const [indexvalue,SetIndex]=useState()
    const[index,setIndex]=useState(0)
    const [edit, setEditData] = useState({
        address: '',
        pincode: '',
        country:'',
        state:'',
        city:''
    })
    const [Errors,SetError]=useState({
        address:'',
        pincode:'',
        city:'',
        state:'',
        country:'',
      
      })
      const dispatch=useDispatch()
      const navigate=useNavigate()
      const addressInput=useRef(null);
      const PinInput=useRef(null);
      const CityInput=useRef(null);
      const StateInput=useRef(null);
      const CountryInput=useRef(null);
      useEffect(() => {

        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setData(decode)
            getAddress({email:decode.emailAdd})
            
            .then(res=>{
                if(res.data.err===1){
                    alert(res.data.message)
                   
                }
                else if(res.data.err===0){
                    setAddress(res.data.address)
                    console.log(res.data.address)     
                }
            })
        }
        
        
    }, [])

      const handler=(event)=>{
         const {name,value}=event.target;
           edit.address=addressInput.current.value;
           edit.pincode=PinInput.current.value;
            edit.city=CityInput.current.value;
            edit.state=StateInput.current.value;
            edit.country=CountryInput.current.value;
            
            setEditData({ ...edit, [name]: value })
             console.log(edit)
      
    
        switch(name){
          
              case 'pincode':
                Errors.pincode= regForPin.test(value)?'':' Pincode should be 6 digits ';
                break;
              case 'city':
                Errors.city= regForCity.test(value)?'':'City length should be more than 2 letters';
           break;
         
                   case 'state':
                    Errors.state= regForState.test(value)?'':'State should not be less thatn 20 letters';
               break;
            
                  case 'country':
                      Errors.country= regForCountry.test(value)?'':'Country length should be more than 2 letters';
                      break;
                    
                
             
            
          }
          setSelect({Errors,[name]:value},()=>{
            console.log(Errors)
          })
          
        setData({...data,[name]:value})
        console.log(data)
    }

    const validate=(errors)=>{
        let valid = true;
        Object.values(errors).forEach((val)=> 
            val.length>0 && (valid = false));
            return valid;
            }

            const submit=(e)=>{
                e.preventDefault();
                setFlag(false)
                setBflag(false)
              
                if(validate(Errors)){
             
                    addAddress({address:data.address,pincode:data.pincode,state:data.state, city:data.city,country:data.country,id:data.id}).then(res=>{
                        if(res.data.err==1) {
                            alert(res.data.message)
                        }
                     
                         setArr(res.data.address)
                        console.log(res.data.address)
                        getAddress({email:data.emailAdd})
                        .then(res=>{
                            if(res.data.err===1){
                                alert(res.data.message)
                               
                            }
                            else if(res.data.err===0){
                                setAddress(res.data.address)
                                console.log(res.data.address)     
                            }
                        })

                    })
            
              
                }
            }
        
            const editDataFunc=(data)=>{
                setEditData(data)
               
            }
            const EditAddress=(e)=>{
                e.preventDefault()   
            if(addressInput.current.value!='' && PinInput.current.value!='' &&CityInput.current.value!='' && StateInput.current.value!=''
            && CountryInput.current.value!='' ){
                
        
            updateAddress({address:edit.address,pincode:edit.pincode,city:edit.city,state:edit.state,country:edit.country,address_id:address[indexvalue].address_id,id:data.id}).then(res=>{  
           setFlag(false)
           setBflag(false)
           getAddress({email:data.emailAdd})
            
           .then(res=>{
               if(res.data.err===1){
                   alert(res.data.message)
                  
               }
               else if(res.data.err===0){
                   setAddress(res.data.address)
                   console.log(res.data.address)     
               }
           })
        })
      
    }        
            
            }
            const DeleteData = (index) => {
                address.splice(index, 1)      
                console.log(address)
                deleteAddress({address:address,id:data.id}) .then(res=>{
                    if(res.data.err==1) {
                        alert(res.data.message)
                    }
                    getAddress({email:data.emailAdd})
            
                    .then(res=>{
                        if(res.data.err===1){
                            alert(res.data.message)
                           
                        }
                        else if(res.data.err===0){
                            setAddress(res.data.address)
                            console.log(res.data.address)     
                        }
                    })
                   
                })                
            }
            
    return (
        <div>
            <div>
                <div>
                    <div className="col-12">
                        <h1>My Account</h1>
                    </div>
                    <hr />
                    <Container>
                        <Row>
                            <Col sm={4}>


                                <div className="container m-4" style={{ marginRight: '50px' }}>

                                    <div className="row">
                                        <Account />
                                    </div>
                                </div>


                            </Col>


                            <Col sm={8} >
                            <Button  className="btn btn-light" onClick={()=> {setFlag(true);setEditData({address:'', pincode: '',country:'', state:'', city:''})}} ><HomeIcon />&nbsp;Add Address</Button>
                                    <div className="container " style={{padding:'20px'}}>
                                        <div >
                                            <div className="text">
                                                <h3> Shipping Address</h3>
                                                </div>
                                                {flag ? <>
                                                <div className="container card " style={{padding:'30px'}}>
                                                <Form >
                                                <Form.Group as={Row} className="mb-3" controlId="formHorizontaladdress">
                                                    <Form.Label column sm={2}>
                                                    Address
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                    <Form.Control as="textarea" placeholder="Enter Address" name='address' defaultValue={edit.address} ref={addressInput}   onChange={handler} required/>
                                                    </Col>
                                                </Form.Group>
                                              

                                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalpincode">
                                                        <Form.Label column sm={2}>
                                                        Pincode
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                        <Form.Control type="text" placeholder=" Enter Pincode" name='pincode' defaultValue={edit.pincode} ref={PinInput} onChange={handler} required/>
                                                        </Col>
                                                    </Form.Group>
                                                    {Errors.pincode.length>0 &&
                                       <span style={{color:"red"}}>{Errors.pincode}</span>}  

                                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalcity">
                                                        <Form.Label column sm={2}>
                                                        City
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Enter City" name='city' defaultValue={edit.city} ref={CityInput} onChange={handler} required />
                                                        </Col>
                                                    </Form.Group>
                                                    {Errors.city.length>0 &&
                                        <span style={{color:"red"}}>{Errors.city}</span>}  
                                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalstate">
                                                            <Form.Label column sm={2}>
                                                            State
                                                            </Form.Label>
                                                            <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Enter State " defaultValue={edit.state} ref={StateInput} name='state'      onChange={handler} required />
                                                            </Col>
                                                        </Form.Group>
                                                        {Errors.state.length>0 &&
                                                 <span style={{color:"red"}}>{Errors.state}</span>}  
                                                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                                            <Form.Label column sm={2}>
                                                            Country
                                                            </Form.Label>
                                                            <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Enter Country" defaultValue={edit.country} ref={CountryInput} name='country'  onChange={handler} required/>
                                                            </Col>
                                                        </Form.Group>
                                                        {Errors.country.length>0 &&
                                            <span style={{color:"red"}}>{Errors.country}</span>} 
                                         
                                                {
                                                    bflag==false?
                                            
                                            
                                                    <div className="buttons" style={{marginTop:'50px'}}>
                                                    <button className='btn btn-primary' onClick={submit}  >Save</button>
                                                </div>:<div>
                                                <div className="buttons" >
                                                    <button className='btn btn-warning' onClick={EditAddress }  >Update</button>
                                                </div>
                                                </div>
}
                                                <br/>
                                                <div className="mb-2"><Button variant="contained-light"  className='btn btn-success'onClick={()=>{setFlag(false);setBflag(false)}}   fullwidth>Cancel</Button></div>                          
                                        </Form>
                                    </div>
                                    </>:<div className='card' style={{padding:'50px'}}>
                                            <div>
                                            <div className="container " >
            <div>
                                    
                                        {  address.map((ele,index)=>
                                        <div style={{margin:'10px'}}>
                                <Accordion defaultActiveKey="0" key={index} >
                                <Accordion.Item eventKey="0">
                                <Accordion.Header>Address {index+1}</Accordion.Header>
                                <Accordion.Body>
                                    <p> address: {ele.address}</p>
                                    <p>Pincode: {ele.pincode}</p>
                                    <p>City: {ele.city}</p>
                                    <p>State: {ele.state}</p>
                                    <p>Country: {ele.country}</p>
                                    <Button  className="btn" onClick={()=> { SetIndex(index);setBflag(true);setFlag(true);editDataFunc({address:ele.address,pincode:ele.pincode,state:ele.state,city:ele.city,country:ele.country})}} ><EditIcon  />&nbsp;Edit</Button>&nbsp;&nbsp;
                                    <Button  className="btn btn-danger" onClick={()=>DeleteData(index)} ><DeleteForeverIcon   />&nbsp;Delete</Button>
                                     
                                </Accordion.Body>
                                </Accordion.Item>
                                
                                </Accordion>
                                </div>
                                    )
                                } 

             </div>
         
         
       
        </div>
                                                        

                                            </div>
                                                    
                                    </div>
}

                                            </div>
                                     
                                    </div>
                              
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default Address
