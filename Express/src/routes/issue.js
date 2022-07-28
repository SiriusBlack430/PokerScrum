const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const pool = require("./conectionMysql")
const uuid = require('uuid');
var os = require('os');
const fs = require('fs');
var path = require('path');

const baseUrl = "https://api.github.com/graphql"; // url api github
let cart={},element=[]

// return query graphql api
function issues(user,projectNum){
  return{
    "query":`
    query{
      user(login:"`+user+`"){
        projectV2(number:`+projectNum+`){
          id
          title
          fields(first:20){
            nodes{
              ... on ProjectV2SingleSelectField{
                name
                options{
                  name
                }
              }
              ... on ProjectV2Field{
                id
                name
              }
            }
          }
          items(first:50){
            nodes{
              fieldValues(first: 20) {
                nodes{
                  ... on ProjectV2ItemFieldSingleSelectValue{
                    id
                    name
                  }
                }
              }
              content{
                __typename
                ... on Issue{
                  number
                  title
                  labels(first:10){
                    nodes{
                      name
                    }
                  }
                  bodyUrl
                  comments(first:5){
                    nodes{
                      bodyText
                    }
                  }
                  assignees(first:5){
                    nodes{
                      login
                    }
                  }
                  participants(first:5){
                    nodes{
                      login
                    }
                  }
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
    cart.project = infoJson.data.user.projectV2.title;
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
      cart.comment=""
      cart.assign=""
      cart.participant=""
      if(items[i].content.__typename==="Issue"){
        cart.id = items[i].content.number
        cart.title = items[i].content.title
        cart.url = items[i].content.bodyUrl
        for(var l=0; l<items[i].content.labels.nodes.length; l++){
          cart.label = items[i].content.labels.nodes[l].name+", "+cart.label
        }
        for(var l=0; l<items[i].content.comments.nodes.length; l++){
          cart.comment = "'"+items[i].content.comments.nodes[l].bodyText+"', "+cart.comment
        }
        for(var l=0; l<items[i].content.assignees.nodes.length; l++){
          cart.assign = items[i].content.assignees.nodes[l].login+", "+cart.assign
        }
        for(var l=0; l<items[i].content.participants.nodes.length; l++){
          cart.participant = items[i].content.participants.nodes[l].login+", "+cart.participant
        }
        element.push({project: cart.project,id: cart.id,title: cart.title,status: cart.status,url: cart.url,label: cart.label,comment: cart.comment,assign: cart.assign,participant: cart.participant});
      }
    }
    //return element
    return infoJson
  }catch(e){
    console.log(e)
  }
}

// filter issues by string
function filterIssues(data,status,name){
  let elementFilter=[]
  let filterStatusName=[]
  if(status.trim()==="" && name.trim()===""){
    elementFilter=data
  }else {
    if(status.trim()!=="" && status!=="all"){
      for(let i=0;i<element.length;i++){
        if(data[i].status.toLowerCase().trim() == status.toLowerCase().trim()){
          elementFilter.push(data[i])
        }
      }
      if(name.trim()!==""){
        for(var j=0; j<elementFilter.length; j++){
          if(elementFilter[j].title.toLowerCase().trim().includes(name.toLowerCase().trim())){
            filterStatusName.push(elementFilter[j])
          }
        }
        elementFilter=filterStatusName
      }
    } else{
      for(var j=0; j<data.length; j++){
        if(data[j].title.toLowerCase().trim().includes(name.toLowerCase().trim())){
          filterStatusName.push(data[j])
        }
      }
      elementFilter=filterStatusName
    }
  }
  return elementFilter
}

async function imprimir(element){
  const file = uuid.v4()+'.csv'
  var dir = path.join(os.tmpdir(),file)
  var string="ID, Name Issues, Status, Labels, Comments, Assignees, Participants \n"
  for(var i=0;i<element.length;i++){
    string = string+element[i].id+', '+element[i].title+', '+element[i].status+', '+element[i].label+', '+element[i].comment+', '+element[i].assign+', '+element[i].participant+'\n'
  }
  fs.writeFileSync(dir, string,
    {
      encoding: "utf8",
      mode: 0o666
    },
    (err) => {
      if (err)
      console.log(err);
      else { console.log("File written successfully\n"); }
    });
    return dir
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

router.get("/mutation",async(req,res)=>{
  res.send(await getIssue())  
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

router.post("/export", async(req,res)=>{
  var elementFilter = req.body.issues
  var download = await imprimir(elementFilter)
  res.download(download)
})

// itemId es el id de issue dentro de projectV2, fieldId es el id de valoracion
function mutation(){
  return{
    "query":`
    mutation {
      updateProjectV2ItemFieldValue(
        input: {projectId: "PVT_kwHOBQI_A84ACKFd", itemId: "PVTI_lAHOBQI_A84ACKFdzgBhM-s", fieldId: "PVTF_lAHOBQI_A84ACKFdzgBP1IA", value: {number: 50}}
      ) {
        clientMutationId
      }
    }`,
  }
}
//token  ghp_LUsFedtFM7gzvZnQ   Tr8t3lXUnuUg213LcKoa
router.get("/",async(req,res)=>{
  try{
    const headers = {
      "Content-Type":"application/json",
      Authorization: `bearer ` // token
    }
    const info = await fetch(baseUrl,{
      method: "POST",
      headers: headers,
      body: JSON.stringify(mutation())
    })
    const infoJson = await info.json();
    console.log(infoJson)
    res.send(infoJson)
  }catch(e){
    console.log(e)
  }
})
module.exports = router
