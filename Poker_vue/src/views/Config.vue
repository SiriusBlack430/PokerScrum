<script>
import {repoConfig} from "../store/query/actions"
import router from "../router";
export default{
    name: 'Config',
    data(){
        return{
            usuario:'',
            token:'',
            project:''
        }
    },
    methods:{
        async config(){
            try{
                const response = await repoConfig(this.usuario,this.token,this.project)
                console.log(response)
                router.push({
                    name:"game"
                })
            }catch(e){
                console.log(e)
            }
        }    
    }
}
</script>
<template>

<div class="container">
    <h2>CONFIGURATION</h2>
    <form @submit.prevent="config">
        <div class="data">
            <label for="repository">Usuario:</label>
            <input 
            type="text" 
            name="repository" 
            placeholder="Enter Repository Name"
            v-model="usuario"
            />
        </div>
        <div class="data">
            <label for="token">Personal access token:</label>
            <input 
            type="password" 
            name="token" 
            placeholder="Enter Token"
            v-model="token"
            />
        </div>
        <div class="data">
            <label for="project">Project Number:</label>
            <input 
            type="number" 
            name="project" 
            placeholder="Enter Project Number"
            v-model="project"
            />
        </div>
        <div class="data">
            <button type="submit">Save Information</button>
        </div>
    </form>
</div>
</template>

<style>

</style>