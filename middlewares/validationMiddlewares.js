
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'password-is-password'; 

function vallidateSignup(req,res,next){

    const { email = "" ,name = "", password = "" } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 3 || name.length > 30){
        return res.status(400).json({status:400,message:'invalied name'})
    }
    if (!email || !emailRegex.test(email)){
        return res.status(400).json({status:400,message:'invalied Email'})
    }
    if (!password || password.length < 6){
        return res.status(400).json({status:400,message:'invalied password'})
    }
    next()
}
function vallidateLogin(req,res,next){

    const { email = "" , password = "" } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)){
        return res.status(400).json({status:400,message:'invalied Email'})
    }
    if (!password || password.length < 6){
        return res.status(400).json({status:400,message:'invalied password'})
    }
    next()
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

module.exports = {vallidateSignup,vallidateLogin,authenticateToken}
