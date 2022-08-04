const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const pool = require("./conectionMysql")
const uuid = require('uuid')
const os = require('os')
const fs = require('fs')
const path = require('path')

const baseUrl = "https://api.github.com/graphql" // url api github
let cart={},element=[]

// return query graphql api first 100 issues
function queryIssues(login,projectNum,userOrOrganization){ 
  return{
    "query":`
    query{
      `+userOrOrganization+`(login:"`+login+`"){
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
          items(first:100){
            totalCount
            edges{
              cursor
              node{
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
                    labels(first:20){
                      nodes{
                        name
                      }
                    }
                    bodyUrl
                    bodyText
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
      }
    }`,
  }
} 
function query(){
  return {"query":`
  query{
    organization(login:"gps-plan"){
      projectV2(number:7){
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
        items(first:100){
          totalCount
          edges{
            cursor
            node{
              content{
                __typename
                ... on Issue{
                  number
                  title
                }
              }
            }
          }
        }
      }
    }
  }`}
}
function queryIssueWithCursor(login,projectNum,userOrOrganization,cursor){
  return{
    "query":`
    query{
      `+userOrOrganization+`(login:"`+login+`"){
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
          items(first:100,after:"`+cursor+`"){
            totalCount
            edges{
              cursor
              node{
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
                    labels(first:20){
                      nodes{
                        name
                      }
                    }
                    bodyUrl
                    bodyText
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
      }
    }`,
  }
}
function queryConnection(login,projectNum,userOrOrganization){
  return{
    "query":`
    query{
      `+userOrOrganization+`(login:"`+login+`"){
        projectV2(number:`+projectNum+`){
          id
        }
      }
    }`
  }
}

// filter all data that return github and return an js object of issues

//get first 100 issues
async function getIssue(data,cursor){
  try{
    const headers = {
      "Content-Type":"application/json",
      Authorization: `bearer ${data.token}`
    }
    let info
    if(cursor === null){
      info = await fetch(baseUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(queryIssues(data.login,data.project,data.type))
      })
    }else{
      info = await fetch(baseUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(queryIssueWithCursor(data.login,data.project,data.type,cursor))
      })
    }
     
    const infoJson = await info.json()
    return infoJson
  }catch(e){
    console.log(e)
  }
}

