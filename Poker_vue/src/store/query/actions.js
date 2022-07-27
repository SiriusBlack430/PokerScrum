import axios from "axios";
import router from "../../router";

export async function queryAPI(status,name){
    try{
        const data = await axios({
            url: "http://localhost:3001/searchIssue",
            method: "POST",
            data:{
                status: status,
                name: name
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
        throw Error(e)
    })
}
export async function getRepoConfig(){
    try{
        const data = await axios({
            url: "http://localhost:3001/getRepoConfig",
            method: "GET"
        })
        return data.data
    }catch(e){
        throw Error(e)
    }
    
}