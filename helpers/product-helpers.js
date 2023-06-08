const productModel = require("../models/product-model");
const categoryModel = require("../models/category-models");
const { Oneproduct } = require("../controllers/userControllers");
const category = require("../models/category-models");

module.exports = {
    getAllCategory: () => {
        return new Promise((resolve, reject) => {
            categoryModel.find().then((categories) => {
                // console.log(categories)
                resolve(categories)
            }).catch((error) => {
                console.log(error);
                reject(error)
            })
        })
    },
    /************************catrgory************************* */

    addNewcategory: (body) => {
        return new Promise(async(resolve, reject) => {
            await categoryModel.findOne({
                name:{'$regex':`${body.category}`,'$options':'i'}
              }).then((categoryExist) => {
                console.log(categoryExist);
                console.log("categoryExist");
                if (categoryExist) {
                    resolve({status:false})
                } else {
                    new categoryModel({
                        name: body.category
                    }).save().then((newCategory) => {
                        console.log(newCategory);
                        console.log("newcategory");
                        resolve({status:true ,data:newCategory})
                        
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                }
            })
        })
    },
/**************************************addcategory********************** */
    DisplayAllcategory: () => {
        return new Promise((resolve, reject) => {
            categoryModel.find().then((allCategory) => {
                resolve(allCategory)
            }).catch((error) => {
                console.log(error)
                reject(error)
            })
        })
    },
    geteditcategory:(id)=>{
        return new Promise((resolve,reject)=>{
            categoryModel.findById(id).then((category)=>{
                resolve(category)
            }).catch((error)=>{
                reject()
            })
        })

    },
    changecategory:(id,category)=>{
        return new Promise((resolve,reject)=>{
            categoryModel.updateOne({name:id},{
                $set:{name:category}
            }).then(()=>{
                productModel.updateMany({productCategory:id},{
                    $set:{productCategory:category}
                }).then(()=>{
                    resolve()
                })
            }).catch((error)=>{
                reject();
            })

        })
    },
    statuschange:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let category = await categoryModel.findById(id)
            productModel.find({productCategory:category.name}).then((products)=>{
                if(products.length == 0){
                    category.status = !category.status
                    category.save()
                    resolve()
                }else{
                    reject()
                }
            }).catch((error)=>{
                reject()
            })
        })

    },

    addProducts: (product, image) => {
        return new Promise((resolve, reject) => {
            const newproducts = new productModel({
                productTitle: product.name,
                productDescription: product.description,
                productCategory: product.category,
                productQuantity: product.quantity,
                productPrice: product.price,
                productimage: image,
                productStockStatus: true

            })
            newproducts.save()
            resolve()
        })
    },
/************************************singleproduct************************** */
    singleProduct: (id) => {
        return new Promise((resolve, reject) => {
            productModel.findOne({ _id: id }).then((product) => {
                if (product) {
                    resolve(product)
                } else {
                    reject()
                }

            })
        }).catch((err) => {

        })

    },
    /***********************editproduct************************** */

    editProduct: (id, product, images) => {

        if (images) {
            return new Promise((resolve, reject) => {
                productModel.updateOne({ _id: id }, {
                    $set: {
                        productPrice: Number(product.price),
                        productQuantity: Number(product.quantity),
                        productCategory: product.category,
                        productStockStatus: true,
                        productimage: images,
                        productTitle: product.name,
                        productDescription: product.description
                    }

                }).then(() => {
                    resolve()
                })
            }).catch((error) => {
                reject()
            })
        } else {
            return new Promise((resolve, reject) => {
                productModel.updateOne({ _id: id }, {
                    $set: {
                        productPrice: Number(product.productPrice),
                        productQuantity: Number(product.productQuantity),
                        productCategory: product.productCategory,
                        productStockStatus: true,
                        productTitle: product.productTitle,
                        productDescription: product.productDescription
                    }
                }).then(() => {
                    resolve()
                })
            }).catch((error) => {
                reject()
            })
        }

    },
/************************************blockproduct****************************** */
    blockProduct: (id) => {
        console.log(id);
        return new Promise(async (resolve, reject) => {
            const item = await productModel.findOne({ _id: id })
            if (item) {
                item.productStockStatus = !item.productStockStatus
            }
            item.save().then(() => {
                resolve()
            }).catch(() => {
                reject()
            })

        })
    },
    /*********************************show product*********************** */

    showProducts: () => {
        return new Promise((resolve, reject) => {
            productModel.find().sort({createAt:-1}).then((products) => {
                resolve(products)
            }).catch((error) => {
                console.log(error)
                reject(error)
            })
        })
    }
    

}




