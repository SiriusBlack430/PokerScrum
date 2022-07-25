import axios from "axios";
import router from "../../router";

export async function queryAPI(status){
    try{
        const data = await axios({
            url: "http://localhost:3001/searchIssue",
            method: "POST",
            data:{
                status: status
            }
        })
        return data.data
    }catch(e){
        throw Error("Error " + e)
    }
    
}

export async function repoConfig(user,token,project,room){
    await axios({
        url: "http://localhost:3001/configRepos",
            method: "POST",
            data:{
                user:user,
                token:token,
                project:project
            }
    }).then(()=> {
        localStorage.setItem('room',room)
        router.push({ name: "game" })
    }).catch((e)=> {
        throw new Error(e)
    })
}