const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        next();
    } catch(error) {
        return res.status(401).json({status:false, error:"Unauthenticated."});
    }
}
