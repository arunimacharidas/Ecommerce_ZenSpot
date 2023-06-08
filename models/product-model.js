const mongoose = require('mongoose')
const schema = mongoose.Schema

const  productSchema =new schema({
    productTitle:{
        type:String,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },
    productPrice:{
        type:String,
        required:true
    },
    productCategory:{
        type:String,
        required:true
    },
    productQuantity:{
        type:String,
        required:true
    },
    productStockStatus:{
        type:Boolean,
        required:true

    },
    productimage:[]

},{timestamps:true})

const products = mongoose.model('products',productSchema)
module.exports = products;
