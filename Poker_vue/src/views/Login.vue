<script >
import { LoginAPI } from '../store/login/actions'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      showError: false
    }
  },
  methods: {
    async login () {
        try{
            await LoginAPI(this.username, this.password)
        }catch(e){
            this.showError = true
            console.log(e)
        }  
    }
  }
}
</script>

<template>
    <div class="container">
        <h2>LOGIN</h2>
        <div class="pops" v-if="showError"  @click="showError = false">
            <p>Invalid Data!</p>
        </div>
        <form @submit.prevent ="login">
            <div class="data">
                <label for="username">Username:</label>
                <input 
                type="text" 
                name="username" 
                placeholder="Enter Username"
                required
                v-model="username"
                @click="showError = false"
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
                @click="showError = false"
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