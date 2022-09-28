<script>
import axios from 'axios';
export default {
  name: "get-rules",
  data() {
    return {  
      // User:{},
      showUserList: false
    }
  },
  async mounted(){
    try{
      const token = localStorage.getItem('token')
      const permiss = localStorage.getItem('permiss')
      if(token==null) return;
      if(permiss=='ADMIN') this.showUserList = true;
    }catch(e){
      console.log(e)
    }
  }
}

</script>

<template>
  <div class="menu-container">
      <header>
        <div class="left">
          <a href="/">
            <img src="../assets/logo_gps.jpg" alt="logo">
          </a>
        </div>
        <div class="right">
          <ul>
            <li v-if="showUserList"> <a href="/userlist">USERLIST</a></li>
            <li> <a href="/">SALIR</a></li>
            <li> <a type="button"  href="/creategame" >NUEVO JUEGO</a></li>

          </ul>
        </div>
      </header>
  </div>
  <div class="space"></div>
  <main>
    <div class="maintenance">
      <h1>Página en Mantenimiento</h1>
      <div class="games">
        <img src="https://www.clipartkey.com/mpngs/m/184-1849588_maintenance-website-landing-page.png" alt="centro">
      </div>
    </div>
  </main>
</template>

<style>
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