import axios from "axios"
import { base_url } from "./utils"


 export const loginVerify= async(setLoading)=>{
    try {
        const response = await axios.get(`${base_url}/auth/verify-admin`,{
            withCredentials:true
        })
        const data = await response.data;
        if(data.success){
           setLoading(false) 
        }
       
    } catch (error) {
        location.href="/login"
    }
}


