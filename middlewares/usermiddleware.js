module.exports ={
    isloggedIn:(req,res,next)=>{
        if(req.session.user){
            next();
        }else{
            res.redirect('/login')
        }

    }
}
