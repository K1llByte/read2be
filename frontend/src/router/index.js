import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'StartPage',
    component:  () => import('../views/StartPage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component:  () => import('../views/Home.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/users/:username',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/authors',
    name: 'Authors',
    component: () => import('../views/Authors.vue')
  },
  {
    path: '/authors/:name',
    name: 'Author',
    component: () => import('../views/Author.vue')
  },
  {
    path: '/books',
    name: 'Books',
    component: () => import('../views/ShowBooks.vue')
  },
  {
    path: '/books/:isbn',
    name: 'BookInfo',
    component: () => import('../views/BookInfo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
