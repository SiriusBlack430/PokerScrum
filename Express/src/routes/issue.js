const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const pool = require("./conectionMysql")

const baseUrl = "https://api.github.com/graphql"; // url api github
let cart={},element=[]
// return query graphql api
function issues(user,projectNum){
    return{
      "query":`
      query{
        user(login:"${user}"){
          projectV2(number:${projectNum}){
            title
            fields(first:20){
              nodes{
                ... on ProjectV2SingleSelectField{
                  name
                  options{
                    name
                  }
                }
              }
            }
            items(first:20){
              nodes{
                fieldValues(first: 8) {
                  nodes{
                    ... on ProjectV2ItemFieldSingleSelectValue{
                      name
                    }
                  }
                }
                content{
                    __typename
                    ... on Issue{
                    number
                    title
                    labels(first:20){
                      nodes{
                        name
                      }
                    }
                    bodyUrl
                  }
                }
              }
            }
          }
        }
      }`,
    }
}

// filter all data that return github and return an js object of issues
async function getIssue(){
    element=[],cart = {}
    try{
      const data = await getRepConfig()
      const headers = {
        "Content-Type":"application/json",
        Authorization: `bearer ${data.token}`
      }
      const info = await fetch(baseUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(issues(data.name,data.project))
      })
      const infoJson = await info.json();
      let fields = infoJson.data.user.projectV2.fields.nodes;
      var project = infoJson.data.user.projectV2.title;
      let statusNames;
      for(let i=0;i<fields.length;i++){
        if(fields[i].name === "Status"){
          statusNames = fields[i].options
        }
      }
      let items = infoJson.data.user.projectV2.items.nodes;
      for(let i=0; i<items.length; i++){
        for(let j=0; j<items[i].fieldValues.nodes.length; j++){
          for(let k=0; k<statusNames.length; k++){
            if(statusNames[k].name === items[i].fieldValues.nodes[j].name){
              cart.status = items[i].fieldValues.nodes[j].name
            }
          }
        }
        cart.label=""
        if(items[i].content.__typename==="Issue"){ 
          cart.id = items[i].content.number
          cart.title = items[i].content.title
          cart.url = items[i].content.bodyUrl
          for(let l=0; l<items[i].content.labels.nodes.length; l++){
              cart.label = items[i].content.labels.nodes[l].name+" "+cart.label
          }
          element.push({project: project,id: cart.id,title: cart.title,status: cart.status,url: cart.url,label: cart.label});
        }
      }
      return element
    }catch(e){
      console.log(e)
    }
}

// filter issues by string
function filterIssues(data,status,name){
    let elementFilter=[]
    if(status.trim()==="" && name.trim()===""){
        elementFilter=data
    }else {
      for(let i=0;i<element.length;i++){
        if(data[i].status.toLowerCase().trim() == status.toLowerCase().trim()){
          elementFilter.push(data[i])
        }
      // }
    }  
    return elementFilter
}

// get repository configuration from mysql
async function getRepConfig(){
    const repConfig = await pool.query("SELECT * FROM REPCONFIG LIMIT 1")
    if(repConfig.length!==1){
        throw Error("No hay una configuracion")
    } else {
      return repConfig[0]
  }
}
router.get("/getRepoConfig",async(req,res)=>{
  try{
    const data = await getRepConfig()
    res.send(data)
  }catch(e){
    console.log(e)
    res.sendStatus(404)
  }
})
//ghp_BTv8SkRemnGiQcNdmJIl7   KiP9i0DpJ0xADNk
router.post("/configRepos",async (req,res)=>{
  var data = req.body;
  try{
    headers = {
      "Content-Type":"application/json",
      Authorization: "bearer "+data.token
    } 
    const info = await fetch(baseUrl,{
      method: "POST",
      headers: headers,
      body: JSON.stringify(issues(data.user,data.project))
    })
    const infoJson = await info.json();
    var fields = infoJson.data.user.projectV2.fields.nodes;
    if(fields.length>0){
      const repConfig = await pool.query("SELECT * FROM REPCONFIG")
      if(repConfig.length==0){
        await pool.query("INSERT INTO REPCONFIG(name,token,project) VALUES(?,?,?)",[data.user,data.token,data.project]);
      }
      res.sendStatus(200);
    }
  }catch(e){
    console.log(e);
    res.sendStatus(404);
  }
})

router.get("/game",async(req,res)=>{
})

router.post("/searchIssue",async(req,res)=>{
    var status = req.body.status;
    var name = req.body.name;
    let refresh = req.body.refresh
    if(element.length===0 || refresh){
        await getIssue()
    }
    const filteredData = filterIssues(element,status,name)
    res.send(filteredData)
})

module.exports = router
