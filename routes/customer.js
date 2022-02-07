//import express
const express = require("express")
const app = express()
app.use(express.json())
 
// import md5
const md5 = require("md5")
 
//import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")
 
//import model
const models = require("../models/index")
const customer = models.customer

//config storage image 
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./image/customer")
    },
    filename:(req,file,cb)=>{
        cb(null, "img-" +Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage:storage})

//Menampilkan semua data customer dengan method GET
app.get("/", (req, res) =>{
    customer.findAll()
        .then(result => {
            res.json({
                customer: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

//Menampilkan semua data customer dengan method GET berdasarkan id
app.get("/:customer_id", (req, res) =>{
    customer.findOne({ where: {customer_id: req.params.customer_id}})
    .then(result => {
        res.json({
            customer: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})
 
//Menambah data customer dengan method POST
app.post("/",upload.single("image"),(req,res)=>{
    if(!req.file){
        res.json({
            message:"No Uploaded fle"
        })
    }else {
        let data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename,
            username: req.body.username,
            password: md5(req.body.password)
        }
        customer.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})

module.exports = app