<script>
import {queryAPI} from '../store/query/actions'

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
      user: localStorage.getItem('username'),
      room: localStorage.getItem('room'),
      isOpen:false,
      pickcard:false
    }
  },
  async mounted() {
    try{
      this.issues = await queryAPI(this.statusIssue,this.nameIssue)
      this.project = this.issues[0].project
      this.statusFilter = Array.from(new Set(this.issues.map(tempObject => tempObject.status)));
    } catch(e){
      console.log("ERROR MOUNTED"+e);
    }
  },
  methods:{
    async query(){
      try{
       this.issues = await queryAPI(this.statusIssue,this.nameIssue)
      }catch(e){
        console.log("Error " + e)
      }
    },
    async refresh(){
      try{
        this.issues = await queryAPI("",true)
      }catch(e){
        console.log("ERROR REFRESH "+e)
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
          <img src="https://boldworkplanner.com/wp-content/themes/boldworkplannertheme/imgs/logo-bold.svg" alt="logo">
        </a>
        <h1>{{room}}</h1>
      </div>
      <div class="right">
            <ul>              
              <div class="button-mod">
                <li> <a href="config">CONFIG</a></li>
              </div>   
              <div class="button-mod">
                <li> <a href="#">Invite Players</a></li>

              </div>
              <div class="button-mod" @click="isOpen=true">
                <li> <i class="fa fa-bars" aria-hidden="true"></i></li>
              </div>
            </ul>
          </div>
    </header>
    </div>
    <teleport to="body">
      <div class="show-issues" v-if="isOpen">
          <div class="issueshead">
            <h1>{{project}}</h1>
            <div  class="close-issues" @click="refresh">
              <p class=reload>&#x21bb;</p>
            </div>
            <div @click="isOpen = false" class="close-issues">
              <p>X</p>
            </div>    
            
          </div>
          <form @submit.prevent="query">
            <div class="data">

              <div id="select-input">
                <select v-model="statusIssue">
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
            <table >
                <thead>
                    <tr>
                        <th scope="col">Name Issues</th>
                        <th scope="col">Status</th>
                        <th scope="col">Label</th>
                    </tr>
                </thead>
                <tbody v-for="{title,status,label} in issues" :key="issues.id">
                    <tr>
                        <td class="titulo" @click="this.actualIssue=title"><a>{{title}}</a></td> 
                        <td>{{status}}</td>
                        <td>{{label}}</td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>
    </teleport>
    <div class="space"></div>
    <div class="centergame">
      <h1 v-if="actualIssue==''">Choose Issue</h1>
      <h1 v-else>{{actualIssue}}</h1>

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
        <div @click="pickcard=true" class="card"> <p>0</p> </div>
        <div @click="pickcard=true" class="card"> <p>1</p> </div>
        <div @click="pickcard=true" class="card"> <p>2</p> </div>
        <div @click="pickcard=true" class="card"> <p>3</p> </div>
        <div @click="pickcard=true" class="card"> <p>5</p> </div>
        <div @click="pickcard=true" class="card"> <p>8</p> </div>
        <div @click="pickcard=true" class="card"> <p>13</p> </div>
        <div @click="pickcard=true" class="card"> <p>21</p> </div>
        <div @click="pickcard=true" class="card"> <p>34</p> </div>
        <div @click="pickcard=true" class="card"> <p>55</p> </div>
        <div @click="pickcard=true" class="card"> <p>89</p> </div>
        <div @click="pickcard=true" class="card"> <p>?</p> </div>
      </div>
    </div>
  </div>
</template>

<style>


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
}

.issueshead > .close-issues{
  margin: auto;
  margin-right: 0;
  height: 50%;
  width: 10%;
  border: 1px solid hsla(204,6%,68%,.4);
  border-radius: 1.5rem;
}

.issueshead > .close-issues:hover{
  box-shadow: 0 2px 4px hsla(204,6%,68%,.4);
  background-color: #f3f4f7;
  transition: all .09s linear;
  cursor: pointer;
}

.close-issues > p {
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