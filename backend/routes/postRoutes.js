const express = require('express');
const fs = require('fs');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const jwtSecret = "asd889asdas5656asdas887";
const app = express();
const nodemailer = require('nodemailer');
const connectDb = require('../db/connectDb');
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
const bcrypt = require('bcryptjs')
require('dotenv').config();
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const url = "http://localhost:3000/confirm"
connectDb();

const { userModel } = require('../models/dbSchema');
const productModel = require('../models/productSchema');
const categorySchema = require('../models/categorySchema');
const colorSchema = require('../models/colorSchema');
const orderModel = require('../models/orderSchema')
const autenticateToken = async (req, res, next) => {
    const authHeader = await req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token + "/////////")
    if (token == null) {
        console.log("Token not match");
    }
    else {

        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                console.log("Token incorrect")
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }

}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/getall', (req, res) => {
    userModel.find({}, (err, data) => {
        if (err) throw err;
        res.send(data)
    })

})
router.get('/gets', autenticateToken, (req, res) => {
    console.log("get")

})

router.post('/adduser', (req, res) => {
    console.log(req.body)
    let ins = new userModel({ firstName: req.body.firstName, lastName: req.body.lastName, emailAddress: req.body.emailAdd, password: req.body.password, phoneNumber: req.body.phoneNum, gender: req.body.gender, photo: req.body.photo ,isVerified:false})
    ins.save((err) => {
        if (err) {
            res.json({ message: "Oops !User already exists please try to login ", err: 1 })
        }
        else {
            rand = Math.floor((Math.random() * 100) + 54);
            host = req.get('host');
            link = "http://" + req.get('host') + "/api"+"/users"+"/verify?id=" + rand;
            console.log(link)
            let smtpTransoprt = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                auth: {
                    user: process.env.email,
                    pass: process.env.password,
                }
            });
            mailOptions = {
                to: req.body.emailAdd,
                subject: "Please confirm your Email account",
                html: `Please click here to verify <a href=${link} >verify email</a>`
            }
            console.log(mailOptions);
            smtpTransoprt.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    res.send("error");
                } else {
                    console.log("Message sent: ");
                    res.json({
                        success: true,
                        status_code: 200,
                        message: `Hey ! ${req.body.firstName} was registered successfully`,
                        err: 0
                    })
                }
            });
           
        }

    })
})
router.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            console.log("email is verified");
            res.end(`<h1>Email ${mailOptions.to} is been Successfully verified
            <a href="http://localhost:3000/login" >Login here now</a>
            <p>Thank you,</p>
            <p>Neostore</p>
            
            `);
            userModel.updateOne({emailAddress:mailOptions.to},{$set:{isVerified:true}},function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated Docs : ", docs);
                }
            });

        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>OOPS ! Link is expired ...</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    });
