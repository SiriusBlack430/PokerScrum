<script>
import {updateRepoConfig, getRepoConfig} from "../store/query/actions"
import router from "../router";
export default{
    name: 'Config',
    data(){
        return{
            actual: {
                login:'',
                token:'',
                project:'',
                startDate:'',
                type:'',
                room:''
            },
            modified:{
                login:'',
                token:'',
                project:'',
                startDate:'',
                type:'',
                room:''  
            }
            
        }
    },
    async mounted(){
        try{
            const data = await getRepoConfig(this.$route.params.id)
            this.actual.login = data.LOGIN
            this.actual.project = data.PROJECT
            this.actual.type = data.TYPE
            this.actual.room = data.NAME
            this.actual.startDate = data.PROGRAMED_DATE.replace('Z','').substring(0,16) // solo hasta minutos
            this.modified.login = data.LOGIN
            this.modified.project = data.PROJECT
            this.modified.type = data.TYPE
            this.modified.room = data.NAME
            this.modified.startDate = data.PROGRAMED_DATE.replace('Z','').substring(0,16) // solo hasta minutos
        }catch(e){
            console.log("Error " + e)
        }
    },
    methods:{
        shallowEqual(object1, object2) {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (let key of keys1) {
                if (object1[key] !== object2[key]) {
                return false;
                }
            }
            return true;
        },
        async updateConfig(){
            try{
                if(! this.shallowEqual(this.actual,this.modified)){
                    await updateRepoConfig(this.modified,this.$route.params.id)
                }
                router.push({
                    name:"game",params:{ id: this.$route.params.id }
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
    <form @submit.prevent="updateConfig">
        <div class="data">
            <label for="room">Room Name:</label>
            <input
            type="text" 
            name="room"
            v-model="modified.room"
            placeholder="Enter Game Room"
            @click="showError = false"
            required
            >
        </div>
        <div class="data">
            <label for="repository">Login:</label>
            <select style="padding:3px;" v-model="modified.type">
              <option value="user">user</option>
              <option value="organization">organization</option>
            </select>
            <input 
            type="text" 
            name="repository" 
            placeholder="Enter User or Organization Name"
            v-model="modified.login"
            />
        </div>
        <div class="data">
            <label for="token">Personal access token:</label>
            <input 
            type="password" 
            name="token" 
            placeholder="Enter Token"
            v-model="modified.token"
            />
        </div>
        <div class="data">
            <label for="project">Project Number:</label>
            <input 
            type="number" 
            name="project" 
            placeholder="Enter Project Number"
            v-model="modified.project"
            />
        </div>
        <div class="data">
          <label for="start">Start date:</label>
          <input type="datetime-local" 
          id="startDate" 
          name="trip-start"
          v-model="modified.startDate"
          >
        </div>
        <div class="data">
            <button type="submit">Save Information</button>
        </div>
    </form>
</div>
</template>

<style>

</style>