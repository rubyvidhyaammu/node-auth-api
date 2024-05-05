
const database = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req,res) => {
    try {

        let { name, email, password, confirm_password} = req.body;
        
        if(!name || !email || !password || !confirm_password) {
            return res.status(422).json({status:false, message:"Validation error", error:"Please enter all the fields"}); 
        }

        if(password.length < 6) {
            return res.status(422).json({status:false, message:"Validation error", error:"Password must be minimum 6 characters"}); 
        }

        if(password != confirm_password) {
            return res.status(422).json({status:false, message:"Validation error", error:"Password mismatch"}); 
        }

        const result = await database.pool.query(`select * from users where email = $1`,[email]);

        if(result.rows.length > 0) {
            return res.status(422).json({status:false, message:"Validation error", error:"Duplicate email id"}); 
        } else {
            const hashedPassword = await bcrypt.hash(password,10);
            const insert_data = await database.pool.query(`insert into users (name, email, password) values ($1,$2,$3) RETURNING id,name,email`,[name,email,hashedPassword]);
            return res.status(200).json({status:true, message:"User registered successfully", data:insert_data.rows[0]});
        }
    } catch(error) {
        return res.status(500).json({status:false, error:error.message});
    }
}

exports.login = async (req,res) => {
    try {
        let { email, password} = req.body;
        
        if(!email || !password) {
            return res.status(422).json({status:false, message:"Validation error", error:"Please enter all the fields"}); 
        }
        const result = await database.pool.query(`select * from users where email = $1`,[email]);

        if(result.rows.length > 0) {
            const validPassword = await bcrypt.compare(password,result.rows[0]['password']);
            if(!validPassword) {
                return res.status(422).json({status:false, message:"Validation error", error:"Invalid Credentials"}); 
            }
            const token = jwt.sign({userId : result.rows[0]['id']}, process.env.JWT_SECRET,{expiresIn:"1d"});
            return res.status(200).json({status:true, message:"User logged in successfully", data:result.rows[0], idToken:token});
        } else {
            return res.status(422).json({status:false, message:"Validation error", error:"User doesn't exists."}); 
        }
    } catch(error) {
        return res.status(500).json({status:false, error:error.message});
    }
}

exports.profile = async (req,res) => {
    try {
        let userId = req.body.userId;
        const result = await database.pool.query(`select * from users where id  = $1`,[userId]);
        return res.status(200).json({status:true, message:"User profile data", data:result.rows[0]});
    } catch(error) {
        return res.status(500).json({status:false, error:error.message});
    }
}