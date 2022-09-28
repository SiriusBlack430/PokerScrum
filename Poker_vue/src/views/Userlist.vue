<script>
import axios from 'axios';
export default {
  name: "get-UserList",
  data() {
    return {  
      User:{} 
    }
  },
  async mounted(){
    try{
      const token = localStorage.getItem('token')
      if(token==null) return;
      const response = await axios({
        url: "api/v1/userList",
        method: "GET",
        headers:{
          Authorization: "Bearer "+token
        }
      })
      this.User = response.data.user
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
      <h1>User List</h1>
    </div>
  </header>
  </div>
  <div class="space"></div>
  <main>
    <article>
        <table>
            <thead>
                <tr>
                    <th scope="col">Usuario</th>
                    <th scope="col">Privilegios</th>
                    <th scope="col"><p>Modificar</p></th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="{username,permiss} in User" :key="User.id">
                    <td>{{username}}</td> 
                    <td>{{permiss}}</td>
                    <td>
                      <div class="right">
                        <ul>
                          <div class="button-mod">
                            <li>EDITAR</li>
                          </div>
                          <div class="button-mod">
                            <li>BORRAR</li>
                          </div>
                          </ul>
                      </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </article>
  </main>
</template>

<style>
table > thead > tr > th > p{
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 13rem;
}
</style>