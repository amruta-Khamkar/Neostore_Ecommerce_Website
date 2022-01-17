import axios from 'axios'
import { MAIN_url } from './MAIN_url';

export function addUser(data){
    console.log("im add")
    return axios.post(`${MAIN_url}/users/adduser`,data);
}
export function addSocialUser(data){
    console.log("im add")
    return axios.post(`${MAIN_url}/users/socialuser`,data);
}
export function getUser(data){
    console.log("hey")
    return axios.post(`${MAIN_url}/users/getuser`,data)
}
export function otpSend(data){
    return axios.post(`${MAIN_url}/users/otpsend`,data)
}
export function updatePassword(data){
    return axios.post(`${MAIN_url}/users/updatepass`,data)
}
export function editProfile(data){
    return axios.post(`${MAIN_url}/users/editprofile`,data)
}
export function changePass(data){
    return axios.post(`${MAIN_url}/users/changepass`,data)
}
export function updateProfilePhoto(data){
    return axios.post(`${MAIN_url}/users/updatephoto`,data)
}
export function filterData(data){
    return axios.post(`${MAIN_url}/users/filterdata`,data)
}
export function findSocialUser(data){
    return axios.post(`${MAIN_url}/users/findsocialuser`,data)
}
export function checkSocial(data){
    return axios.post(`${MAIN_url}/users/checksocial`,data)
}
export function filterColor(data){
    return axios.post(`${MAIN_url}/users/filtercolor`,data)
}
export function addCartData(data){
    return axios.post(`${MAIN_url}/users/addcart`,data)
}
export function updateCart(data){
    return axios.post(`${MAIN_url}/users/updatecart`,data)
}
export function deleteCart(data){
    return axios.post(`${MAIN_url}/users/deletecart`,data)
}
export function addAddress(data){
    return axios.post(`${MAIN_url}/users/addaddress`,data)
}
export function getAddress(data){
    return axios.post(`${MAIN_url}/users/getaddress`,data)
}
export function deleteAddress(data){
    return axios.post(`${MAIN_url}/users/deleteaddress`,data)
}
export function updateAddress(data){
    return axios.put(`${MAIN_url}/users/updateaddress`,data)
}
export function deliveryAdd(data){
    return axios.put(`${MAIN_url}/users/deliveryaddress`,data)
}
export function orderData(data){
    return axios.put(`${MAIN_url}/users/orderdata`,data)
}
export function updateRating(data){
    return axios.put(`${MAIN_url}/users/updaterating`,data)
}
export function getAll(){
    console.log("im get")
    return axios.get(`${MAIN_url}/users/getall`);
}
export function sendEmail(data){
    console.log("im get")
    return axios.post(`${MAIN_url}/users/sendmail`,data);
}
export function colorFilter(data){
    console.log("im get")
    return axios.post(`${MAIN_url}/users/color`,data);
}
export function populate(){
    console.log("im get")
    return axios.get(`${MAIN_url}/users/populate`);
}
export function verifyEmail(){
    console.log("im get")
    return axios.get(`${MAIN_url}/users/verify`);
}
export function getOrders(){
    console.log("im get")
    return axios.get(`${MAIN_url}/users/getorder`);
}
export function getProducts(){
    console.log("im get")
    return axios.get(`${MAIN_url}/users/getproducts`);
}
export function gets(){
    return axios.get(`${MAIN_url}/users/gets`,{
        headers:{"authorization":`Bearer ${localStorage.getItem('_token')}`}
    });
}