import { apiConnector } from "../apiconnector";
import { catalogData} from "../apis";
import {toast} from "react-hot-toast"

export const getCatalogaPageData= async (categoryId) =>{
    const toastId= toast.loading("Loading...");
    let result=[];
    try{
        console.log("category Id ",categoryId);
        const responce=await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
        {categoryId: categoryId});

        console.log(" CATALOGPAGEDATA_API...........",responce);

        if(!responce?.data?.success){
            throw new Error("Could not Fetch Category page data");
        }
        result= responce?.data;
    }
    catch(error) {
      console.log("CATALOG PAGE DATA API ERROR....", error);
      toast.error(error.message);
      result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}