const userModel = require("../models/user-model")
const ordermodel=require('../models/order-models')
module.exports = {
    getAllusers: () => {
        return new Promise((resolve, reject) => {
            userModel.find().then((Allusers) => {
                console.log(Allusers)
                resolve(Allusers)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })

        })
    },
    /********************all users******************* */

    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ _id: id })
            if (user.status === true) {
                userModel.findOneAndUpdate({ _id: id }, { $set: { status: false } },{new:true}).then((newuser) => {
                    console.log(newuser, 'aruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
                })
            } else {
                userModel.findOneAndUpdate({ _id: id }, { $set: { status: true }},{new:true}).then((newuser) => {
                    console.log(newuser, 'sandeeeeeppppppppppppppppppppppppp')

                })
            }
            resolve()
        })
    },
    getallorders: () => {
        return new Promise(async (resolve, reject) => {
            await ordermodel.find().then((orders) => {
                resolve(orders)
            }).catch(() => {
                reject()
            })
        })
    },
    ChangeOrderstatus:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            })
        })
    }
    /**************************blockuser********************************* */

 
}











