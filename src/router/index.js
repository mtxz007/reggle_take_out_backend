import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/views/Login";
import main from "@/views/Main";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/index',
    component: main
  }
]

const router = new VueRouter({
  routes
})

export default router
