const jwt=require("jsonwebtoken");
const User=require("../models/User");
require("dotenv").config();


// auth
exports.auth=async (req,res,next) =>{

    try{
        // extract token
        const token= req.cookies.token
                    || req.body.token
                    || req.header("Authorization").replace("Bearer ","");
        console.log("Token",token);
        
        // if token missing,then return responce
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token are Missing',
            });
        }
        // verify the token
        try{
            const DecodedPayload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(DecodedPayload);
            // above function req me payload dal do using token Because of before isStudent ,isAdmin,isInstructor are check AccountType
            // console.log("******User Request Message****** :",req.user);//undefined
            req.user=DecodedPayload;//ERRRRRRRRRRRRRRRRRRRR
            // console.log("******User Request Message****** :",req.user);//payload
        }
        catch(err){
            // verification issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}

// isStudent
exports.isStudent= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a Protacted Route for Student only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:'User role can not be verified,please try again',
        });
    }
}

// inInstructor
exports.isInstructor= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a Protacted Route for Instructor only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:'User role can not be verified,please try again',
        });
    }
}

// Admin
exports.isAdmin= async (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a Protacted Route for Admin only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:'User role can not be verified,please try again',
        });
    }
}
