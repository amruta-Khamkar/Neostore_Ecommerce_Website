import './App.css';
import { Suspense,lazy,useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SelectAddress from './Components/SelectAddress';
const Dashboard=lazy(()=>import('./Components/Dashboard'))
const Login=lazy(()=>import('./Components/Login'))
import PageNotFound from './Components/PageNotFound'
import { useDispatch } from 'react-redux';
import Confirm from './Components/Confirm';
const Products=lazy(()=>import('./Components/Products'))
const Register=lazy(()=>import('./Components/Register'))
const ForgotPassword=lazy(()=>import('./Components/ForgotPassword'))
const ChangePassword=lazy(()=>import('./Components/ChangePassword'))
const Profile=lazy(()=>import('./Components/Profile'))
const Address=lazy(()=>import('./Components/Address'))
const Order=lazy(()=>import('./Components/Order'))
const Account=lazy(()=>import('./Components/Account'))
 const SpecificProduct=lazy(()=>import('./Components/SpecificProduct'))
const Cart=lazy(()=>import('./Components/Cart'))
const Invoice=lazy(()=>import('./Components/Invoice'))
const Navbars=lazy(()=>import('./Components/Navbars'))
const Footer=lazy(()=>import('./Components/Footer'))

function App() {
  const dispatch=useDispatch()
useEffect(() => {
 dispatch({type:"login"})
}, [])
  return (
    <>
    <Suspense fallback={<div style={{width:"600px",margin:"30px auto"}}><img width="600px" height="600px" src='https://c.tenor.com/qzuj7-PoJTcAAAAM/loading.gif'/></div>}>
      <Navbars/>
      <Routes>
        <Route path="/"  element={<Dashboard/>}></Route>
        <Route path="/login"  element={<Login/>}></Route>
        <Route path="/register"  element={<Register/>}></Route>
        <Route path="/forgotpassword"  element={<ForgotPassword/>}></Route>
        <Route path="/products"  element={<Products/>}></Route>
        <Route path="/specificproduct"  element={<SpecificProduct/>}></Route>
        <Route path="/cart"  element={<Cart/>}></Route>
        <Route path="/invoice"  element={<Invoice/>}></Route>
        <Route path="/profile"  element={<Profile/>}></Route>
        <Route path="/selectAddress"  element={<SelectAddress/>}></Route>
        <Route path="/changepassword"  element={<ChangePassword/>}></Route>
        <Route path="/order"  element={<Order/>}></Route>
        <Route path="/address"  element={<Address/>}></Route>
        <Route path='/confirm' element={<Confirm/>}></Route>
        <Route path ="*" element={<PageNotFound/>} />
      </Routes>
      <Footer/>
      </Suspense>
    </>
  );
}

export default App;
