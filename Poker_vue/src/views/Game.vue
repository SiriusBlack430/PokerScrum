<script>

import {queryAPI} from '../store/query/actions'


export default{
  name: "Query",
  data(){
    return{
      issues:[],
      status: "",
      user: localStorage.getItem('username'),
      isOpen:false
    }
  },
  methods:{
    async query(){
      try{
        if(this.status===""){
          console.log("Error")
          return
        }
       this.issues = await queryAPI(this.status)

      }catch(e){
        console.log("Error")
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
        <h1></h1>
      </div>
      <div class="right">
            <ul>
              <li>{{user}}</li>
              <div class="button-mod">
                <li> <a href="config">CONFIG</a></li>
              </div>
              <div class="button-mod">
                <li> <a href="#">New Players</a></li>
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
        <div >
          <div >
            <h1>Issues from Repository Github</h1>
            <i @click="isOpen = false" class="fa fa-window-close" aria-hidden="true"></i>
          </div>
          <form @submit.prevent="query">
            <div class="data">
                <input 
                type="text" 
                name="username" 
                placeholder="Enter Status" 
                v-model="status"
                >
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
                    <tr >
                        <td>{{title}}</td> 
                        <td>{{status}}</td>
                        <td>{{label}}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </teleport>
    <div class="space"></div>
  </div>
</template>

<style>
.button-mod > li > i {
  font-size: 170%;
  color: white ;
}
.todo{
  position: relative;
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
</style>