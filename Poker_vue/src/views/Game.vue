<script>
import {queryAPI,exportIssues,checkSala} from '../store/query/actions'
import router from '../router'


export default{
  async beforeMount() {
    const check = await checkSala(this.$route.params.id)
    if(!check){
      router.push({name:"logged"})
      return
    }
    this.room = check.name
    
  },
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
      room: "",
      issueOpen:false,
      issueExport:false,
      pickcard:false,
      id: 0,
    }
  },
  async mounted() {
    try{
      this.id = this.$route.params.id
      this.issues = await queryAPI(this.statusIssue,this.nameIssue,false,this.id)
      this.project = this.issues[0].project
      this.statusFilter = Array.from(new Set(this.issues.map(tempObject => tempObject.status)));
    } catch(e){
        console.log("Error " + e)
    }
  },
  methods:{
    async query(){
      try{
        this.issues = await queryAPI(this.statusIssue,this.nameIssue,false,this.id)
      }catch(e){
        console.log("Error " + e)
      }
    },
    async refresh(){
      try{
        this.issues = await queryAPI("","",true,this.id)
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
    config(){
      router.push({name:'config'})
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
          <img src="https://boldworkplanner.com/wp-content/themes/boldworkplannertheme/imgs/logo-bold.svg" alt="logo">
        </a>
        <h1>{{room}} - {{$route.params.id}}</h1>
      </div>
      <div class="right">
            <ul>   
              <div class="button-mod">
                <li> <a href="/logged">Inicio</a></li>
              </div>           
              <div class="button-mod" @click="config">
                <li> <a >CONFIG</a></li>
              </div>   
              <div class="button-mod">
                <li> <a href="#">Invite Players</a></li>
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
                  <option value="all">All</option>
                  <option v-for="status in statusFilter"  :selected="status" >{{status}}</option>
                </select>
                <input type="text" name="username" placeholder="Enter Status" v-model="nameIssue">
              </div>
            </div>
            <div class="data">
                <button type="submit">Search</button>
            </div>
          </form>
          <div class="issues">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Name Issues</th>
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
      <div class="show-export" v-if="issueExport">
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
                        <th scope="col">Name Issues</th>
                        <th scope="col">Status</th>
                        <th scope="col">Labels</th>
                        <th scope="col">Description</th>
                        <th scope="col">Assignees</th>
                        <th scope="col">Participants</th>
                    </tr>
                </thead>
                <tbody v-for="{id,title,status,label,description,assign,participant,url} in issues" :key="issues.id">
                    <tr>
                        <td><a :href="url" target="_blank">{{id}}</a></td>
                        <td class="titulo" @click="actualIssue=title"><a>{{title}}</a></td> 
                        <td>{{status}}</td>
                        <td>{{label}}</td>
                        <td style="font-size:small">{{description}}</td>
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
      <h1 v-if="actualIssue==''">Choose Issue</h1>
      <h1 v-else><a :href="actualIssueLink" target="_blank">{{actualIssue}}</a></h1>

      <div class="reveal">
        <p v-if="!pickcard">Pick your cards!</p>
        <div v-if="pickcard" class="button-mod">
          <li> <a >Reveal cards</a></li>
        </div>
      </div>
      <div class="singlecard">
        <div v-if="!pickcard" id="cardspace"></div>
        <div v-if="pickcard" id="card"></div>
        <p>{{user}}</p>
      </div>
    </div>
    <div class="footer-cards">
      <p>Choose your card 👇</p>
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

.show-export{
  top: 0;
  width:100%;
  height: 100%;
  position: absolute;
  background: rgb(0,0,0,0.5);
}

.window-export{
  width: 90%;
  height: 85%;
  margin-top: 3%;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border-radius: 1.5rem;
  overflow: auto;
  padding: 1rem;
  text-align: center;
}

.head-export{
  width: 50%;
  display: flex;
  margin: auto;
}

.head-export > h1{
  width: 90%;
}

.export-symbols{
  display: flex;
  justify-content: space-between;
  width: 5rem;
}

.symbols{
  width: 4rem;
  margin: auto;
  border: 1px solid hsla(204,6%,68%,.4);
  border-radius: 1.5rem;
  cursor: pointer;
}

.symbols:hover{
  box-shadow: 0 2px 4px hsla(204,6%,68%,.4);
  background-color: #f3f4f7;
  transition: all .09s linear;
  cursor: pointer;
}

.symbols > p{
  margin: auto;
  padding: 0.5rem;
}

.titulo a{
  cursor: pointer;
}
.reload{
   font-family: Lucida Sans Unicode,
}

.button-mod > li > i {
  font-size: 170%;
  color: white ;
}

.todo{
  display: flex;
  flex-direction: column;
}

.show-issues{
  position: absolute;
  width: 35rem;
  display: flex;
  flex-direction: column;
  width: 30rem;
  background-color: #fff;
  border-top: 0.3rem solid;
  border-left: 0.3rem solid;
  border-bottom: 0.3rem solid;
  border-color: #dee2e6;
  bottom: 0;
  max-width: 100%;
  padding: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
  overflow: auto;
}

.show-issues > .issueshead{
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
}


.symbols-issues{
  margin: auto;
  margin-right: 0;
  height: 50%;
  width: 10%;
  border: 1px solid hsla(204,6%,68%,.4);
  border-radius: 1.5rem;
}

.symbols-issues:hover{
  box-shadow: 0 2px 4px hsla(204,6%,68%,.4);
  background-color: #f3f4f7;
  transition: all .09s linear;
  cursor: pointer;
}

.symbols-issues > p {
  text-align: center;
  margin: 0;
  padding: 0.5rem;
}

.dentro{
  width: 90%;
  margin: auto;
}
.top{
  display: flex;
  flex-direction: top;
  width: 100%;
}
.top > i{
  margin: auto;
}
.dentro > .data {
  width: 100%;
}
.show-issues > .dentro > .issues > table{
  width: 25rem;
  margin-bottom: 1rem;
}

.centergame{
  margin: auto;
  height: 30rem;
  width: 30rem;
  text-align: center;
}

.centergame > .reveal{
  margin: auto;
  background-color: #d7e9ff;
  border-style: solid;
  border-color: #87b4ec;
  border-radius: 0.8rem;
  width: 70%;
  height: 30%;
  margin-bottom: 2rem;
}

.centergame > .reveal > p {
  line-height: 6rem;
}

.centergame > .reveal > .button-mod {
  margin-top: 13%;
}

.centergame > .card{
  margin: auto;
  height: 40%;
  width: 30%;
}

.centergame > .singlecard > #card{
background: linear-gradient(45deg,#3993ff 12%,transparent 0,transparent 88%,#3993ff 0),linear-gradient(135deg,transparent 37%,#1a7bf2 0,#1a7bf2 63%,transparent 0),linear-gradient(45deg,transparent 37%,#3993ff 0,#3993ff 63%,transparent 0),#74b3ff;
  background-size: auto, auto, auto, auto;
background-size: 17px 17px;
border: 1px solid hsla(204,6%,68%,.4);
border-radius: .6rem;
box-shadow: 0 2px 4px hsla(204,6%,68%,.4);
height: 6rem;
width: 3.5rem;
margin: auto;
}

.centergame > .singlecard > #cardspace{
background: #a9aeb266;
border: 1px solid hsla(204,6%,68%,.4);
border-radius: .6rem;
box-shadow: 0 2px 4px hsla(204,6%,68%,.4);
height: 6rem;
width: 3.5rem;
margin: auto;
}

.centergame > .singlecard > img{
  width: 30%;
}

.centergame > .singlecard > p{
  font-weight: bold;
}

.footer-cards{
  text-align: center;
  margin: auto;
  width: 60%;
  padding: 2rem;
}

.footer-cards > .layercard{
  display: flex;
  justify-content: space-around;
}

.footer-cards > .layercard > .card{
  height: 6rem;
  width: 3.5rem;
  border: 2px solid #3993ff;
  cursor: pointer;
  transition: all .09s linear;
  border-radius: .8rem;
  margin: auto;
}

.footer-cards > .layercard > .card:hover{
  background-color: #ebf4ff;
}

.footer-cards > .layercard > .card > p{
  color: #3993ff;
  font-weight: 700;
  align-items: center;
  margin-top: 2rem
}

.show-issues > form > .data{
  margin: auto;
  width: 80%;
}

.data > #select-input{
  display: flex;
}

.data > #select-input > select{
  width: 25%;
}
.data > #select-input > input{
  width: 75%;
}
</style>