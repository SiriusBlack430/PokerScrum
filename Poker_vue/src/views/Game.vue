<script>
  import {queryAPI} from '../store/query/actions'
  import {exportIssues} from '../store/query/actions'
  import {mutationIssue} from '../store/query/actions'
  
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
        ids:[],
        user: localStorage.getItem('username'),
        room: localStorage.getItem('room'),
        hours:[2,4,8,12,16,20,24],
        hour: "",
        gamepresentation:false,
        issueOpen:false,
        issueExport:false,
        pickcard:false,
        vote:false,
        votemsg:false
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
      },
      getValue(v){ this.hour = v; },
      async votar(){
        try{
          await mutationIssue(this.ids[0],this.ids[1],this.ids[2],this.hour)
          this.pickcard=false
          this.votemsg=true
          this.actualIssue=""
        } catch(e){
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
              <li> <a href="/creategame">SALIR</a></li>
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
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody v-for="{id,title,status,url,projectId,estimationId,itemId} in issues" :key="issues.id">
              <tr>
                <td><a target="_blank" :href="url">{{id}}</a></td>
                <td class="titulo" @click="actualIssue=title,issueOpen=false,actualIssueLink=url,ids[0]=projectId,ids[1]=estimationId,ids[2]=itemId"><a>{{title}}</a></td> 
                <td>{{status}}</td>
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
                  <th scope="col">Asignados</th>
                  <th scope="col">Estimación</th>
                </tr>
              </thead>
              <tbody v-for="{id,title,status,label,assign,estimation,url} in issues" :key="issues.id">
                <tr>
                  <td><a :href="url" target="_blank">{{id}}</a></td>
                  <td class="titulo" @click="actualIssue=title"><a :href="url" target="_blank">{{title}}</a></td> 
                  <td>{{status}}</td>
                  <td>{{label}}</td>
                  <td>{{assign}}</td>
                  <td>{{estimation}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="back-message" v-if="votemsg"  @click="votemsg=false">
        <div class="message">
          <h1>¡Voto Realizado!</h1>
        </div>
      </div>
    </teleport>
    <div class="space"></div>
    <div class="centergame">
      <h1 v-if="actualIssue==''">Elige Issue</h1>
      <h1 v-else><a :href="actualIssueLink" target="_blank">{{actualIssue}}</a></h1>
      
      <div class="reveal">
        <p v-if="!pickcard">¡Elige tu carta!</p>
        <div @click="votar" v-if="pickcard" class="button-mod">
          <li> <a>¡Votar!</a></li>
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
        <div v-for="hour in hours" @click="pickcard=true, getValue(hour)" class="card"><p>{{hour}}h</p></div>
      </div>
    </div>
  </div>
</template>

<style>
  
</style>