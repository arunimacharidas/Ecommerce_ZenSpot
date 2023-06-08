const {response}=require('express')
const cartModel = require('../models/cart-model');
const userControllers = require('../controllers/userControllers');
const { Reject } = require('twilio/lib/twiml/VoiceResponse');
const objectId = require('mongoose').objectId
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id:'rzp_test_gSKuhb79bBJ2df',
    key_secret:'tl9u7v8q2HYW6g0o0GFWjgcw',
});
module.exports = {
    CartAdd: (id, userId) => {
        console.log(id);
        return new Promise(async (resolve, reject) => {

            const cartExist = await cartModel.findOne({ userId: userId })
            if (!cartExist) {
                const newcart = new cartModel({
                    userId: userId,
                    products: [{
                        productId: id,
                        quantity: 1
                    }]

                }).save()
                resolve()

            } else {

                let itemIndex = cartExist.products.findIndex(item => item.productId.toString() === id)
                if (itemIndex >= 0) {
                    cartExist.products[itemIndex].quantity += 1;
                } else {
                    cartExist.products.push({ productId: id, quantity: 1 })
                }
                cartExist.save()
                resolve();
            }

        }).catch((error) => {
            reject(error)
        })
    },
    getaddcart: (id) => {
        return new Promise((resolve, reject) => {
            const userCart = cartModel.findOne({ userId: id })
            console.log(userCart.userId,'{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{');
            if (!userCart) {

                reject()

            } else {
                userCart.populate({
                    path: 'products.productId',
                    select: 'productTitle productDescription productimage productPrice  _id'

                }).exec().then((cartItems) => {
                    if (!cartItems) {
                       cartItems = new cartItems({
                            userId: id,
                            products: []

                        })
                    }
                    let cartprod = cartItems.products
                    cartItems = cartItems.products
                    let subtotal;
                    let totalAmount = 0;
                    cartItems.forEach(item => {

                        subtotal = item.quantity * item.productId.productPrice;
                        item.subTotal = subtotal
                        totalAmount += subtotal

                    })
                    let result = {
                        userId: id,
                        cartItems: cartItems,
                        totalAmount: totalAmount
                    }

                    if (!result) {
                        reject()
                    } else {
                        resolve({ result, cartprod });
                    }

                }).catch((error) => {
                    console.log(error)
                    reject()
                })
            }

        })
    },
    ProductRemove: (proid, Id) => {
        return new Promise(async (resolve, reject) => {
            const userCart = await cartModel.findOne({ userId: Id })
            if (userCart) {
                let itemIndex = userCart.products.findIndex(item => item.productId.toString() === proid)
                if (itemIndex >= 0) {
                    let response = {}
                    response = userCart.products.splice(itemIndex, 1)
                    console.log();
                    await userCart.save().then(() => {
                        resolve()
                    })
                }
            } else {
                reject()
            }
        }).catch((error) => {
            console.log(error);
            reject()
        })


    },
    Cartempty: (id) => {
        return new Promise(async (resolve, reject) => {
            const userCart = await cartModel.findOne({ userId: id })
            if (userCart) {
                userCart.deleteOne().then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject()
                })
            }
        })
    },
    getCartCount: (id) => {
        return new Promise(async (resolve,reject) => {
            let cart = await cartModel.findOne({ userId: id })
            console.log(cart,']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]');
            let cartcount = 0

            if (cart?.products?.length>0) {
                cartcount = cart.products.length
                resolve(cartcount)
            }else{

                resolve(cartcount)
            }
            
           
        })
    },
    changeQuantity: (details) => {
        details.qntcount = parseInt(details.qntcount)
        details.quantity = parseInt(details.quantity)
        return new Promise(async (resolve, reject) => {
            let response
            let cart = await cartModel.findOne({ userId: details.cart })
            if (cart) {
                let itemIndex = cart.products.findIndex(item => item.productId.toString() === details.product)

                if (itemIndex >= 0) {
                    if (details.quantity == 1 && details.qntcount == -1) {
                        cart.products.splice(itemIndex, 1)
                        cart.save().then(() => {
                            response = { removeProd: true }
                            resolve(response)
                        }).catch(() => {
                            reject()
                        })

                    } else {
                        cart.products[itemIndex].quantity += details.qntcount
                        cart.save().then(() => {
                            response = { status: true }
                            resolve(response)
                        }).catch(() => {
                            reject()
                        })
                    }
                }

            }


        })
    },
    getCartProducts: (user) => {
       return new Promise((resolve, reject) => {
            cartModel.findOne({ userId: user }).then((cart) => {

                resolve(cart.products)
           })
       })
     },
     generateRazorpay:(orderId,total)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: total*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+orderId
              };
              instance.orders.create(options, function(err, order) {
                if(err){

                }else{
                    resolve(order)
                }
              });
        })
    },
             
}