function filterInfoJson(infoJson,type){
  try{
    let items,statusNames, fields
    if(type==="organization"){
      fields = infoJson.data.organization.projectV2.fields.nodes
      cart.project = infoJson.data.organization.projectV2.title
      items = infoJson.data.organization.projectV2.items.edges
      
    }else if(type==="user"){
      fields = infoJson.data.user.projectV2.fields.nodes
      cart.project = infoJson.data.user.projectV2.title
      items = infoJson.data.user.projectV2.items.edges
    }
  
    for(let i=0;i<fields.length;i++){
      if(fields[i].name === "Status"){
        statusNames = fields[i].options
      }
    }
    
    for(let i=0; i<items.length; i++){

      for(let j=0; j<items[i].node.fieldValues.nodes.length; j++){
        for(let k=0; k<statusNames.length; k++){
          if(statusNames[k].name === items[i].node.fieldValues.nodes[j].name){
            cart.status = items[i].node.fieldValues.nodes[j].name
          }
        }
      }
      cart.label=""
      cart.description=""
      cart.assign=""
      cart.participant=""
      if(items[i].node.content.__typename==="Issue"){
        cart.id = items[i].node.content.number
        cart.title = items[i].node.content.title
        cart.url = items[i].node.content.bodyUrl
        for(var l=0; l<items[i].node.content.labels.nodes.length; l++){
          cart.label = items[i].node.content.labels.nodes[l].name+", "+cart.label
        }
        cart.description = items[i].node.content.bodyText
        for(var l=0; l<items[i].node.content.assignees.nodes.length; l++){
          cart.assign = items[i].node.content.assignees.nodes[l].login+", "+cart.assign
        }
        for(var l=0; l<items[i].node.content.participants.nodes.length; l++){
          cart.participant = items[i].node.content.participants.nodes[l].login+", "+cart.participant
        }
        element.push({project: cart.project,id: cart.id,title: cart.title,status: cart.status,url: cart.url,label: cart.label,description: cart.description,assign: cart.assign,participant: cart.participant});
      }
    }
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
  const data = req.body;
  try{
    headers = {
      "Content-Type":"application/json",
      Authorization: "bearer "+data.token
    } 
    const info = await fetch(baseUrl,{
      method: "POST",
      headers: headers,
      body: JSON.stringify(queryConnection(data.user,data.project,data.type))
    })
    const infoJson = await info.json();
    let fields
    if(data.type ==="user"){
      fields = infoJson.data.user.projectV2.id;
    }else if(data.type ==="organization"){
      fields = infoJson.data.organization.projectV2.id;
    }
    
    if(fields!==null){
      try{
          await pool.query("INSERT INTO REPCONFIG(login,token,project,type,created_user_id,programed_date,name) VALUES(?,?,?,?,?,?,?)",[data.user,data.token,data.project,data.type,data.id,data.startDate,data.room])
          const id = await pool.query("SELECT LAST_INSERT_ID();")
          const idformat = Object.values(JSON.parse(JSON.stringify(id)))
          await pool.query("INSERT INTO USER_SALA VALUES(?,?)",[data.id,idformat[0]['LAST_INSERT_ID()']])
          res.send({id : idformat[0]['LAST_INSERT_ID()']});
      }catch(e){
        console.log(e)
        res.sendStatus(500)
      }
      
    }
  }catch(e){
    console.log(e);
    res.sendStatus(404);
  }
})

router.get("/mutation",async(req,res)=>{
  res.send(await getIssue())  
})

router.post("/searchIssue",async(req,res)=>{
  const status = req.body.status;
  const name = req.body.name;
  const refresh = req.body.refresh
  const type = req.body.type
  
  if(element.length===0 || refresh){
    if(refresh){
      element=[],cart = {}
    } 
    const data = await getRepConfig()
    const infoJson = await getIssue(data,null)
    filterInfoJson(infoJson,type)
    if(data.type ==="organization"){
      if(infoJson.data.organization.projectV2.items.totalCount > 100){
        const petitions = Math.trunc(infoJson.data.organization.projectV2.items.totalCount/100)
        let cursor = infoJson.data.organization.projectV2.items.edges[infoJson.data.organization.projectV2.items.edges.length-1].cursor
        for(let i =0;i<petitions;i++){
          let info = await getIssue(data,cursor)
          filterInfoJson(info,type)
          cursor = info.data.organization.projectV2.items.edges[info.data.organization.projectV2.items.edges.length-1].cursor
        }
      }
    }else if(data.type ==="user"){
      if(infoJson.data.user.projectV2.items.totalCount > 100){
        const petitions = Math.trunc(infoJson.data.user.projectV2.items.totalCount/100)
        let cursor = infoJson.data.user.projectV2.items.edges[infoJson.data.user.projectV2.items.edges.length-1].cursor
        for(let i =0;i<petitions;i++){
          let info = await getIssue(data,cursor)
          filterInfoJson(info,type)
          cursor = info.data.organization.projectV2.items.edges[info.data.user.projectV2.items.edges.length-1].cursor
        }
      }
    }
    

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
      Authorization: `bearer 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` // token
    }
    const info = await fetch(baseUrl,{
      method: "POST",
      headers: headers,
      body: JSON.stringify(queryIssues("gps-plan",7,"organization"))
      //body: JSON.stringify(queryIssues())
    })
    const infoJson = await info.json()
    console.log(infoJson)
    res.send(infoJson)
  }catch(e){
    console.log(e)
  }
})
module.exports = router
