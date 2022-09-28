import { createApp } from 'vue'
import App from './App.vue'
import { setupAxios } from './store/utils/axios/index';
import router from './router'

const app = createApp(App)

//Configuración Axios HTTP
setupAxios(app)

app.use(router)

app.mount('#app')
