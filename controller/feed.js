const {MongoClient,ObjectId} = require('mongodb')
const bcrypt = require ('bcrypt')
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const { status } = require('express/lib/response')
const saltRound = 10
const url = "mongodb://localhost:27017"
const dbName = "financeManagement"
const SECRET_KEY = 'password-is-password'; 
const  nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sendMail = require('../utils/email');



const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

exports.creatUser = async (req,res)=>{
    await client.connect();
    const db = client.db(dbName)
    const collection = db.collection('users')
    const count = await collection.countDocuments()
    const userData = req.body
    const password = userData.password
    //Encritp the password
    const hashedPassword = await bcrypt.hash(password, saltRound);
    userData.password = hashedPassword
    userData.tid = 1 + count
    const result = await collection.insertOne(userData)
    res.status(201).json({status : 201})
}
exports.loginUser = async (req,res)=>{
    await client.connect();
    const db = client.db(dbName)
    const collection = db.collection('users')
    const {email,password} = req.body
    
    const user = await collection.findOne({email})
    if (!user){
        return res.status(400).json({status:400,message:'Invalied user'})
    }
    console.log('find' + user);

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(400).json({status:400,message:'Invalied password'})
    }
    const token = jwt.sign({email:user.email,username:user.name},SECRET_KEY,{expiresIn:'5h'})

    res.status(201).json({status:201,message:'login successfully',token:token})


}
exports.transaction = async (req,res)=>{
    await client.connect
    const db = client.db(dbName)
    const collection = db.collection('transaction')
    const userData = req.body
    const count = await collection.countDocuments()
    userData.tid = count + 1000
    userData.email = req.user.email
    const dateString = req.body.date;
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${20}${year}-${month}-${day}`);
    userData.date = date
    const result = await collection.insertOne({userData})
    res.status(201).json({status:201,message:'transaction successfully completed'})
}

exports.transactionHistoryLast10 = async(req,res)=>{
    await client.connect
    const db = client.db(dbName)
    const collection = db.collection('transaction')
    console.log('email' + req.user.email);
    const lastTenTractions = await collection.aggregate([{"$match": {"userData.email": req.user.email}}, { "$sort": {"userData.tid": -1}},{"$limit": 10}]).toArray()
    res.status(201).json({res:lastTenTractions,message: "transaction successfully completed"})
      
}
exports.totalAmount = async(req,res)=>{
    await client.connect
    const db = client.db(dbName)
    const collection = db.collection('transaction')
    console.log('email' + req.user.email);
    const lastTenTractions = await collection.aggregate([{"$match": {"userData.email": "dhilipan@gmai.com"}},{ "$group": { "_id": {"email": "$userData.email", "accountType": "$userData.type"},"totalAmount":{"$sum":"$userData.amount"}}},
    {"$project":{"_id":0,"email": "$_id.email", "accountType": "$_id.accountType","totalAmount": "$totalAmount"}}]).toArray()
    res.status(201).json({res:lastTenTractions,message: "transaction successfully completed"})
      
}
exports.forgotPassword = async(req,res)=> {
    await client.connect
    const email = req.body.email
    const subject = 'Password Reset OTP';
    const otp = generateOtp()
    const text = `Your OTP for password reset is: ${otp}`;
    await sendMail(email, subject, text);
    res.status(201).json({message: "transaction successfully completed"})
}
exports.filterByDate = async (req,res)=>{
    await client.connect
    const db = client.db(dbName)
    const collection = db.collection('transaction')
    const userData = req.body
    const email = req.user.email
    const startDate = req.query.startdate;
    const endtDate = req.query.enddate;
    
    const [sday,smonth, syear] = startDate.split('/');
    const sdate = new Date(`${20}${syear}-${smonth}-${sday}`);
    const [eday, emonth, eyear] = endtDate.split('/');
    const edate = new Date(`${20}${eyear}-${emonth}-${eday}`);
    
    const result = await collection.find({"userData.email": email,"userData.date":{ $gte: sdate,$lte:edate}}).toArray()
    res.status(201).json({status:201,message:'transaction successfully completed',data:result})
}

exports.updatetransaction = async (req,res)=>{
    await client.connect
    const db = client.db(dbName)
    const collection = db.collection('transaction')
    const userData = req.body
    const tid = req.query.tid
    const email = req.user.email
    const dateString = req.body.date;
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${20}${year}-${month}-${day}`);
    userData.date = date
    console.log(tid);
    const result = await collection.updateOne({"userData.email":email,"userData.tid": tid},{$set:{'userData.type': userData.type ,'userData.amount':userData.amount,'userData.description':userData.description}})
    res.status(201).json({status:201,message:'transaction successfully completed',result:(await result).modifiedCount})
}

function generateOtp() {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
  }


exports.protected = async (req,res)=>{
    
    console.log(req.user.username);
    res.status(201).json({status:201,message:'protected',user:req.user})
}