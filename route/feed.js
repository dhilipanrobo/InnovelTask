
const express = require('express')
const route = express.Router()
const controllerFeed = require('../controller/feed')
const {vallidateSignup} = require('../middlewares/validationMiddlewares')

route.post('/profile/signup',vallidateSignup,controllerFeed.creatUser);

module.exports = route