const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const Repconfig = require('../models/repconfig');
const uuid = require('uuid');
var os = require('os');
const fs = require('fs');
var path = require('path');

const baseUrl = "https://api.github.com/graphql"; // url api github
let cart = {}, elements = [], userOrg = "", name="";

// return query graphql api
function issuesUser(user, projectNum) {
  return {
    "query": `
    query{
      user(login:"${user}"){
        projectV2(number:`+ projectNum + `){
          id
          title
          items(first:50){
            nodes{
              id
              fieldValues(first: 100) {
                nodes{
                  ... on ProjectV2ItemFieldSingleSelectValue{
                    id
                    name
                  }
                  ... on ProjectV2ItemFieldNumberValue {
                    id
                    number
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
                  assignees(first:5){
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

//Búsqueda de toda la información de todas las ISSUES
function issuesProject(user,projectNum, cursor) {
  return {
    "query": `
    query{
      organization(login: "${user}") {
        projectV2(number: `+ projectNum + `) {
          id
          title
          items(first: 100 ${cursor}) {
            totalCount
            edges {
              cursor
              node {
                content {
                  ... on Issue {
                    id
                    number
                  }
                }
                id
                fieldValues(first: 10) {
                  edges {
                    node {
                      ... on ProjectV2ItemFieldNumberValue {
                        id
                        number
                        field {
                          ... on ProjectV2Field {
                            id
                            name
                          }
                        }
                      }
                      ... on ProjectV2ItemFieldUserValue {
                        __typename
                        users(first: 10) {
                          nodes {
                            login
                          }
                        }
                        field {
                          ... on ProjectV2Field {
                            id
                            name
                          }
                        }
                      }
                      ... on ProjectV2ItemFieldLabelValue {
                        __typename
                        labels(first: 10) {
                          nodes {
                            name
                          }
                        }
                      }
                      ... on ProjectV2ItemFieldTextValue {
                        id
                        text
                      }
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
            nodes {
              id
            }
          }
        }
      }
    }`,
  }
}

function mutation(project,field,item,number) {
  return {
    "query": `
    mutation {
      updateProjectV2ItemFieldValue(
        input: {projectId: "${project}", fieldId: "${field}", itemId: "${item}", value: {number: `+ number + `}}
        ) {
          clientMutationId
        }
      }`,
    }
  }
  
  async function getIssueUser(){
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
        body: JSON.stringify(issuesUser(data.name,data.project))
      })
      const infoJson = await info.json();
      cart.project = infoJson.data.user.projectV2.title;
      cart.projectId = infoJson.data.user.projectV2.id;
      cart.estimationId = "PVTFNV_lQHOBQI_A84ACKFdzgBPsLfOAOEl4A"
      let items = infoJson.data.user.projectV2.items.nodes;
      let field;
      for(let i=0; i<items.length; i++){
        field = items[i].fieldValues.nodes;
        cart.label=""
        cart.comment=""
        cart.assign=""
        cart.participant=""
        cart.estimation=""
        cart.itemId=items[i].id 
        for(let j=0; j<field.length; j++){
          if(field[j].name!=undefined) cart.status = field[j].name
          if(field[j].number!=undefined) cart.estimation = field[j].number
        }
        if(items[i].content.__typename==="Issue"){
          cart.id = items[i].content.number
          cart.title = items[i].content.title
          cart.url = items[i].content.bodyUrl
          for(var l=0; l<items[i].content.labels.nodes.length; l++){
            cart.label = items[i].content.labels.nodes[l].name+", "+cart.label
          }
          for(var l=0; l<items[i].content.assignees.nodes.length; l++){
            cart.assign = items[i].content.assignees.nodes[l].login+", "+cart.assign
          }
          elements.push({projectId: cart.projectId,estimationId: cart.estimationId,itemId: cart.itemId,project: cart.project,id: cart.id,title: cart.title,status: cart.status,url: cart.url,label: cart.label,assign: cart.assign,estimation: cart.estimation});
        }
        console.log(elements);
      }
      return elements
    }catch(e){
      console.log(e)
    }
  }
  
  async function getIssueProject() {
    var issuesProyecto = [], cursor = ""
    cart = {}, elements=[]
    try{
      const data = await getRepConfig()
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${data.token}`
      }
      var info = await fetch(baseUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(issuesProject(data.name,data.project,cursor))
      })
      var infoJson = await info.json();
      cart.idProject = infoJson.data.organization.projectV2.id;
      cart.estimationId= "PVTF_lADOBKFhfM4AAUvuzgATiMQ";
      var items = infoJson.data.organization.projectV2.items.edges;
      cart.project = infoJson.data.organization.projectV2.title;
      var itemsCount = infoJson.data.organization.projectV2.items.totalCount;
      for (let i = 0; i < items.length; i++) {
        issuesProyecto[i] = items[i]
      }
      cursor = ",after: \""+issuesProyecto[99].cursor+"\""
      itemsCount = itemsCount - 100;
      if (itemsCount > 0) {
        var repeticiones = itemsCount/100;
        for (let j = 0; j < repeticiones; j++) {
          info = await fetch(baseUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(issuesProject(data.name,data.project,cursor))
          })
          infoJson = await info.json();
          items = infoJson.data.organization.projectV2.items.edges;
          for (let i = 0; i < items.length; i++) {
            issuesProyecto[issuesProyecto.length] = items[i];
          }
          cursor = ",after: \""+issuesProyecto[issuesProyecto.length-1].cursor+"\""
        }
      }
      for(var i=0; i < issuesProyecto.length; i++){
        var edges = issuesProyecto[i].node.fieldValues.edges
        cart.id = issuesProyecto[i].node.content.number
        cart.itemId = issuesProyecto[i].node.id
        cart.url = "https://github.com/gps-plan/casos/issues/"+cart.id
        cart.label = ""
        cart.estimation = ""
        cart.assign = ""
        for (let j = 0; j < edges.length; j++) {
          const element = edges[j].node;
          if(element.users !== undefined){
            for (let k = 0; k < element.users.nodes.length; k++) {
              cart.assign= cart.assign+" "+element.users.nodes[k].login;
            }
          }
          if(element.number !== undefined){
            cart.estimation = element.number
          }
          if(element.labels !== undefined){
            for (let l = 0; l < element.labels.nodes.length; l++) {
              cart.label= cart.label+" "+element.labels.nodes[l].name;
            }
          }
          if(element.text !== undefined){
            cart.title = element.text
          }
          if(element.name !== undefined){
            cart.status = element.name
          }
        }
        elements.push({projectId: cart.idProject,itemId: cart.itemId,project: cart.project,id: cart.id,estimationId: cart.estimationId,estimation: cart.estimation,title: cart.title,status: cart.status,url: cart.url,label: cart.label,assign: cart.assign});
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  // filter issues by string
  function filterIssues(data, status, name) {
    let elementFilter = []
    let filterStatusName = []
    if (status.trim() === "" && name.trim() === "") {
      elementFilter = data
    } else {
      if (status.trim() !== "" && status !== "all") {
        for (let i = 0; i < elements.length; i++) {
          data[i].id=data[i].id+""
          if (name.trim() !== "") {
            if (data[i].id.toLowerCase().trim().includes(name.toLowerCase().trim()) && data[i].status.toLowerCase().trim() == status.toLowerCase().trim()) {
              elementFilter.push(data[i])
            }
          }else {
            if (data[i].status.toLowerCase().trim() == status.toLowerCase().trim()) {
              elementFilter.push(data[i])
            }
          }
          elementFilter = filterStatusName
        }
      } else {
        for (var j = 0; j < data.length; j++) {
          data[j].id=data[j].id+""
          if (data[j].id.toLowerCase().trim().includes(name.toLowerCase().trim())){
            filterStatusName.push(data[j])
          }
        }
        elementFilter = filterStatusName
      }
    }
    return elementFilter
  }
  
  async function imprimir(element) {
    const file = uuid.v4() + '.csv'
    var dir = path.join(os.tmpdir(), file)
    var string = "ID, Name Issues, Status, Labels, Assignees, Estimation \n"
    for (var i = 0; i < element.length; i++) {
      string = string + element[i].id + ', ' + element[i].title + ', ' + element[i].status + ', ' + element[i].label + ', ' + element[i].assign + ', ' + element[i].estimation + '\n'
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
    async function getRepConfig() {
      const repConfig = await Repconfig.findAll({ where: { name: name } })
      if (repConfig.length !== 1) {
        throw Error("No hay una configuracion")
      } else {
        return repConfig[0]
      }
    }
    
    router.get("/getRepoConfig", async (req, res) => {
      try {
        const data = await getRepConfig()
        res.send(data)
      } catch (e) {
        console.log(e)
        res.sendStatus(404)
      }
    })
    
    router.post("/configRepos",async (req,res)=>{
      var data = req.body;
      var cursor=""
      userOrg = data.userOrg;
      name = data.name
      try{
        headers = {
          "Content-Type":"application/json",
          Authorization: "bearer "+data.token
        } 
        if(userOrg==="user"){
          const info = await fetch(baseUrl,{
            method: "POST",
            headers: headers,
            body: JSON.stringify(issuesUser(data.name,data.project))
          })
          const infoJson = await info.json();
          var items = infoJson.data.user.projectV2.items.nodes;
          if(items.length>0){
            const repConfig = await Repconfig.findAll({ where: { name: name } })
            if(repConfig==""){
              await Repconfig.create({
                name:data.name,
                token:data.token,
                project:data.project,
                createAt:"NOW()",
                updateAt: "NOW()"
              })
            }
            res.sendStatus(200);
          }
        } else{
          const info = await fetch(baseUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(issuesProject(data.name,data.project,cursor))
          })
          const infoJson = await info.json();
          var items = infoJson.data.organization.projectV2.items.edges;
          console.log(items);
          if (items.length > 0) {
            const repConfig = await Repconfig.findAll({ where: { name: name } })
            if(repConfig==""){
              await Repconfig.create({
                name:data.name,
                token:data.token,
                project:data.project,
                createAt:"NOW()",
                updateAt: "NOW()"
              })
            }
            res.sendStatus(200);
          }
        }
      }catch(e){
        console.log(e);
        res.sendStatus(404);
      }
    })
    
    router.post("/mutation", async (req, res) => {
      var data = req.body;
      var repo = await getRepConfig();
      try{
        headers = {
          "Content-Type":"application/json",
          Authorization: "bearer "+repo.token
        }
        const info = await fetch(baseUrl,{
          method: "POST",
          headers: headers,
          body: JSON.stringify(mutation(data.project,data.field,data.item,data.number))
        })
        res.sendStatus(200)
      } catch(e){
        console.log(e);
        res.sendStatus(404)
      }
    })    
    
    router.post("/searchIssue", async (req, res) => {
      var status = req.body.status;
      var name = req.body.name;
      let refresh = req.body.refresh
      if (elements.length === 0 || refresh) {
        if(userOrg=="user") await getIssueUser()
        else await getIssueProject()
      }
      const filteredData = filterIssues(elements, status, name)
      res.send(filteredData)
    })
    
    router.post("/export", async (req, res) => {
      var elementFilter = req.body.issues
      var download = await imprimir(elementFilter)
      res.download(download)
    })
    
    module.exports = router;