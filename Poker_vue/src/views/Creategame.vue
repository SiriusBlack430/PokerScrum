<script>
import {repoConfig} from '../store/query/actions'

export default {
  name:"gameConnection",
  data(){
    return{
      room:"",
      user:"",
      token:"",
      project:"",
      showError:false,
    }
  },
  methods:{
    async connection(){
      try{
        await repoConfig(this.user,this.token,this.project,this.room);
      }catch(e){
        this.showError=true;
        console.log("Error"+e)
      }
    }
  }
}


</script>
<template>
  <div class="menu-container">
  <header>
    <div class="left">
      <a href="/">
        <img src="https://boldworkplanner.com/wp-content/themes/boldworkplannertheme/imgs/logo-bold.svg" alt="logo">
      </a>
      <h1>Create Game</h1>
    </div>
  </header>
  </div>
  <div class="space"></div>
  <main>
    <div class="container">
      <h2>CONFIGURATION</h2>

    <!-- <form @submit.prevent="getNamefunction"> -->
      <div class="pops" v-if="showError"  @click="showError = false">
            <p>Invalid Data!</p>
        </div>
      <form @submit.prevent="connection">
        <div class="data">
            <label for="room">Room:</label>
            <input
            type="text" 
            name="room"
            v-model="room"
            placeholder="Enter Game Room"
            @click="showError = false"
            required
            >
        </div>
        <div class="data">
            <label for="repository">User:</label>
            <input 
            type="text" 
            name="repository" 
            placeholder="Enter Repository Name"
            @click="showError = false"
            v-model="user"
            />
        </div>
        <div class="data">
            <label for="token">Personal access token:</label>
            <input 
            type="password" 
            name="token" 
            placeholder="Enter Token"
            @click="showError = false"
            v-model="token"
            />
        </div>
        <div class="data">
            <label for="project">Project Number:</label>
            <input 
            type="number" 
            name="project" 
            placeholder="Enter Project Number"
            @click="showError = false"
            v-model="project"
            />
        </div>
        <div class="data">
            <button type="submit">Create Game</button>
        </div>
      </form>
    </div>
  </main>
</template>

<style>
</style>