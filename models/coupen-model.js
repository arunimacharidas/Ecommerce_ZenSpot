const mongoose=require('mongoose')
const schema=mongoose.Schema

const newCoupenschema=new schema({
    code:{required:true,type:String},
    validity:{type:Date,required:true},
    name:{required:true,type:String},
    minAmount:{type:Number,required:true},
    maxAmount:{type:Number,required:true},
    status:{type:Boolean,default:true},
    perc:{type:Number,required:true}
})

const coupen=mongoose.model('coupen',newCoupenschema)
module.exports=coupen