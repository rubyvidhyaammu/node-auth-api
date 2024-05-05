const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const userRoute = require('./routes/userRoute')
app.use("/api/user",userRoute);

app.get("/",(req,res) => {
    return res.status(401).json({status:false, message:"Unauthenticated."});
})

app.listen(port,()=> console.log(`Server is running on port ${port}`));