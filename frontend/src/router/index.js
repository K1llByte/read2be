import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component:  () => import('../views/Home.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component:  () => import('../views/UserAccount.vue')
  },
  {
    path: '/users/:username',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/authors/:name',
    name: 'Author',
    component: () => import('../views/Author.vue')
  },
  {
    path: '/authors',
    name: 'Authors',
    component: () => import('../views/Authors.vue')
  },
  {
    path: '/genres/:genre',
    name: 'Genre',
    component: () => import('../views/Genre.vue')
  },
  {
    path: '/genres',
    name: 'Genres',
    component: () => import('../views/Genres.vue')
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/Friends.vue')
  },
  {
    path: '/books/:isbn',
    name: 'BookInfo',
    component: () => import('../views/BookInfo.vue')
  },
  {
    path: '/books',
    name: 'Books',
    component: () => import('../views/ShowBooks.vue')
  },
  {
    path: '/',
    name: 'StartPage',
    component:  () => import('../views/StartPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
