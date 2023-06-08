const multer=require('multer')
const storage=multer.diskStorage({
    destination:'public/images/products_image',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + Math.random() * 900 + file.originalname)
    }
})
const upload=multer({
    storage:storage
})



module.exports=upload
