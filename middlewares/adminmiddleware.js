module.exports ={
    isadminloggedIn:(req,res,next)=>{
        if(req.session.admin){
            next();
        }else{
            res.render('admin/admin-login', { layout: false });

    }
    }
}