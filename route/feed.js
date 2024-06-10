
const express = require('express')
const route = express.Router()
const controllerFeed = require('../controller/feed')
const {vallidateSignup,vallidateLogin,authenticateToken} = require('../middlewares/validationMiddlewares')

route.post('/profile/signup',vallidateSignup,controllerFeed.creatUser);
route.post('/profile/login',vallidateLogin,controllerFeed.loginUser);
route.get('/profile/protected',authenticateToken,controllerFeed.protected);
route.post('/finance/transaction',authenticateToken,controllerFeed.transaction);

module.exports = route