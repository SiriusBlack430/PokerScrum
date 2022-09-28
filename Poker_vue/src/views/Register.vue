<script>
    import { RegisterAPI } from "../store/login/actions";
    
    export default {
        name: 'Register',
        data () {
            return {
                username: '',
                password: '',
                password2:'',
                wrongFields: false,
                showError: false,
                passwordMatch: false
            }
        },
        methods: {
            async register () {
                try{

                    if(this.username!=="" && this.password!=="" && this.password2!==""){
                        if(this.password === this.password2){
                            await RegisterAPI(this.username, this.password)
                        }else{
                            this.passwordMatch = true;
                        }
                    } else this.wrongFields=true;
                }catch(e){
                    this.showError = true
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
              <li> <a href="/login">LOGIN</a></li>
            </div>  
          </ul>
        </div>
      </header>
    </div>
    <div class="container">
        <h2>REGISTRO</h2>
        <div class="pops" v-if="wrongFields" @click="wrongFields = false">
            <p>¡Campos inválidos!</p>
        </div>
        <div class="pops" v-if="showError" @click="showError = false">
            <p>¡Usuario Existente!</p>
        </div>
        <div class="pops" v-else-if="passwordMatch" @click="passwordMatch = false">
            <p>Las contraseñas no coinciden</p>
        </div>
        <form @submit.prevent="register">
            <div class="data">
                <label for="username">Usuario:</label>
                <input 
                type="text" 
                name="username" 
                placeholder="Escribe Usuario"
                v-model="username"
                >
            </div>
            <div class="data">
                <label for="password">Contraseña:</label>
                <input type="password" name="password" placeholder="Escribe Contraseña"
                v-model="password"
                >
            </div>
            <div class="data">
                <label for="password2">Confirma Contraseña:</label>
                <input type="password" name="password2" placeholder="Corfirma Contraseña"
                v-model="password2">
            </div>
            <div class="data">
                <button type="submit">Enviar</button>
            </div>
        </form>
    </div>
</template>

<style>
</style>