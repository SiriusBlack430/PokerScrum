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
          element.push({id: cart.id,title: cart.title,status: cart.status,url: cart.url,label: cart.label});
        }
      }
      return element
    }catch(e){
      console.log(e)
    }
}

// filter issues by string
function filterIssues(data,filter){
    let elementFilter=[]
    if(filter.trim()===""){
        elementFilter=data
    }else {
      for(let i=0;i<element.length;i++){
        if(data[i].status.toLowerCase().trim() == filter.toLowerCase().trim()){
          elementFilter.push(data[i])
        }
      }
    }  
    return elementFilter
}

// get repository configuration from mysql
async function getRepConfig(){
    const repConfig = await pool.query("SELECT * FROM REPCONFIG LIMIT 1")
    if(repConfig.length!==1){
        throw Error("No hay una configuracion")
    }
    return repConfig[0]
}

router.get("game",async(req,res)=>{
    
})
router.post("/searchIssue",async(req,res)=>{
    busqueda = req.body.status;
    if(element.length===0){
        await getIssue()
    }
    const filteredData = filterIssues(element,busqueda)
    res.send(filteredData)
})

module.exports = router