var express = require('express')
var app = express()
var BillBoard = require('billboard-hot-100')
var port = process.env.PORT||8080
BillBoard.init().then(function(billboard){
  var bodyParser = require('body-parser')
  var mainRouter = require('./router/main-router')(billboard)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended:true}))
  app.use('/api',mainRouter)
  app.listen(port,()=>{
    console.log("started server")
  })
}).catch(function(err){
    console.log("error getting billboard details")
})
