import axios from "./axios";
import auth from "../lib/auth"
async function updateProfile(details) {
     const {data} = await axios({
        method:"post",
        url:'/api/profile',
        headers:{
            Authorization:`Bearer ${auth.token || ""} `,
        },
        data:{
            details
        }
     })
     return data;
}
export const profileApi ={
    updateProfile
}