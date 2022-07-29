<script>
import {queryAPI} from '../store/query/actions'
import {exportIssues} from '../store/query/actions'


export default{
  name: "Query",
  data(){
    return{
      issues:[],
      project: "",
      nameIssue: "",
      statusFilter:[],
      statusIssue:"",
      actualIssue:"",
      actualIssueLink:"",
      user: localStorage.getItem('username'),
      room: localStorage.getItem('room'),
      issueOpen:false,
      issueExport:false,
      pickcard:false,
    }
  },
  async mounted() {
    try{
      this.issues = await queryAPI(this.statusIssue,this.nameIssue,false)
      this.project = this.issues[0].project
      this.statusFilter = Array.from(new Set(this.issues.map(tempObject => tempObject.status)));
    } catch(e){
        console.log("Error " + e)
  
    }
  },
  methods:{
    async query(){
      try{
       this.issues = await queryAPI(this.statusIssue,this.nameIssue,false)
      }catch(e){
        console.log("Error " + e)
      }
    },
    async refresh(){
      try{
        this.issues = await queryAPI("","",true)
      }catch(e){
        console.log("ERROR REFRESH "+e)
      }
    },
    async exportIssue(){
      try{
        await exportIssues(this.issues)
      }catch(e){
        console.log(e);
      }
    }
  }
}

</script>

<template>
  <div class="todo">
    <div class="menu-container">
    <header>
      <div class="left">
        <a href="/">
          <img src="../assets/logo_gps.jpg" alt="logo">
        </a>
        <h1>{{room}}</h1>
      </div>
      <div class="right">
            <ul>              
              <div class="button-mod">
                <li> <a href="config">CONFIG</a></li>
              </div>   
              <div class="button-mod">
                <li> <a href="#">INVITAR</a></li>
              </div>
              <div class="button-mod" @click="issueOpen=true">
                <li> <i>&#8801;</i></li>
              </div>
            </ul>
          </div>
    </header>
    </div>
    <teleport to="body">
      <div class="show-issues" v-if="issueOpen">
          <div class="issueshead">
            <h1>{{project}}</h1>
            <div class="symbols-issues" @click="refresh">
              <p>&#11118;</p>
            </div>
            <div class="symbols-issues" @click="issueExport=true, issueOpen=false">
              <p>&#129045;</p>
            </div>
            <div @click="issueOpen = false" class="symbols-issues">
              <p>&#10006;</p>
            </div>
            
          </div>
          <form @submit.prevent="query">
            <div class="data">
              <div id="select-input">
                <select v-model="statusIssue">
                  <option value="all">...</option>
                  <option v-for="status in statusFilter"  :selected="status" >{{status}}</option>
                </select>
                <input type="text" name="username" placeholder="Escribe Status" v-model="nameIssue">
              </div>
            </div>
            <div class="data">
                <button type="submit">Buscar</button>
            </div>
          </form>
          <div class="issues">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Nombre de Issue</th>
                        <th scope="col">Status</th>
                        <th scope="col">Label</th>
                    </tr>
                </thead>
                <tbody v-for="{title,status,label,url} in issues" :key="issues.id">
                    <tr>
                        <td class="titulo" @click="actualIssue=title, actualIssueLink=url"><a>{{title}}</a></td> 
                        <td>{{status}}</td>
                        <td>{{label}}</td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>
      <div class="back-popup" v-if="issueExport">
        <div class="window-export">
          <div class="head-export">
            <h1>Issues from {{project}}</h1>
            <div class="export-symbols">
              <div class="symbols" @click="exportIssue">
                <p>&#129047;</p>
              </div>
              <div class="symbols" @click="issueExport=false">
                <p>&#10006;</p>
              </div>
            </div>
          </div>
          <div class="issues">
            <table>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre de Issue</th>
                        <th scope="col">Status</th>
                        <th scope="col">Labels</th>
                        <th scope="col">Commentarios</th>
                        <th scope="col">Asignados</th>
                        <th scope="col">Participantes</th>
                    </tr>
                </thead>
                <tbody v-for="{id,title,status,label,comment,assign,participant,url} in issues" :key="issues.id">
                    <tr>
                        <td><a :href="url" target="_blank">{{id}}</a></td>
                        <td class="titulo" @click="actualIssue=title"><a>{{title}}</a></td> 
                        <td>{{status}}</td>
                        <td>{{label}}</td>
                        <td>{{comment}}</td>
                        <td>{{assign}}</td>
                        <td>{{participant}}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </teleport>
    <div class="space"></div>
    <div class="centergame">
      <h1 v-if="actualIssue==''">Elige Issue</h1>
      <h1 v-else><a :href="actualIssueLink" target="_blank">{{actualIssue}}</a></h1>

      <div class="reveal">
        <p v-if="!pickcard">¡Elige tu carta!</p>
        <div v-if="pickcard" class="button-mod">
          <li> <a>¡Revelar!</a></li>
        </div>
      </div>
      <div class="singlecard">
        <div v-if="!pickcard" id="cardspace"></div>
        <div v-if="pickcard" id="card"></div>
        <p>{{user}}</p>
      </div>
    </div>
    <div class="footer-cards">
      <p>Elige tu carta 👇</p>
      <div class="layercard">
        <div @click="pickcard=true" class="card"> <p>0h</p> </div>
        <div @click="pickcard=true" class="card"> <p>1h</p> </div>
        <div @click="pickcard=true" class="card"> <p>2h</p> </div>
        <div @click="pickcard=true" class="card"> <p>3h</p> </div>
        <div @click="pickcard=true" class="card"> <p>5h</p> </div>
        <div @click="pickcard=true" class="card"> <p>8h</p> </div>
        <div @click="pickcard=true" class="card"> <p>13h</p> </div>
        <div @click="pickcard=true" class="card"> <p>21h</p> </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>