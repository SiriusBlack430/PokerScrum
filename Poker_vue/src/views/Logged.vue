<script>
import { LoggedAPI } from '../store/login/actions'
import router from '../router'
export default {
  name: "get-rules",
  data() {
    return {  
      admin: false,
      sessions:[]
    }
  },
  async mounted(){
    try{
      const token = localStorage.getItem('token')
      const permiss = localStorage.getItem('permiss')
      const id = localStorage.getItem('id')
      if(token==null) return;
      if(permiss=='ADMIN'){
        this.admin = true;
      } 
     this.sessions  = await LoggedAPI(id)
    }catch(e){
      console.log(e)
    }
  },
  methods: {
    goTo(idGame){
      try{
        router.push({ name:"game", params:{ id: idGame }})
      }catch(e){
        console.log(e);
      }
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
        </div>
        <div class="right">
          <ul>
            <li v-if="admin"> <a href="userlist">USERLIST</a></li>
            <li v-if="admin"> <a type="button"  href="creategame" >START NEW GAME</a></li>
            <li> <a href="/">LOGOUT</a></li>

          </ul>
        </div>
      </header>
  </div>
  <div class="space"></div>
  <main class="grid">
   <!--  <div class="maintenance">
      <h1>Page in Maintenance</h1>
      <div class="games">
        <img src="https://www.clipartkey.com/mpngs/m/184-1849588_maintenance-website-landing-page.png" alt="centro">
      </div>
    </div> -->
    <div v-for="{name,programed_date,id} in sessions">
        <div style="border: 1px solid; text-align:center;cursor: pointer;" @click="goTo(id)" >
          <h1>{{name}}</h1>
          <p>{{ programed_date}}</p>
        </div> 
    </div>
  </main>
</template>

<style>
.grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
main{
  width:100%
}

.maintenance{
  width: 80rem;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.maintenance > h1{
  margin-top: 10rem;
}

.games{
    width: 50%;
    box-shadow: 0 4px 8px hsla(204,6%,68%,.4);
    border-radius: 1.5rem;
}

.games > img{
  width:100%;
}
</style>