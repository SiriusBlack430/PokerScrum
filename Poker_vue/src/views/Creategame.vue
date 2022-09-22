<script>
import {repoConfig} from '../store/query/actions'

export default {
  name:"gameConnection",
  data(){
    return{
      room:"",
      name:"",
      token:"",
      project:"",
      userOrg:"",
      showError:false,
      issuesLoad:false,
    }
  },
  methods:{
    async connection(){
      try{
        await repoConfig(this.userOrg,this.name.split(' ').join(''),this.token.split(' ').join(''),this.project,this.room.split(' ').join(''));
        issuesLoad=true
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
      <h1>Crear Sala</h1>
    </div>
  </header>
  </div>
  <div class="space"></div>
  <main>
    <div class="container">
      <h2>CONFIGURACIÓN</h2>

      <div class="pops" v-if="showError"  @click="showError = false">
            <p>Invalid Data!</p>
        </div>
      <form @submit.prevent="connection">
        <div class="data">
            <label for="room">Nombre:</label>
            <input
            type="text" 
            name="room"
            v-model="room"
            placeholder="Nombre de la Sala"
            @click="showError = false"
            required
            >
        </div>
        <div class="data">
            <select id="selectUserOrg" v-model="userOrg">
              <option value="user">USUARIO</option>
              <option value="org">ORGANIZACIÓN</option>
            </select>
            <input 
            type="text" 
            name="name"
            placeholder="Nombre de Usuario u Organización"
            @click="showError = false"
            v-model="name"
            />
        </div>
        <div class="data">
            <label for="token">Token Personal:</label>
            <input 
            type="password" 
            name="token" 
            placeholder="Escribir Token"
            @click="showError = false"
            v-model="token"
            />
        </div>
        <div class="data">
            <label for="project">Número de Proyecto:</label>
            <input 
            type="number" 
            name="project" 
            placeholder="Escribir Número del Proyecto"
            @click="showError = false"
            v-model="project"
            />
        </div>
        <div class="data">
            <button type="submit">Crear Sala</button>
        </div>
      </form>
    </div>
    <teleport to="body">
      <div class="back-popup" v-if="issuesLoad">
        <div class="loading">
          <div class="info">
            <p>&#128260;</p>
            <h2>Cargando</h2>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<style>
.loading{
  width: 28rem;
  height: 10rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20rem;
  background-color: white;
  border-radius: 1.5rem;
  overflow: auto;
  padding: 1rem;
  text-align: center;
}

.loading > .info{
  width: 50%;
  display: flex;
  justify-content: space-between
}

.loading > .info > p{
  font-size: 3rem;
}

.loading > .info > h2 {
  font-size: 2.5rem;
  padding-top:1.25rem
}

#selectUserOrg{
  width: 8rem;
  margin-bottom: 0.5rem;
}

</style>