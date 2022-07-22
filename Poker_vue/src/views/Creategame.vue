<script>
import {queryAPI} from '../store/query/actions'

export default{
  name: 'CreateGame',
  data() {
    return {
      gameName:'',
      usuario:'',
      token:'',
      project:''
    }
  },
  methods: {
    async checkConfig(){

    }
  },
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
      <form @submit.prevent="checkConfig">
        <div class="data">
            <input 
            type="text" 
            name="gameName" 
            v-model="gameName"
            placeholder="Enter Game Name"
            required
            >
        </div>
        <div class="data">
            <label for="repository">Usuario:</label>
            <input 
            type="text" 
            name="repository" 
            placeholder="Enter Repository Name"
            v-model="usuario"
            />
        </div>
        <div class="data">
            <label for="token">Personal access token:</label>
            <input 
            type="password" 
            name="token" 
            placeholder="Enter Token"
            v-model="token"
            />
        </div>
        <div class="data">
            <label for="project">Project Number:</label>
            <input 
            type="number" 
            name="project" 
            placeholder="Enter Project Number"
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