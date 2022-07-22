<script>
import { RegisterAPI } from "../store/login/actions";

export default {
  name: 'Register',
  data () {
    return {
      username: '',
      password: '',
      password2:'',
      showError: false,
      passwordMatch: true
    }
  },
  methods: {
    async register () {
        try{     
            if(this.username==="" || this.password==="" || this.password2===""){
                console.log('No puede haber campos vacios');
            }else{
                if(this.password === this.password2){
                    await RegisterAPI(this.username, this.password)
                }else{
                    this.passwordMatch = false;
                }
            }            
        }catch(e){
            this.showError = true
        }
    }
  }
}

</script>

<template>
<div class="container">
    <h2>REGISTER</h2>
    <div v-if="showError">Error</div>
    <div v-else-if="!passwordMatch">Contraseñas no coinciden</div>
    <form @submit.prevent="register">
        <div class="data">
            <label for="username">Username:</label>
            <input 
            type="text" 
            name="username" 
            placeholder="Enter Username"
            v-model="username"
            >
        </div>
        <div class="data">
            <label for="password">Password:</label>
            <input type="password" name="password" placeholder="Enter Password"
            v-model="password"
            >
        </div>
        <div class="data">
            <label for="password2">Confirm Password:</label>
            <input type="password" name="password2" placeholder="Corfirm Password"
            v-model="password2">
        </div>
        <div class="data">
            <button type="submit">Enter</button>
        </div>
        <div>
            <a href="login">Login</a>
        </div>
    </form>
</div>
</template>

<style>
</style>