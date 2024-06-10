const {MongoClient,ObjectId} = require('mongodb')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const { status } = require('express/lib/response')
const saltRound = 10
const url = "mongodb://localhost:27017"
const dbName = "financeManagement"
const SECRET_KEY = 'password-is-password'; 

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
    const dateString = req.body.date;
const [month, day, year] = dateString.split('/').map(Number);
const fullYear = year < 50 ? 2000 + year : 1900 + year; // Assumption: Year is in the 21st century if less than 50, otherwise in the 20th century
const dateObject = new Date(fullYear, month - 1, day);
userData.date = dateObject
console.log(dateObject); // Output: 2024-02-11T00:00:00.000Z

    const result = collection.insertOne({userData})
    res.status(201).json({status:201,message:'transaction successfully completed'})


}
exports.protected = async (req,res)=>{
    
    console.log(req.user.name);
    res.status(201).json({status:201,message:'protected',user:req.user})


}