const {MongoClient,ObjectId} = require('mongodb')
const bcrypt = require ('bcrypt')
const saltRound = 10
const url = "mongodb://localhost:27017"
const dbName = "financeManagement"
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

exports.creatUser = async (req,res)=>{

//Encritp the password
    await client.connect();
    const db = client.db(dbName)
    const collection = db.collection('users')
    const count = await collection.countDocuments()
    const userData = req.body
    const password = userData.password
    const hashedPassword = await bcrypt.hash(password, saltRound);
    userData.password = hashedPassword
    userData.tid = 1 + count
    const result = await collection.insertOne(userData)
    res.status(201).json({status : 201})
}