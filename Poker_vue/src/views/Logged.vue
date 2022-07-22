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
      // const response = await axios({
      //   url: "http://localhost:3001/userList",
      //   method: "GET",
      //   headers:{
      //     Authorization: "Bearer "+token
      //   }
      // })
      // this.User = response.data.User
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
            <img src="https://boldworkplanner.com/wp-content/themes/boldworkplannertheme/imgs/logo-bold.svg" alt="logo">
          </a>
        </div>
        <div class="right">
          <ul>
            <li v-if="showUserList"> <a href="userlist">USERLIST</a></li>
            <li> <a href="/">LOGOUT</a></li>
            <div class="button-mod">
              <li> <a href="creategame">START NEW GAME</a></li>
            </div>
          </ul>
        </div>
      </header>
  </div>
  <div class="space"></div>
  <main>
    <div class="container">
      <p>Saved Games</p>
    </div>
    <div class="games">
        <article>
            <a href="#">
                <p>Sesión 1</p>
                <p>18/06/2022</p>
            </a>
        </article>
        <article>
            <a href="#">
                <p>Sesión</p>
                <p>20/06/2022</p>
            </a>
        </article>
        <article>
            <a href="#">
                <p>Sesión</p>
                <p>20/06/2022</p>
            </a>
        </article>
        <article>
            <a href="#">
                <p>Sesión</p>
                <p>20/06/2022</p>
            </a>
        </article>
        <article>
            <a href="#">
                <p>Sesión</p>
                <p>20/06/2022</p>
            </a>
        </article>
    </div>
  </main>
</template>

<style>
.games{
    width: 90%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

}
.games > article{
    width: 15rem;
    border: 0.2rem solid #3993ff;
    border-radius: 0.7rem;
    margin-top: 2rem;
    box-sizing: content-box;
    text-align: center;
}
</style>