//impor library
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const md5 = require("md5")

//Mengimplementasikan
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//impor models
const models = require("../models/index")
const admin = models.admin


//End Point Menampilkan Semua Admin method get
app.get("/",(req,res) =>{
    admin.findAll()
     .then(admin => {
          res.json(admin)
    })
     .catch(error => {
          res.json({
            message:error.message
        })
    })
})

//End Point method post 
app.post("/",(req,res)=>{
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }
    admin.create(data)
        .then (result =>{
            res.json({
                message : "data has been inserted"
            })
        })
        .catch(error => {
            message: error.message
        })
})

//End point ubah admin dengan method put
app.put("/:id",(req,res)=>{
    let param = {
        admin_id : req.params.id
    }
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }
    admin.update(data,{where:param})
        .then(result=>{
            res.json({
                message : "data has been updated"
            })
        })
        .catch(error =>{
            res.json({
                message:error.message
            })
        })
})  

//End point menghapus data admin method delete function destroy
app.delete("/:id",(req,res)=>{
    let param = {
        admin_id : req.params.id
    }
    admin.destroy({where:param})
        .then(result=>{
            res.json({
                message : "data has been deleted"
            })
        })  
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

module.exports = app
