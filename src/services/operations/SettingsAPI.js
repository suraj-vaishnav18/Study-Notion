
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis"
import { toast } from "react-hot-toast"
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } = settingsEndpoints

export function updateDisplayPicture(token,formData){
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...");

        try{
            const responce=await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,formData,{
                                    "Content-Type":"multipart/form-Data",
                                    Authorization:`Bearer ${token}`
                                })
            console.log("UPDATE DISPAY PICTURE ................",responce);

            if(!responce.data.success){
                throw new Error(responce.data.message);
            }

            toast.success("Display Picture Updated Successfully");
            // user can update in profileslice
            dispatch(setUser(responce.data.data));

        }
        catch(error){
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId);
    }
}

export function updateProfile(token,formdata){
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...");
        // console.log("fronted data",formdata);

        try{
            const responce=await apiConnector("PUT",UPDATE_PROFILE_API,formdata,{
                                    Authorization: `Bearer ${token}`,
                                })
            console.log("UPDATE PROFILE ........",responce);
            if (!responce.data.success){
                throw new Error(responce.data.message)
            }
            const userImage = responce.data.updatedUserDetails.image
            ? responce.data.updatedUserDetails.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${responce.data.updatedUserDetails.firstName} ${responce.data.profile.lastName}`

            // dispatch(setUser({...responce.data.updatedUserDetails, image:userImage}))
            dispatch(setUser({...responce.data.updatedUserDetails,image:userImage}))
            localStorage.setItem("token",JSON.stringify(responce.data.updatedUserDetails.token));
            localStorage.setItem("user",JSON.stringify(responce.data.updatedUserDetails));
            toast.success("Profile Updated Successfully")
        }
        catch(error){
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        toast.dismiss(toastId);
    }
}

export async function changePassword(token,formdata){

    const toastId=toast.loading("Loading...");
    console.log("Form Data ",formdata);
    try{
        const responce=await apiConnector("POST",CHANGE_PASSWORD_API,formdata,{
            Authorization:`Bearer ${token}`,
        })
        console.log("CHANGE PASSWORD API............",responce);
        if (!responce.data.success){
            throw new Error(responce.data.message)
        }
        toast.success("Password Changed Successfully")
    }
    catch(error){
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE_PROFILE_API API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Profile Deleted Successfully")
        dispatch(logout(navigate))
      } catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
      }
      toast.dismiss(toastId)
    }
  }