router.post('/getuser', (req, res) => {
    userModel.findOne({ emailAddress: req.body.emailAdd }, (err, data) => {
        console.log((bcrypt.compareSync(req.body.password, data.password)))
        // console.log(data)
        if (err) {
            res.send("its error")
        }
        else if (data == null) {
            res.json({ err: 1, message: "Please write correct email id" })
        }
        else if(data.isVerified==false){
          
            res.json({err:1,message:"please verify your email address"})
        }
        else if ((bcrypt.compareSync(req.body.password, data.password))) {
            let payload = {
                emailAdd: req.body.emailAdd,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                phoneNum: data.phoneNumber,
                password: data.password,
                photo: data.photo,
                id: data._id,
                cartData: data.cartData,
                provier: data.provider
            }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
            res.json({
                err: 0,
                success: true,
                status_code: 200,
                message: `Hey !${data.firstName} You have logged In successfully`,
                token: token
            })
        }
        else {
            console.log("hey")
            res.json({ err: 1, message: "Please Write correct pasword ha" })
        }
    })
})
router.post('/socialuser', (req, res) => {
    console.log(req.body)
    let ins = new userModel({ firstName: req.body.firstName, lastName: req.body.lastName, emailAddress: req.body.emailAdd, provider: req.body.provider, photo: req.body.photo })
    userModel.findOne({ emailAddress: req.body.emailAdd }, (err, data) => {
        console.log(data)
        ins.save((err) => {
            if (err) {
                let payload = {
                    emailAdd: data.emailAddress,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    phoneNum: data.phoneNumber,
                    password: data.password,
                    photo: data.photo,
                    id: data._id,
                    cartData: data.cartData,
                    provier: data.provider
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                res.json({ message: `Hey ! ${req.body.firstName} was logged in successfully`, err: 0, token: token })
            }
            else {
                let payload = {
                    emailAdd: req.body.emailAdd,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    provider: req.body.provider,
                    photo: req.body.photo,
                    cartData: [],
                    Address: []
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                res.json({
                    success: true,
                    status_code: 200,
                    message: `Hey ! ${req.body.firstName} was logged in successfully`,
                    err: 0,
                    token: token
                })
            }

        })
    })

})

router.post('/findsocialuser', (req, res) => {
    userModel.findOne({ emailAddress: req.body.email }, (err, data) => {
        if (data == null) {
            res.json({ err: 1 })
        }
        else if (data != null) {
            let payload = {
                emailAdd: data.emailAddress,
                firstName: data.firstName,
                lastName: data.lastName,
                cartData: data.cartData,
                id: data._id,
                provider: data.provider,
                cartData: data.cartData,
                photo: data.photo,
                password: data.password
            }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
            res.json({ err: 0, token: token })
        }
    })
})
router.post('/checksocial', (req, res) => {
    userModel.findOne({ emailAddress: req.body.email }, (err, data) => {
        if (data == null) {
            res.json({ err: 1, message: "We cannot find an account with that email address" })
        }
        else if (data != null) {
            console.log(data)
            if (data.password != null) {
                if ((bcrypt.compareSync(req.body.password, data.password))) {
                    res.json({ err: 0 })
                }
                else {
                    res.json({ err: 1, message: "Please write correct password", provider: data.provider })
                }
            }
            else if (data.provider == "social") {
                res.json({ err: 1, message: "hey user you are social user ", provider: data.provider })
            }
            else {
                res.json({ err: 0 })
            }

        }
    })
})
router.post('/otpsend', (req, res) => {
    userModel.findOne({ emailAddress: req.body.email }, (err, data) => {

        if (err) {
            res.json({ err: 1 })
        }
        else if (data == null) {
            res.json({ err: 1, message: "This Email Address is not saved" })
        }
        else {
            userModel.updateOne({ _id: data.id },
                { $set: { otp: req.body.otp } }, function (err, docs) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        // console.log("Updated Docs : ", docs);
                    }
                });
            let smtpTransoprt = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                auth: {
                    user: process.env.email,
                    pass: process.env.password,
                }
            });
            var mailOptions = {
                from: process.env.email,
                to: req.body.email,
                subject: 'OTP is ready !!!',
                html: `
        hello ,
        <h1>Your Otp Number is ${req.body.otp} !</h1>
        
        <h3>If you have any query contact this number: 1234567890 </h3>
        <h4>Thank you
        Neostore,</h4>
        `
            };

            smtpTransoprt.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.json({ err: 1, message: "This email is not proper" });
                }

                else {
                    console.log(res.info)
                    res.json({ err: 0, message: "Mail sent successfully", otp: req.body.otp, id: data._id })
                }
            });

            smtpTransoprt.close();
        }
    })
})
router.post('/updatepass', (req, res) => {
    userModel.updateOne({ _id: req.body.id },
        { $set: { password: req.body.password } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Docs : ", docs);
            }
        });
})
router.post('/changepass', (req, res) => {
    console.log(req.body.id)
    userModel.updateOne({ _id: req.body.id },
        { $set: { password: req.body.newPass } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Docs : ", docs);
            }
        });
})

