const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cartSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]
})
const 
cart = mongoose.model('cart',cartSchema)
module.exports=cart;