function vallidateSignup(req,res,next){

    const { email = "" ,name = "", password = "" } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || username.length < 3 || username.length > 30){
        return res.status(400).json({status:400,message:'invalied name'})
    }
    if (!email || !emailRegex.test(email)){
        return res.status(400).json({status:400,message:'invalied Email'})
    }
    if (!password || username.length < 6){
        return res.status(400).json({status:400,message:'invalied password'})
    }
    next()
}

module.exports = {vallidateSignup}
