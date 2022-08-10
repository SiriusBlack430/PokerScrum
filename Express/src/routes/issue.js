const express = require('express')
const uuid = require('uuid')
const os = require('os')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const pool = require('./conectionMysql')

const router = express.Router()

const baseUrl = 'https://api.github.com/graphql' // url api github
let cart = {}
let element = []

// return query graphql api first 100 issues
function queryIssues(login, projectNum, userOrOrganization) {
  return {
    query: `
    query{
      ${userOrOrganization}(login:"${login}"){
        projectV2(number:${projectNum}){
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

// query de pruebas para la ruta de / de express
function query(number) {
  return {
    query: `
  query{
    organization(login:"gps-plan") {
      repository(name:"casos"){
        issue(number:${number}){
          title
        }
      }
    }
  }`,
  }
}

// query graphql to github with cursor
function queryIssueWithCursor(login, projectNum, userOrOrganization, cursor) {
  return {
    query: `
    query{
       ${userOrOrganization}(login:"${login}"){
        projectV2(number:${projectNum}){
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
          items(first:100,after:"${cursor}"){
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

// query to check params are correct and return github intern id of project
function queryConnection(login, projectNum, userOrOrganization) {
  return {
    query: `
    query{
      ${userOrOrganization}(login:"${login}"){
        projectV2(number:${projectNum}){
          id
        }
      }
    }`,
  }
}

// get 100 issues
async function getIssue(data, cursor) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${data.token}`,
    }
    let info
    if (cursor === null) {
      info = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(queryIssues(data.login, data.project, data.type)),
      })
    } else {
      info = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(queryIssueWithCursor(data.login, data.project, data.type, cursor)),
      })
    }
    const infoJson = await info.json()
    return infoJson
  } catch (e) {
    console.log(e)
    return undefined
  }
}

// filter the response from github and construct the object that contains the data of issues
function filterInfoJson(infoJson, type) {
  try {
    let items
    let statusNames
    let fields
    if (type === 'organization') {
      fields = infoJson.data.organization.projectV2.fields.nodes
      cart.project = infoJson.data.organization.projectV2.title
      items = infoJson.data.organization.projectV2.items.edges
    } else if (type === 'user') {
      fields = infoJson.data.user.projectV2.fields.nodes
      cart.project = infoJson.data.user.projectV2.title
      items = infoJson.data.user.projectV2.items.edges
    }
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === 'Status') {
        statusNames = fields[i].options
      }
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].node.fieldValues.nodes.length; j++) {
        for (let k = 0; k < statusNames.length; k++) {
          if (statusNames[k].name === items[i].node.fieldValues.nodes[j].name) {
            cart.status = items[i].node.fieldValues.nodes[j].name
          }
        }
      }
      cart.label = ''
      cart.description = ''
      cart.assign = ''
      cart.participant = ''
      if (items[i].node.content.__typename === 'Issue') {
        cart.id = items[i].node.content.number
        cart.title = items[i].node.content.title
        cart.url = items[i].node.content.bodyUrl
        for (let l = 0; l < items[i].node.content.labels.nodes.length; l++) {
          cart.label = `${items[i].node.content.labels.nodes[l].name}, ${cart.label}`
        }
        cart.description = items[i].node.content.bodyText
        for (let l = 0; l < items[i].node.content.assignees.nodes.length; l++) {
          cart.assign = `${items[i].node.content.assignees.nodes[l].login}, ${cart.assign}`
        }
        for (let l = 0; l < items[i].node.content.participants.nodes.length; l++) {
          cart.participant = `${items[i].node.content.participants.nodes[l].login}, ${cart.participant}`
        }
        element.push({
          project: cart.project,
          id: cart.id,
          title: cart.title,
          status: cart.status,
          url: cart.url,
          label: cart.label,
          description: cart.description,
          assign: cart.assign,
          participant: cart.participant,
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
}

// filter issues by string
function filterIssues(data, status, name) {
  let elementFilter = []
  const filterStatusName = []
  if (status.trim() === '' && name.trim() === '') {
    elementFilter = data
  } else if (status.trim() !== '' && status !== 'all') {
    for (let i = 0; i < element.length; i++) {
      if (data[i].status.toLowerCase().trim() === status.toLowerCase().trim()) {
        elementFilter.push(data[i])
      }
    }
    if (name.trim() !== '') {
      for (let j = 0; j < elementFilter.length; j++) {
        if (elementFilter[j].title.toLowerCase().trim().includes(name.toLowerCase().trim())) {
          filterStatusName.push(elementFilter[j])
        }
      }
      elementFilter = filterStatusName
    }
  } else {
    for (let j = 0; j < data.length; j++) {
      if (data[j].title.toLowerCase().trim().includes(name.toLowerCase().trim())) {
        filterStatusName.push(data[j])
      }
    }
    elementFilter = filterStatusName
  }
  return elementFilter
}

// eslint-disable-next-line no-shadow
async function imprimir(element) {
  const file = `${uuid.v4()}.csv`
  const dir = path.join(os.tmpdir(), file)
  let string = 'ID, Name Issues, Status, Labels, Comments, Assignees, Participants \n'
  for (let i = 0; i < element.length; i++) {
    string = `${string + element[i].id}, ${element[i].title}, ${element[i].status}, ${element[i].label}, ${element[i].comment}, ${element[i].assign}, ${element[i].participant}\n`
  }
  fs.writeFileSync(
    dir,
    string,
    {
      encoding: 'utf8',
      mode: 0o666,
    },
    (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('File written successfully\n')
      }
    },
  )
  return dir
}

// get repository configuration from mysql
async function getRepConfig(id) {
  try {
    const repConfig = await pool.query('SELECT * FROM REPCONFIG WHERE id=?', id)
    if (repConfig.length !== 1) {
      throw Error('No hay una configuracion')
    } else {
      return repConfig[0]
    }
  } catch (e) {
    console.log(e)
    throw Error('Fallo al obtener la configuracion')
  }
}

// return the configuration from one room
router.post('/getRepoConfig', async (req, res) => {
  try {
    const repConfig = await pool.query("SELECT login,project,type,convert_tz(programed_date,'+00:00','+02:00') as programed_date,name FROM REPCONFIG WHERE id=?", req.body.id)
    if (repConfig.length !== 1) {
      res.sendStatus(404)
    } else {
      res.send(repConfig[0])
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

// creates the room in mysql with a correct configuration
router.post('/setConfigRepos', async (req, res) => {
  const data = req.body
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${data.token}`,
    }
    const info = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(queryConnection(data.user, data.project, data.type)),
    })
    const infoJson = await info.json()
    if (infoJson.data === undefined) {
      res.sendStatus(404)
      return
    }
    let fields
    if (data.type === 'user') {
      fields = infoJson.data.user.projectV2.id
    } else if (data.type === 'organization') {
      fields = infoJson.data.organization.projectV2.id
    }
    if (fields !== null) {
      try {
        await pool.query('INSERT INTO REPCONFIG(login,token,project,type,created_user_id,programed_date,name) VALUES(?,?,?,?,?,?,?)', [data.user, data.token, data.project, data.type, data.id, data.startDate, data.room])
        const id = await pool.query('SELECT LAST_INSERT_ID();')
        const idformat = Object.values(JSON.parse(JSON.stringify(id)))
        await pool.query('INSERT INTO USER_SALA VALUES(?,?)', [data.id, idformat[0]['LAST_INSERT_ID()']])
        res.send({ id: idformat[0]['LAST_INSERT_ID()'] })
      } catch (e) {
        console.log(e)
        res.sendStatus(500)
      }
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(404)
  }
})

router.post('/updateRepoConfig', async (req, res) => {
  const data = req.body
  try {
    if (data.token === '') {
      await pool.query('UPDATE REPCONFIG SET LOGIN=?,PROJECT=?,TYPE=?,PROGRAMED_DATE=?,NAME=? WHERE ID=?', [data.login, data.project, data.type, data.startDate, data.room, data.id])
    } else {
      await pool.query('UPDATE REPCONFIG SET LOGIN=?,TOKEN=?,PROJECT=?,TYPE=?,PROGRAMED_DATE=?,NAME=? WHERE ID=?', [data.login, data.token, data.project, data.type, data.startDate, data.room, data.id])
    }
    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

// request to github
router.post('/searchIssue', async (req, res) => {
  const { status } = req.body
  const { name } = req.body
  const { refresh } = req.body
  const { idRoom } = req.body
  if (element.length === 0 || refresh) {
    if (refresh) {
      element = []
      cart = {}
    }
    const data = await getRepConfig(idRoom)
    const infoJson = await getIssue(data, null)
    if (infoJson.data === undefined) {
      console.log(infoJson.message)
      res.sendStatus(404)
      return
    }
    filterInfoJson(infoJson, data.type)
    if (data.type === 'organization') {
      if (infoJson.data.organization.projectV2.items.totalCount > 100) {
        const petitions = Math.trunc(infoJson.data.organization.projectV2.items.totalCount / 100)
        // eslint-disable-next-line max-len
        let { cursor } = infoJson.data.organization.projectV2.items.edges[infoJson.data.organization.projectV2.items.edges.length - 1]
        for (let i = 0; i < petitions; i++) {
          // eslint-disable-next-line no-await-in-loop
          const info = await getIssue(data, cursor)
          filterInfoJson(info, data.type)
          // eslint-disable-next-line max-len
          cursor = info.data.organization.projectV2.items.edges[info.data.organization.projectV2.items.edges.length - 1].cursor
        }
      }
    } else if (data.type === 'user') {
      if (infoJson.data.user.projectV2.items.totalCount > 100) {
        const petitions = Math.trunc(infoJson.data.user.projectV2.items.totalCount / 100)
        // eslint-disable-next-line max-len
        let { cursor } = infoJson.data.user.projectV2.items.edges[infoJson.data.user.projectV2.items.edges.length - 1]
        for (let i = 0; i < petitions; i++) {
          // eslint-disable-next-line no-await-in-loop
          const info = await getIssue(data, cursor)
          filterInfoJson(info, data.type)
          // eslint-disable-next-line max-len
          cursor = info.data.organization.projectV2.items.edges[info.data.user.projectV2.items.edges.length - 1].cursor
        }
      }
    }
  }
  const filteredData = filterIssues(element, status, name)
  res.send(filteredData)
})

router.post('/export', async (req, res) => {
  const elementFilter = req.body.issues
  const download = await imprimir(elementFilter)
  res.download(download)
})

// checks if exists the room
router.post('/checkSala', async (req, res) => {
  try {
    const { id } = req.body
    const data = await pool.query('SELECT * FROM REPCONFIG WHERE ID=?;', id)
    if (data.length === 0) {
      res.sendStatus(404)
      return
    }
    res.send(data[0])
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

// itemId es el id de issue dentro de projectV2, fieldId es el id de valoracion
/* function mutation() {
  return {
    query: `
    mutation {
      updateProjectV2ItemFieldValue(
        input: {projectId: "PVT_kwHOBQI_A84ACKFd",
        itemId: "PVTI_lAHOBQI_A84ACKFdzgBhM-s",
        fieldId: "PVTF_lAHOBQI_A84ACKFdzgBP1IA",
        value: {number: 50}}
      ) {
        clientMutationId
      }
    }`,
  }
} */

// ruta de pruebas en express
router.get('/', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'bearer token', // token
    }
    const info = await fetch(baseUrl, {
      method: 'POST',
      headers,
      // body: JSON.stringify(queryIssues("gps-plan",7,"organization")),
      body: JSON.stringify(query(1210)),
    })
    const infoJson = await info.json()
    console.log(infoJson)
    res.send(infoJson)
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
