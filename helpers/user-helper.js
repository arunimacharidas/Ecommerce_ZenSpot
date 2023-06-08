const { resolveInclude } = require('ejs');
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const accountSid = 'AC2c8b8738c611568527d76c9c6ecd8fc6';
const authToken = '5a18cc2d92b67f464e96bad33830d3dd';
const productModel = require('../models/product-model');
const ordermodel = require('../models/order-models')
const { response } = require('express');
const categoryModel = require('../models/category-models');

const client = require('twilio')(accountSid, authToken);


module.exports = {
    postSignup: (data) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ email: data.Email }).then((userExist) => {
                if (userExist) {
                    reject()
                } else {
                    bcrypt.hash(data.password, 10, (err, hashpass) => {
                        if (err) {
                            console.log(err);
                            reject()
                        } else {
                            new userModel({
                                name: data.Name,
                                password: hashpass,
                                email: data.Email,
                                phone: data.Number
                            }).save().then((newuser) => {
                                resolve(newuser)
                            }).catch((err) => {
                                reject(err)
                            })
                        }
                    })
                }
            })
        })

    },
/****************************signup******************************** */
    postLogin: (loginData) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ email: loginData.Email, status: true }).then((user) => {
                if (!user) {
                    reject()
                } else {
                    bcrypt.compare(loginData.Password, user.password).then((status) => {
                        if (status) {
                            let response = {}
                            response.user = user,
                                response.status = status
                            resolve(response)
                        } else {
                            reject()
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        })
    } ,
    /**********************opt gernerate******************************************** */

    otpGenerate: (phonenumber) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ phone: phonenumber, status: true }).then((user) => {
                if (user) {
                    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
                        .verifications
                        .create({ to: `+91${user.phone}`, channel: 'sms' })
                        .then(verification => console.log(verification.status))
                        .catch(error => {

                            console.log(error.message);
                        })
                    resolve()
                } else {
                    reject()

                }
            })
        })
    },
    /************************otp verify***************************** */
    Otpverify: (req, res) => {
        console.log("fregillllllllllllllllllllllllll")


        //  userHelper.verifyOtp(otp,phone).then((response)=>{
        //    console.log(response, "response from otp login")
        //    if(response.status){
        //      console.log(response.status,'ldskfldkfldksf')
        //      req.session.user = response.user
        //      res.redirect('/')
        //    }else{
        //      let Err= "invalid otp"
        //      res.render('user/otp',{layout:false,Err})
        //    }
        //  }).catch((Err)=>{
        //    console.log(Err)
        //    res.redirect('user/signup')
        //  })

    },
    /***********************single product******************************** */
    ProductSingle: (id) => {
        return new Promise((resolve, reject) => {
            productModel.findOne({ _id: id }).then((OneProduct) => {
                resolve(OneProduct)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    /**************************forgotten password******************************* */
    forgottenpasswordGenerate: (phonenumber) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ phone: phonenumber, status: true }).then((user) => {
                if (user) {
                    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
                        .verifications
                        .create({ to: `+91${user.phone}`, channel: 'sms' })
                        .then(verification => console.log(verification.status))
                        .catch(error => {

                            console.log(error.message);
                        })
                    resolve()
                } else {
                    reject()

                }
            })
        })



    },
    /*************************verify password******************** */
    forgotverify: (req, res) => {
        console.log("fregillllllllllllllllllllllllll")


    },
    /*******************resetpassword*************************** */
    newpassword: async (password, phone) => {
        return new Promise((resolve, reject) => {
            if (password) {
                bcrypt.hash(password, 10, (err, hashpass) => {
                    if (err) {
                        console.log(err);
                        reject()
                    } else {
                        console.log(hashpass);
                        userModel.updateOne({ phone: phone }, {
                            $set: {
                                password: hashpass
                            }
                        }).then((response) => {
                            console.log(response);
                            resolve()
                        })
                            .catch((err) => {
                                reject(err)
                            })


                    }
                })
            }

        })





    },
    /****************products******************************** */
    getProducts: (pageNum) => {
        return new Promise((resolve, reject) => {
                const perPage = 4;
                const skipCount = (pageNum - 1) * perPage;
                productModel.countDocuments({}).then((totalCount) => {
                    const totalPages = Math.ceil(totalCount / perPage);
                    console.log(totalPages, totalCount);
                  
                    productModel.find()
                      .sort({ createdAt: -1 })
                      .skip(skipCount)
                      .limit(perPage)
                      .then((response) => {
                        // Process the retrieved products
                        console.log(response);
                        

                        resolve({products:response,totalPages})
                        // Perform further operations with the retrieved products
                      })
                      .catch((err) => {
                        console.error(err);
                        // Handle the error
                      });
                  });
                  
        })
    },
    placeOrder: (order, Products) => {
        order.totalamount=parseInt(order.totalamount)
        
        let newproducts = Products.map((product) => ({
            id: product.productId,
            quantity: product.quantity
        }));
        return new Promise((resolve, reject) => {
            let Status = order.payment_option === 'cod' ? 'placed' : 'pending';
            userModel.findById(order.userId).then((user)=>{
                new ordermodel({
                    userId: order.userId,
                    state: order.state,
                    name: order.name,
                    billing_address: order.billing_address,
                    zipcode: order.zipcode,
                    status: Status,
                    totalAmount: order.totalamount,
                    city: order.city,
                    date: new Date(),
                    district: order.district,
                    payment_option: order.payment_option,
                    phone: order.phone,
                    products: newproducts
                }).save().then(async(newOrder) => {
                    user.address=await newOrder.save()
                    console.log(user.address,'++++++++++++++>>>>>>>>>>++++++++++>>>>>>><<<<<<<<<<<<<+++++++++>>>>>>>>>>>');
                    resolve(newOrder);
                }).catch(() => {
                    reject();
                });

            })

        });
    },
    DeleteOrders:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            }).catch((err)=>{
                reject()
            })
        })
    },
    PostAddress:(address,id)=>{
        return new Promise((resolve,reject)=>{
            userModel.findById(id).then((user)=>{
                user.address.push(address)
                user.save()
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    },
    getOneOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            ordermodel.findById(orderId).populate('products.id').exec().then((order) => {
                const products = order.products.map(product => {
                    if (product.id) {
                        return {
                            id: product.id._id,
                            name: product.id.productTitle,
                            description: product.id.productDescription,
                            category: product.id.productCategory,
                            price: product.id.productPrice,
                            quantity: product.quantity,
                            images: product.id.productimage[0]
                        }
                    }
                });
                console.log(products);
                const orderDetails = {
                    id: order._id,
                    userId: order.userId,
                    name: order.name,
                    billingAddress: order.billing_address,
                    city: order.city,
                    state: order.state,
                    zipcode: order.zipcode,
                    phone: order.phone,
                    paymentOption: order.payment_option,
                    status: order.status,
                    products: products,
                    date: order.date,
                    totalAmount: order.totalAmount,
                    images:order.images
                }
                resolve(orderDetails)
            }).catch((err) => {
                reject(err)
            })
        });
    },
    
    addToWishlist: function (userId, productId) {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishlistModel.findOne({ id: userId })
            if (wishlist) {
                await wishlistModel.findOneAndUpdate(
                    { id: userId },
                    { $addToSet: { products: productId } },
                    { new: true }
                )
                resolve()
            } else {
                wishlist = new wishlistModel({
                    id: userId,
                    products: [productId]
                })
                await wishlist.save()
                resolve()
            }
        })
    },
    getOrders: (id) => {
        return new Promise(async (resolve, reject) => {
            await ordermodel.find({ userId: id }).then((orders) => {
                resolve(orders)
            }).catch(() => {
                reject()
            })
        })
    },
    DeleteOrders:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            }).catch((err)=>{
                reject()
            })
        })
    },
    ChangePass: (num, pass) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pass, 10, (err, hashedpassword) => {
                if (err) {
                    reject()
                }
                userModel.updateOne({ phone: num }, { $set: { password: hashedpassword } }).then((status) => {
                    resolve(status)
                }).catch(() => {
                    reject()
                })
            })
        })
    },
    
}  
