// "npm run dev" command to start 

const express= require("express");
const app = express();
const dotenv=require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;


const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

const database= require("./config/database");
// database connect
database.connect();

const cookieParser= require("cookie-parser");
const cors= require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload= require("express-fileupload");


// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // frontend url to connect backend using cors
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp",
    })
)

// cloudinary connection
cloudinaryConnect();

// routes Mount
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);

// default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is running Up....",
    });
})

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})