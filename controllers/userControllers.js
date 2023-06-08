
const { trusted } = require('mongoose')
const userHelper = require('../helpers/user-helper')
const productHelpers = require('../helpers/product-helpers')
const accountSid = 'AC2c8b8738c611568527d76c9c6ecd8fc6';
const authToken = '5a18cc2d92b67f464e96bad33830d3dd';
const userModel = require('../models/user-model')
const cartHelpers = require('../helpers/Cart_helpers');
const Cart_helpers = require('../helpers/Cart_helpers');
const cart = require('../models/cart-model');
const adminControl = require('../controllers/adminControllers')
const couponHelpers = require('../helpers/coupon-helpers');
const client = require('twilio')(accountSid, authToken);
const categorySchema=require('../models/category-models')

const productSchema=require('../models/product-model')
module.exports = {
  homemiddlewares:(req,res,next)=>{
    const userId = req.session.user?._id
    if(userId){
        cartHelpers.getCartCount(userId).then((cartcounts) => {
      res.locals.cartcount=cartcounts
  })
    }
      next();
    
  
  },
/*************login *************** */
  login: function (req, res) {
    if (req.session.user) {
      res.redirect('/')
    } else {
      res.render('user/login')
    }
  },
/****************signup*************** */
  signup: function (req, res, next) {

    res.render('user/signup')
  },
/*****************postsigup***********/
  postSignup: async (req, res) => {
    let data = req.body
    console.log(data);
    userHelper.postSignup(data).then((newuser) => {
      req.session.user = newuser
      console.log(req.session.user);
      res.redirect('/login')
    }).catch((err) => {
      res.redirect('/signup')
    })
  },
  /***************postlogin************ */

  postLogin: (req, res) => {
    let user = req.body

    userHelper.postLogin(user).then((status) => {
      console.log(status, "user status before login");
      if (status) {
        req.session.user = status.user

        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    }).catch((err) => {
      res.redirect('/login')
    })

  },
  /***********logout***************** */

  Logout: (req, res) => {
    req.session.user = null;
    res.redirect('/')
  },
  /**************otplogin************* */
  otplogin: function (req, res) {
    res.render('user/otpphone', )

  },
  /********************otpvalidation****** */
  otpvalidation: function (req, res) {
    const phonenumber = req.body.Number
    req.session.phone = phonenumber
    userHelper.otpGenerate(phonenumber).then((response) => {
      res.render('user/otp', )
    }).catch((err) => {
      console.log(err)
      res.redirect('/login')
    })
  },
  /**********otp verfication******** */
  Otpverify: async (req, res) => {
    console.log("fregillllllllllllllllllllllllll")
    const otp = req.body.otp
    const phone = req.session.phone

    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
      .verificationChecks
      .create({ to: `+91${phone}`, code: otp })
      .then(async (verification) => {
        // console.log(verification);
        if (verification.status === 'approved') {
          const user = await userModel.find({ phone: phone })
          req.session.user = user
          res.redirect('/')
        } else {
          let Err = "invalid otp"
          res.render('user/otp', {  Err })
        }
      });


  },
  /**********single product*************** */

  Oneproduct: (req, res) => {
    const id = req.params.id;
    console.log(id, 'njccdnncdndcndnnnvn');

    userHelper.ProductSingle(id)
      .then((Oneproduct) => {
        res.render('user/singleproduct', { Oneproduct });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });
/*****************resend otp***************** */

  }, resendOtp: (req, res) => {
    const phone = req.session.phone
    console.log(phone);
    userHelper.otpGenerate(phone).then(() => {
      res.send()
    })
  },

  /*************************forgottenpassword********** */
  forgottenpassword: function (req, res) {
    res.render('user/forgotphone')

  },
  /********forgototp************ */
  forgotOtp: function (req, res) {
    const phonenumber = req.body.Number
    req.session.phone = phonenumber
    userHelper.forgottenpasswordGenerate(phonenumber).then((response) => {
      res.render('user/forgottenOtp', { layout: false })
    }).catch((err) => {
      console.log(err)
      res.redirect('/login')
    })
  },
  /*****************forgotverify************ */
  forgotverify: async (req, res) => {
  
    const otp = req.body.otp
    const phone = req.session.phone
    console.log(phone);
    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
      .verificationChecks
      .create({ to: `+91${phone}`, code: otp })
      .then(async (verification) => {
        console.log(verification);
        if (verification.status === 'approved') {
          const user = await userModel.find({ phone: phone })
          req.session.user = user
          res.render('user/forgottenpassword')
        } else {
          let Err = "invalid otp"
          res.render('user/forgottenOtp', { layout: false, Err })
        }
      }).catch(error => {
        console.log(error);
      })


  },
  /*****************resendotp********** */
  resendOtp: (req, res) => {
    const phone = req.session.phone
    console.log(phone);
    userHelper.forgottenpasswordGenerate(phone).then(() => {
      res.send()
    })



  },
  /**************newpasswod setting********** */
  newpassword: (req, res) => {
    const phone = req.session.phone
    console.log(phone,req.body.password);
    userHelper.newpassword(req.body.password,phone).then(()=>{
      res.redirect('/login')
    })
  },
  /*********************shop************/ 
  getShop: async (req, res) => {
    try {
      let page = req.query.page ?? 1;
      const response = await userHelper.getProducts(page);
      let products = response.products;
      let pages = response.totalPages;
  
      const category = await categorySchema.find();
      console.log("0909", category, "0909");
  
      res.render('user/shop', { products, shop: true, pages, page,category });
    } catch (error) {
      // Handle any errors that occur during the execution
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  ,
  addToCart: (req, res) => {
    const id = req.params.id;
    const userId = req.session.user._id;
    console.log(userId,'/////////////////////////////////////////////////////////////');
    cartHelpers.CartAdd(id, userId).then(() => {
      cartHelpers.getCartCount(userId).then((cartcount) => {
            res.json({ status: true, cartcount: cartcount })
        })

    }).catch((err) => {
      console.log(err.message);
        res.redirect('/')
    })
},
getCart: (req, res) => {
    if (req.session.user) {
        const user = req.session.user
        const id = user._id
        console.log(id,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.');
        cartHelpers.getaddcart(id).then((prod) => {
            cartprod = prod.cartprod
            prod = prod.result
            res.render('User/cart', { prod, user, cartprod })
        }).catch((err) => {
            res.render('User/cart', { prod: false })
        })
    } else {
        res.redirect('/login')
    }
},

category_filter: async (req, res) => {
  try {
    const id = req.params.id;
    const pageSize = 1;
    const category = await categorySchema.findOne({ _id: id }); // Find the category by ID
    console.log(category,"0090");

    const products = await productSchema.find({ productCategory: category.name }); // Find products with matching category
    console.log(products,"0-----");
    const pages = Math.ceil(products.length / pageSize); // Calculate the number of pages based on the number of products

    res.render('user/shop2', { category, products, pages }); // Render the 'user/shop' view with the category, products, and pages data
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
},
removeproducts: (req, res) => {
    const user = req.session.user._id
    const id = req.params.id
    cartHelpers.ProductRemove(id, user).then(() => {
        res.redirect('/cart')
    }).catch((err) => {
        res.redirect('/cart')
    })
},
cartClear: (req, res) => {
    const user = req.session.user._id
    cartHelpers.Cartempty(user).then((response) => {
        res.redirect('/cart')
    }).catch((err) => {
        res.redirect('/shop')
    })
},
quantitychange: (req, res) => {
    console.log(req.body.cart)
    cartHelpers.changeQuantity(req.body).then((response) => {
        res.json(response)
    }).catch((err) => {
        console.log(err);
    })
},
getcheckout: (req, res) => {
  const user = req.session.user
  
  const address=user.address
  console.log(address,'///////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  cartHelpers.getaddcart(user._id).then((prod) => {
   
          let  cartprod = prod.cartprod
          prod = prod.result
            couponHelpers.Allcoupon().then((coupens) => {
            console.log(coupens,':::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>')
            
           
            res.render('User/checkout', { user, prod, cartprod, coupens, address })
        })


  })
},
postcheckout: async (req, res) => {
  let products = await cartHelpers.getCartProducts(req.body.userId)
  userHelper.placeOrder(req.body, products).then((response) => {
      if (response.payment_option === 'cod') {
       cartHelpers.Cartempty (req.body.userId).then(() => {
              res.json({ cod: true })
          })
      }
       else if(response.payment_option === 'online') {
          const total = req.body.totalamount
          const orderId = response._id;
          console.log(total,orderId,'fgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfg');
          cartHelpers.generateRazorpay(orderId, total).then((order) => {
            console.log(order,'kllllllllllllllllllllllllllllllll');
              res.json(order)
          })
      }
  }).catch((error) => {
      console.log(error);
      res.redirect('/shop')
  });
},
deleteOrder: (req, res) => {
 userHelper. DeleteOrders(req.body).then((response)=>{
      res.json(response)
  }).catch(()=>{
      res.render('User/Page-404')
  })
},
placeOrder: (req, res) => {
  res.render('user/order-placed')
},
getaddress: (req, res) => {
  res.render('User/addaddress')
},
postaddress: (req, res) => {
  const address = req.body
  const id = req.session.user._id
 userHelper. PostAddress(address, id).then(() => {
      res.redirect('/addaddress')
  }).catch(() => {
      res.render('User/Page-404')
  })
},
OneOrder: (req, res) => {
  const id = req.params.id
  userHelper.getOneOrder(id).then((orderdetails) => {
    console.log(orderdetails,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
      let total = 0
      res.render('user/order_view', { orderdetails, total })
  })
},
userprofile: (req, res) => {
  const user = req.session.user
  userHelper.getOrders(user._id).then((orders) => {
      res.render('User/Profile', { user, orders })
  }).catch(() => {
      res.redirect('/')
  })
},
orderdelete: (req, res) => {
 userHelper. DeleteOrders(req.body).then((response) => {
      res.json(response)
  }).catch(() => {
      res.render('User/Page-404')
  })
},
changepass: (req, res) => {
  console.log('<<<<<<<<<<<<>>>>>>>>>>>>>>');
  const number = req.body.Number
  const password = req.body.password
 userHelper. ChangePass(number, password).then((response) => {

      res.redirect('/login')
  }).catch(() => {
      res.render('user/Page-404')
  })
},
passchange: (req, res) => {
  const number= req.session.user.phone
  console.log('//////////');
  console.log(req.session.user);
  res.render('user/changepass',{number})
},

 



}