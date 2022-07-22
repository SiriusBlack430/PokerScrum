import axios from "axios";

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
export async function repoConfig(user,token,project){
    try{
        const res = await axios({
            url: "http://localhost:3001/configRepos",
            method: "POST",
            data:{
                user,
                token,
                project
            }
        })
        return res
    }catch(e){
        throw new Error(e);
    }
}

export async function testConection(user,token,project){

}