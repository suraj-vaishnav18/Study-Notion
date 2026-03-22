const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile= require("../models/Profile");
require("dotenv").config();

// signup
// Description
//  1. Featch data from User Enter in UI
//  2. Validate Data
       // all required fill enter user or not
       // Check Confirm Pass and Pass are same or not
       // User Account is all ready exist or not
       // Send Otp or User Enter Otp are same or not (Send otp function above)
//  3. Hash the Pass
//  4. Check Which Field are blank in User model ? to fill it
//  5. Create User Entry in DB

exports.signup=async (req,res) =>{
    try{
        ////////////////////////////// 1. Featch data from User Enter in UI ////////////////////////
        // data featch from request ki body trough Destructuring
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        console.log("BODY DATA",firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp);

        //////////////////////////// 2. Validate Data ////////////////////////////////////////////////
        ////// all required fill enter user or not //////////////////
        /////  Check Confirm Pass and Pass are same or not //////////
        ////// User Account is all ready exist or not ///////////////
        ////// Send Otp or User Enter Otp are same or not ///////////

        ////// all required fill enter user or not //////////////////
        // validate karlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        
        ////// User Account is all ready exist or not ///////////////
        // check user are already axist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is alredy registered",
            });
        }

        /////  Check Confirm Pass and Pass are same or not //////////
        // 2 password match karlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password value Not match try again",
            });
        }

        

        ////// System Send Otp or User Enter Otp are same or not ///////////
        // find most recent OTP stored for User
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        // validate OTP
        if(recentOtp.length === 0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found",
            });
        }
        else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }

        ///////////////////// 3. Hash the Pass ///////////////////////////////////////////
        // Hash password
        const hashedPassword=await bcrypt.hash(password,10);

        //////////////////// 4. Check Which Field are blank ? to fill it /////////////////
        
        /////////////////// Check the Only the Student and Admin are approved /////////////////////
        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);


        /////////////////// 5. Create User Entry in DB ////////////////////////////////////////
        // User entry create in DB

        // First additionalDetails for id create than add null valu in Profile fields
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // return res
        return res.status(200).json({
            success:true,
            message:'User are successfully Registered',
            user,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again",
        });
    }
}

// Login
// Description
// 1. Featch data from User Enter in UI
// 2. Validate Data 
    // all required fill enter user or not
    // User Account is all ready exist or not
// 3.Compare the User Enter Password and Stored Hashed Password After gernrate JWt token
    // Why JWT ? => Because of Only the Authentic User are Access all the Protected Data(accessmaltiple protected web page) for perticular time
// 4. store cookie in expirestion time and token
    // Why Cookie ? => Because of enhancing the user's experience on the web  and Cookies are primarily used for session management

exports.login=async (req,res) =>{
    try{

        ////////////////////////////// 1. Featch data from User Enter in UI ////////////////////////
        // get data from body
        const {email,password}=req.body;

        ////////////////////////////// 2. Validate Data ////////////////////////////////////////////
        // validate data
        // all required fill enter user or not
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required try again",
            })
        }
        // user check exist or not
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registred, Please Signup First',
            });
        }

        /////////////////////////////// 3.Compare the User Enter Password and Stored Hashed Password After gernrate JWt token///////////////////////////////////
        // Why JWT ? => Because of Only the Authentic User are Access all the Protected Data(accessmaltiple protected web page) for perticular time
        // generate JWT ,after passwrord matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'24h',
            });
            
            user.token=token;
            user.password=undefined;
        
        ///////////////////////////// 4. store cookie in expirestion time and token ////////////////////////////////////////
        // Why Cookie ? => Because of enhancing the user's experience on the web  and Cookies are primarily used for session management
            // create cookie and send response
            const options={
                expires:new Date(Date.now() + 3*24*60*60*100),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Login is failure try again",
        })
    }
}


// sendOTP
// Description
// featch email from request ki body
// check if User is already exist
// if user already exist ,than return a reasponced
// genrate otp
// check unique otp or not
// create an entry for otp
exports.sendotp= async (req,res) =>{
    try{
            // featch email from request ki body
            // const email=req.body.email[0];
            const {email}=req.body;
            console.log("Email is ",email);
            // check if User is already exist
            const checkUserPresent=await User.findOne({email});

            // if user already exist ,than return a reasponced
            if(checkUserPresent){
                return res.status(401).json({
                    success:false,
                    message:'User are already register'
                })
            }

            // genrate otp
            let otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            // check unique otp or not
            const result=await OTP.findOne({otp:otp});
                console.log("Result is Generate OTP Func");
                console.log("OTP", otp);
                console.log("Result", result);
                
                while(result){
                otp=otpGenerator.generate(6,{
                    upperCaseAlphabets:false,
                });
                }

            const otpPayload = {email,otp};

            // create an entry for otp
            const otpBody=await OTP.create(otpPayload);
            console.log("OTP Body",otpBody);

            // return response successful
            res.status(200).json({
                success:true,
                message:"OTP Sent Successfully",
                otp,
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }


// changePassword
// Description
// get User data from req body
// get oldPassword,newPassword,confirmNewPassword
// validation
// update pwd DB
// send mail - Password updated
// return response

exports.changePassword = async (req,res) =>{
    
    try{
        // get data from req body
        // payload to featch id in JWT token Above
        const userDetails = await User.findById(req.user.id);

        // get oldPassword,newPassword,confirmNewPassword
        const {oldPassword ,newPassword , confirmNewPassword} = req.body;
        console.log("Form Data in backend",req.body);

        // validation old password
        const isPsswordMatch= await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if(!isPsswordMatch){
            // If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ 
                success: false, 
                message: "The password is incorrect"
            });
        }
        
        // Match new password and confirm new password
        if(newPassword !== confirmNewPassword){
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
        }

        // update pwd DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate( 
            req.user.id,
            { password: encryptedPassword},
            {new : true}
        );


        // send mail - Password updated
        try{
            const emailResponce = await mailSender(
                updatedUserDetails.email,
                "Update Your Password is Successflly Study Notion Account",
                passwordUpdated(
                        updatedUserDetails.email,
                        `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                    )
                );
            console.log("Email sent successfully : ",emailResponce.response);  
        }
        catch(error){
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }
        // return response
        return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
    }
    catch(error){
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
    }
}
