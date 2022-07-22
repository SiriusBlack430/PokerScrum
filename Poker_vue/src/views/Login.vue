<script >
import { LoginAPI } from '../store/login/actions'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      showError: ''
    }
  },
  methods: {
    async login () {
        try{
            if(this.username=="" || this.password==""){
                console.log('No puede haber campos vacios');
            }else{
                await LoginAPI(this.username, this.password)
            }
        }catch(e){
            this.showError = e.message
            console.log(e)
        }  
    }
  }
}
</script>

<template>
    <div class="container">
        <h2>LOGIN</h2>
        <div class="pops" v-if="showError!==''">{{showError}}</div>
        <form @submit.prevent ="login">
            <div class="data">
                <label for="username">Username:</label>
                <input 
                type="text" 
                name="username" 
                placeholder="Enter Username"
                required
                v-model="username"
                >
            </div>
            <div class="data">
                <label for="password">Password:</label>
                <input 
                v-model="password"
                type="password" 
                name="password" 
                placeholder="Enter Password"
                required
                >
            </div>
            <div class="data">
                <button type="submit">Enter</button>
            </div>
            <div>
                <a href="register">Regístrate</a>
            </div>
        </form>
    </div>
</template>

<style>
</style>