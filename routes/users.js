var express = require('express');
var router = express.Router();
// const bycrpt = require('bcrypt')
const { isloggedIn}=require('../middlewares/usermiddleware')
// const db = require('../models/connection')
const userControllers = require('../controllers/userControllers')
const productHelper = require('../helpers/product-helpers');
const productControllers = require('../controllers/productControllers');
router.use(userControllers.homemiddlewares)
/* GET users listing. */
router.get('/', function(req, res, next) {
  const user = req.session.user
  productHelper.showProducts().then((products)=>{
    console.log(products);
    res.render('user/home',{user,products,home:true});  
  })
  
});


router.get('/login',userControllers.login) 
router.post('/login',userControllers.postLogin)

router.get('/signup',userControllers.signup)
router.post('/signup',userControllers.postSignup)

router.get('/logout',isloggedIn,userControllers.Logout)
router.get('/otpphone',userControllers.otplogin)
router.post('/otpphone',userControllers.otpvalidation)
router.post('/otp-verify',userControllers.Otpverify)
router.get('/quickview/:id',userControllers.Oneproduct)
router.post('/resendOtp',userControllers.resendOtp)
router.get('/forgotphone',userControllers.forgottenpassword)
router.post('/forgotphone',userControllers.forgotOtp)
router.post('/forgottenpassword',userControllers.forgotverify)
router.post('/newPassword',userControllers.newpassword)
router.get('/shop',userControllers.getShop)

router.get('/add-cart/:id',isloggedIn,userControllers. addToCart)
router.get('/cart',isloggedIn,userControllers.getCart)
router.get('/cartremove/:id',userControllers.removeproducts)
router.get('/clearcart/:id',userControllers.cartClear)
router.post('/product-quantity-change',userControllers.quantitychange)
router.get('/checkout',isloggedIn,userControllers.getcheckout)
router.post('/checkout',userControllers.postcheckout)
router.post('/change-product-quantity',userControllers.deleteOrder)
router.get('/orderplaced',userControllers.placeOrder)
router.get('/addaddress',isloggedIn,userControllers.getaddress)
router.post('/addaddress',isloggedIn,userControllers.postaddress)
router.get('/singleorder/:id',isloggedIn,userControllers.OneOrder)
router.get('/profile',isloggedIn,userControllers.userprofile)
router.post('/changeOrderStatus',isloggedIn,userControllers.orderdelete)
router.get('/changepass',isloggedIn,userControllers.passchange)
router.post('/changepass',isloggedIn,userControllers.changepass)


router.get('/category_filter/:id',userControllers.category_filter)




// router.get('/home',userControllers.home) 



module.exports = router;