router.post('/editprofile', (req, res) => {
    console.log(req.body)

    userModel.updateOne({ _id: req.body.id },
        { $set: { firstName: req.body.firstName, lastName: req.body.lastName, emailAddress: req.body.emailAdd, phoneNumber: req.body.phoneNum, gender: req.body.gender } }, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                userModel.findOne({ _id: req.body.id }, function (err, data) {
                    let payload = {
                        emailAdd: req.body.emailAdd,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        gender: req.body.gender,
                        phoneNum: req.body.phoneNum,
                        cartData: data.cartData,
                        id: req.body.id,
                        password: data.password,
                        photo: data.photo
                    }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                    res.json({
                        err: 0,
                        success: true,
                        status_code: 200,
                        message: ` Hey ! Your Data Has Been Updated Successfully`,
                        data: data,
                        token: token
                    })
                })
            }
        });
})
router.get('/getproducts', (req, res) => {
    productModel.find({}, (err, data) => {
        if (err) throw err;
        res.send(data)
    })

})
router.post('/color',(req,res)=>{
    productModel.find()
    .populate(["colorId"])
    .then(product => {
        const pro = product.filter(product => product.colorId.colorName == req.body.colour);
        res.send(pro)
    })
})
router.post("/updatephoto", upload.single('photo'), function (req, res, next) {
    console.log(req.body)
    const url = req.protocol + '://' + req.get('host') + '/Images/' + req.file.filename
    userModel.updateOne({ _id: req.body.id },
        { $set: { photo: url } }, function (err, docs, data) {
            if (err) {
                console.log(err)
            }
            else {
                let payload = {
                    emailAdd: req.body.emailAdd,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    phoneNum: req.body.phoneNum,
                    id: req.body.id,
                    cartData: JSON.parse(req.body.cartData),
                    password: req.body.password,
                    photo: url
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                console.log({
                    err: 0,
                    success: true,
                    status_code: 200,
                    message: ` Hey ! Your Data Has Been Updated Successfully`,
                    docs: docs,
                    token: token
                })
                res.json({
                    err: 0,
                    success: true,
                    status_code: 200,
                    message: ` Hey ! Your Data Has Been Updated Successfully`,
                    data: data,
                    token: token
                })
            }
        });

});
router.post('/filterdata', (req, res) => {
    console.log(req.body.category)
    productModel.find()
        .populate(["categoryId", "colorId"])
        .then(product => {
            const pro = product.filter(product => product.categoryId.categoryName == req.body.category);
            res.send(pro)
        })
})
router.get('/populate', (req, res) => {
    console.log(req.body.category)
    productModel.find()
        .populate(["colorId"])
        .then(product => {
            res.send(product)
        })
})
router.post('/filtercolor', (req, res) => {
    console.log(req.body.colour)
    let ds, sofaData, slice;
    productModel.find()
        .populate(["categoryId", "colorId"])
        .then(product => {
            if (req.body.category == "Sofa") {
                ds = product.filter(product => product.categoryId.categoryName == "Sofa");
                sofaData = ds.filter(ds => ds.colorId.colorName == req.body.colour)
                res.send(sofaData)
            }
            else if (req.body.category == "Bed") {
                ds = product.filter(product => product.categoryId.categoryName == "Bed");
                sofaData = ds.filter(ds => ds.colorId.colorName == req.body.colour)
                res.send(sofaData)
            }
            else if (req.body.category == "Wadrobe") {
                ds = product.filter(product => product.categoryId.categoryName == "Wadrobe");
                sofaData = ds.filter(ds => ds.colorId.colorName == req.body.colour)
                res.send(sofaData)
            }
            else if (req.body.category == "Chair") {
                ds = product.filter(product => product.categoryId.categoryName == "Chair");
                sofaData = ds.filter(ds => ds.colorId.colorName == req.body.colour)
                res.send(sofaData)
            }
            else if (req.body.category == "Dining set") {
                ds = product.filter(product => product.categoryId.categoryName == "Dining set");
                sofaData = ds.filter(ds => ds.colorId.colorName == req.body.colour)
                res.send(sofaData)
            }
        })
})
router.post('/addcart', (req, res) => {
    // console.log(req.body)
    userModel.updateOne({ _id: req.body.id },
        { $set: { cartData: req.body.cartData } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Docs : ", docs);
            }
        });
})
router.post('/updatecart', (req, res) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.body.id },
        { $set: { cartData: req.body.cartData } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Docs : ", docs);
                userModel.findOne({ _id: req.body.id }, (err, data) => {
                    let payload = {
                        emailAdd: data.emailAddress,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        phoneNum: data.phoneNumber,
                        password: data.password,
                        photo: data.photo,
                        id: data._id,
                        cartData: data.cartData
                    }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                    res.send(token)
                })
            }
        });
})

