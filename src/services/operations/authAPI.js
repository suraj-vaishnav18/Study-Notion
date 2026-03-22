import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setLoding, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = endpoints

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        dispatch(setLoding(true));
        try{
            const responce=await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent: true,
            })
            console.log("SENDOTP API RESPONSE............", responce)
            console.log(responce.data.success);
            if(!responce.data.success){
                throw new Error(responce.data.message);
            }
            toast.success("OTP Send Successfully");
            navigate("/verify-email");
        }
        catch(error){
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoding(false));
        toast.dismiss(toastId);
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...");
        dispatch(setLoding(true));
        try{
            const responce=await apiConnector("POST",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            console.log("SIGNUP API RESPONCE...........",responce);
            if(!responce.data.success){
                throw new Error(responce.data.message);
            }
            toast.success("Sign Up Successfully");
            navigate("/login");
        }
        catch(error){
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoding(false))
        toast.dismiss(toastId)
    }
}


export function login(email,password,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loding ...");
        dispatch(setLoding(true));

        try{
            const responce=await apiConnector("POST",LOGIN_API,{
                email,
                password,
            })
            console.log("Login API Responce.........",responce);

            if(!responce.data.success){
                throw new Error(responce.data.message);
            }
            toast.success("Login Successful");
            dispatch(setToken(responce.data.token));
            const userImage =responce.data?.user?.image ? responce.data.user.image :`https://api.dicebear.com/5.x/initials/svg?seed=${responce.data.user.firstName} ${responce.data.user.lastName}`
            dispatch(setUser({ ...responce.data.user, image: userImage }))
            localStorage.setItem("token", JSON.stringify(responce.data.token))
            localStorage.setItem("user", JSON.stringify(responce.data.user))
            navigate("/dashboard/my-profile")
        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
        }

        dispatch(setLoding(false));
        toast.dismiss(toastId)
    }
}

export function logout(navigate){
    return (dispatch) =>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out")
        navigate("/")
    }
}

export function getPasswordResetToken(email,setEmailSent){
    return  async(dispatch)=>{
        const toastId=toast.loading("Loding ...");
        dispatch(setLoding(true));
        try{
            const responce=await apiConnector("POST",RESETPASSTOKEN_API,{email});
            console.log("RESETPASSWORDTOKEN API.........",responce);
            if(!responce.data.success){
                throw new Error(responce.data.message);
            }
            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoding(false));
        toast.dismiss(toastId);
    }
}

export function resetPassword(password,confirmPassword,token,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loding ...");
        dispatch(setLoding(true));
        try{
            const responce=await apiConnector("POST",RESETPASSWORD_API,{
                password,
                confirmPassword,
                token,
            })
            console.log("RESETPASSWORD RESPONCE..........",responce);
            if(!responce.data.success){
                throw new Error(responce.data.message);
            }
            toast.success("Reset Password is Successfully");
            navigate("/login");
        }
        catch(error){   
            console.log("RESET PASSWORD ", error);
            toast.error("Failed Reset password");
        }
        dispatch(setLoding(false));
        toast.dismiss(toastId);
    }
}
