const  mongoose  = require("mongoose")

const Schema=mongoose.Schema


const orderSchema = new Schema({
    userId: String,
    name: String,
    billing_address: String,
    city: String,
    district: String,
    state: String,
    zipcode: Number,
    phone: Number,
    payment_option: String,
    products: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }
    ],
    status: String,
    date: {
        type: Date,
        default: Date.now
    },
    totalAmount: Number,
    couponCode: {
        type:String
    }
})

const order=mongoose.model('order',orderSchema)
module.exports=order