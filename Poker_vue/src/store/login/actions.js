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

        router.push({
            name: "logged"
        })
    }).catch((e)=> {
        throw Error(e.response.data)
    })
    
}

export async function postName(gameName){
    await axios({
        url: "game",
        method: "GET",
        data: {gameName:this.gameName}
    }).then((response)=> {
        console.log(response)
        localStorage.setItem('gameName',gameName);
        router.push({
            name: "game"
        })
    }).catch((e)=> {
        throw new Error(e)
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