router.post('/addaddress', (req, res) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.body.id },
        { $push: { address: { address: req.body.address, city: req.body.city, state: req.body.state, country: req.body.country, pincode: req.body.pincode, address_id: Math.random(), isDeliveryAddress: false } } }, function (err, docs) {
            if (err) {
                console.log(err)
            } else if (docs == null) {
                console.log('sksks')
            }
            else {
                res.json({
                    docs,
                    message: 'Your address has been added',
                    err: 0,
                    "isDeliveryAddress": false,
                    "success": true,
                    "status_code": 200,
                    address: req.body.arr
                })
                console.log({
                    docs,
                    message: 'Your address has been added',
                    err: 0,
                    "isDeliveryAddress": false,
                    "success": true,
                    "status_code": 200,
                })
            }
        });
})
router.post('/getaddress', (req, res) => {
    // console.log(req.body);
    userModel.findOne({ emailAddress: req.body.email }, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            // console.log(data)
            res.json({
                "err": 0,
                "address": data.address,

            })
        }
    })
})
router.post('/deleteaddress', (req, res) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.body.id },
        { $set: { address: req.body.address } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                res.json({
                    docs,
                    message: 'Your address has been Deleted',
                    err: 0,
                    "isDeliveryAddress": false,
                    "success": true,
                    "status_code": 200,
                    address: req.body.address
                })
            }
        });
})
router.put('/updateaddress', (req, res) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.body.id, "address.address_id": req.body.address_id }, { "address.$": req.body }, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                "err": 1,
                "message": "Address Not Found!!"
            })
        }
        else {
            console.log(result);
            res.json({ "err": 0, "message": "You Have Successfuly updated Your shipping address.", "isDeliveryAddress": true, })
        }
    })
})
router.put('/deliveryaddress', (req, res) => {
    console.log(req.body)
    userModel.updateMany({ _id: req.body.id }, { $set: { "address.$[].isDeliveryAddress": false } }
        , (err, result) => {
            if (err) throw err;
            else {
                console.log(result)
            }
        })
    userModel.updateOne({ _id: req.body.id, "address.address_id": req.body.addressId }, { "address.$.isDeliveryAddress": true },
        (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    "err": 1,
                    "message": "Address Not Found!!"
                })
            }
            else {
                console.log({ $ne: req.body.addressId })
                res.json({ "err": 0, "message": "You Have Successfuly updated Your shipping address.", "isDeliveryAddress": true, })
            }
        })
})
router.put('/updaterating', (req, res) => {
    console.log(req.body.productratingvalue)
    let total = 0
    req.body.productRating.forEach(function (item, index) {
        total += item;
    });
    let avg = total / req.body.productRating.length
    console.log(avg)
    productModel.updateOne({ _id: req.body.id },
        { $push: { RatingArray: req.body.productratingvalue } }, function (err, docs) {
            if (err) {
                console.log(err)
                res.json({
                    "err": 1,
                    "message": "Rating Is not updated!!"
                })
            }

            else {
                console.log("Updated Docs : ", docs);
                productModel.updateOne({ _id: req.body.id },
                    { $set: { productRating: avg } }, function (err, docs) {

                        if (err) {
                            console.log(err)
                            res.json({
                                "err": 1,
                                "message": "Rating Is not updated!!"
                            })
                        }
                        else {
                            console.log("Updated Docs : ", docs);
                            res.json({ "err": 0, "message": "You Have Successfuly Updated Your Rating.", docs })
                        }
                    });
            }
        })
})
router.put("/orderdata", (req, res) => {
    let ins = new orderModel({ order: req.body.orders, total: req.body.total, gst: req.body.gst, mainTotal: req.body.mainTotal, userId: req.body.userId, deliveryAddress: req.body.deliveryAddress })
    ins.save(function (err) {
        if (err) {
            console.log(err)
        }
    });
    userModel.updateOne({ _id: req.body.userId },
        { $set: { cartData: [] } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                userModel.findOne({ _id: req.body.userId }, (err, data) => {
                    let payload = {
                        emailAdd: data.emailAddress,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        phoneNum: data.phoneNumber,
                        password: data.password,
                        photo: data.photo,
                        id: data._id,
                        cartData: data.cartData
                    }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                    res.send(token)
                })
            }
        });
})
router.get('/getorder', (req, res) => {
    orderModel.find({}, (err, data) => {
        if (err) throw err;
        res.send(data)
    })

})
module.exports = router;