//Mengimpor
const express = require("express")
const cors = require("cors")

//Mengimplementasikan
const app = express();
app.use(cors())

//End Point Admin
const admin = require ("./routes/admin")
app.use("/admin",admin)

//endpoint customer
const customer = require('./routes/customer');
app.use("/customer", customer)

//endpoint product
const product = require('./routes/product');
app.use("/product", product)

app.listen(8080, () =>{
    console.log("Server run on port 8080");
})
