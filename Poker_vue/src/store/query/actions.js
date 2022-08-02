import axios from "axios";
import router from "../../router";


export async function queryAPI(status,name,refresh,type){

    try{
        const data = await axios({
            url: "http://localhost:3001/searchIssue",
            method: "POST",
            data:{
                status: status,
                name: name,
                refresh,
                type
            }
        })
        return data.data
    }catch(e){
        throw Error("Error " + e)
    }
    
}

export async function repoConfig(user,token,project,room,type){
    const id = localStorage.getItem('id')
    await axios({
        url: "http://localhost:3001/configRepos",
            method: "POST",
            data:{
                user:user,
                token:token,
                project:project,
                type,
                id
            }
    }).then(()=> {
        localStorage.setItem('room',room)
        localStorage.setItem("type",type)
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