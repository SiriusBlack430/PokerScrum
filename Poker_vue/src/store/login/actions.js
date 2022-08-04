import axios from "axios";
import router from "../../router";

export async function LoginAPI(username, password){
    await axios({
        url: "http://localhost:3001/log",
        method: "POST",
        data: {
            username: username,
            password: password,
        }
    }).then((response)=> {
        localStorage.setItem('username',username);
        localStorage.setItem('token',response.data.token);
        localStorage.setItem('permiss',response.data.permiss);
        localStorage.setItem('id',response.data.id)
        router.push({
            name: "logged"
        })
    }).catch((e)=> {
        console.log(e);
        throw Error(e)
    })
}

export async function RegisterAPI(username,password){
    await axios({
        url: "http://localhost:3001/register",
        method:"POST",
        data:{
            username: username,
            password: password
        }
    }).then((res)=>{
        router.push({
            name: "login"
        })
    }).catch((e)=>{
        throw new Error(e)
    })
}
export async function LoggedAPI(id){
    try{
        const data = await axios({
            url: "http://localhost:3001/logged",
            method:"POST",
            data:{
                id
            }
        })
        return data.data
    }catch(e){
        console.log(e);
        throw Error(e)
    }
   
        
   
   
}