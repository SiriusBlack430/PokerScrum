import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta:{
        auth:false
      },
      component: () => import ('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta:{
        auth:false
      },
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta:{
        auth:false
      },
      component: () => import('../views/Register.vue')
    },
    {
      path: '/creategame',
      name: 'creategame',
      component: () => import('../views/Creategame.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/Game.vue')
    },
    {
      path: '/userlist',
      name: 'userlist',
      component: () => import('../views/Userlist.vue')
    },
    {
      path: '/logged',
      name: 'logged',

      component: () => import('../views/Logged.vue')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('../views/Config.vue')
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if(to.name==="home"){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('permiss')
  }
  if(to.meta.auth === false){
    next()
  }else{
    if(localStorage.getItem('token')!==null){
      next()
    }else{
      next({name:"login"})
    }
  }
}) 

export default router
