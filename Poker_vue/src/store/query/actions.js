import axios from "axios";
import router from "../../router";

export async function queryAPI(status,name,refresh,idRoom){

    try{
        const data = await axios({
            url: "http://localhost:3001/searchIssue",
            method: "POST",
            data:{
                status: status,
                name: name,
                refresh,
                idRoom
            }
        })
        return data.data
    }catch(e){
        throw Error("Error " + e)
    }
    
}

export async function repoConfig(user,token,project,room,type,startDate){
    const id = localStorage.getItem('id')
    await axios({
        url: "http://localhost:3001/configRepos",
            method: "POST",
            data:{
                room,
                user:user,
                token:token,
                project:project,
                type,
                id,
                startDate
            }
    }).then((res)=> {
        router.push({ name: "game", params: { id: res.data.id } })
    }).catch((e)=> {
        throw Error(e)
    })
}

export async function getRepoConfig(id){
    try{
        const data = await axios({
            url: "http://localhost:3001/getRepoConfig",
            method: "POST",
            data:{
                id
            }
        })
        return data.data
    }catch(e){
        throw Error(e)
    }
    
}

export async function checkSala(id){
    try{
        const data = await axios({
            url: "http://localhost:3001/checkSala",
                method: "POST",
                data:{
                    id
                }
        })
        console.log(data.data);
        return data.data
    }catch(e){
        console.log(e);
    }
   
}
export async function exportIssues(issues){
    await axios({
        url: "http://localhost:3001/export",
        method:"POST",
        data:{
            issues:issues
        },
        responseType:'blob'
    }).then((res)=>{
        var fileUrl = window.URL.createObjectURL(new Blob([res.data]))
        const parts = fileUrl.split("/")
        var name = parts[parts.length-1]+".csv"
        var fileLink = document.createElement('a')
        fileLink.href = fileUrl
        fileLink.setAttribute('download',name)
        document.body.appendChild(fileLink)     
        fileLink.click()  
    }).catch((e)=>{
        throw new Error(e)
    })
}