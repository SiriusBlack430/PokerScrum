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
    <div class="menu-container">
      <header>
        <div class="left">
          <a href="/">
            <img src="../assets/logo_gps.jpg" alt="logo">
          </a>
        </div>
        <div class="right">
          <ul>
            <div class="button-mod">
              <li> <a href="/register">REGISTRO</a></li>
            </div>  
          </ul>
        </div>
      </header>
    </div>
    <div class="container">
        <h2>LOGIN</h2>
        <div class="pops" v-if="showError"  @click="showError = false">
            <p>¡Datos Inválidos!</p>
        </div>
        <form @submit.prevent ="login">
            <div class="data">
                <label for="username">Usuario:</label>
                <input 
                type="text" 
                name="username" 
                placeholder="Escribe Usuario"
                required
                v-model="username"
                @click="showError = false"
                >
            </div>
            <div class="data">
                <label for="password">Contraseña:</label>
                <input 
                v-model="password"
                type="password" 
                name="password" 
                placeholder="Escribe Contraseña"
                required
                @click="showError = false"
                >
            </div>
            <div class="data">
                <button type="submit">Enviar</button>
            </div>
        </form>
    </div>
</template>

<style>
</style>