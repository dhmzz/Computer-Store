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
const product = models.product

//config storage image 
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./image/product")
    },
    filename:(req,file,cb)=>{
        cb(null, "img-" +Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage:storage})

//Menampilkan semua data product dengan method GET
app.get("/", (req, res) =>{
    product.findAll()
        .then(result => {
            res.json({
                product: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

//Menampilkan semua data product dengan method GET berdasarkan id
app.get("/:product_id", (req, res) =>{
    product.findOne({ where: {product_id: req.params.product_id}})
    .then(result => {
        res.json({
            product: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//Menambah data product dengan method POST
app.post("/",upload.single("image"),(req,res)=>{
    if(!req.file){
        res.json({
            message:"No Uploaded fle"
        })
    }else {
        let data = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename,
        }
        product.create(data)
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

// Update data PRODUCT, method PUT
app.put("/:id", upload.single("image"), (req, res) =>{
    let param = { product_id: req.params.id}
    let data = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    }
    if (req.file) {
        // get data by id
        const row = product.findOne({where: param})
        .then(result => {
            let oldFileName = result.image
           
            // delete old file
            let dir = path.join(__dirname,"../image/product",oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })
 
        // set new filename
        data.image = req.file.filename
    }
 
    product.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// Hapus data PRODUCT, method DELETE
app.delete("/:id", async (req, res) =>{
    try {
        let param = { product_id: req.params.id}
        let result = await product.findOne({where: param})
        let oldFileName = result.image
           
        // delete old file
        let dir = path.join(__dirname,"../image/product",oldFileName)
        fs.unlink(dir, err => console.log(err))
 
        // delete data
       product.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
 
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = app