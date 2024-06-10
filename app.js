const express = require ('express')
const bodyPasser = require('body-parser')
const rootFeed = require('./route/feed')
const app = express()
const PORT  = 3009

//app.use(bodyPasser.json())
app.use(express.json());
app.use(rootFeed)
app.listen(PORT,()=>{
console.log(`Server Runing Port : ${PORT}`);
})