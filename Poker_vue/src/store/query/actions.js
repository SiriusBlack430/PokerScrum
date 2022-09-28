import axios from "axios";
import router from "../../router";

export async function queryAPI(status,name,refresh){

    try{
        const data = await axios({
            url: "/searchIssue",
            method: "POST",
            data:{
                status: status,
                name: name,
                refresh
            }
        })
        return data.data
    }catch(e){
        throw Error("Error " + e)
    }
    
}

export async function repoConfig(userOrg,name,token,project,room){
    await axios({
        url: "/configRepos",
            method: "POST",
            data:{
                userOrg:userOrg,
                name:name,
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
            url: "/getRepoConfig",
            method: "GET"
        })
        return data.data
    }catch(e){
        throw Error(e)
    }
    
}

export async function exportIssues(issues){
    await axios({
        url: "/export",
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

export async function mutationIssue(project,field,item,number){
    try{
        const data = await axios({
            url: "/mutation",
            method: "POST",
            data:{
                project: project,
                field: field,
                item: item,
                number: number
            }
        })
    }catch(e){
        throw Error("Error " + e)
    }
}