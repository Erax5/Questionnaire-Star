import { createRouter, createWebHistory } from 'vue-router'
import FirstView from '../views/FirstView.vue'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import ListView from '../views/ListView.vue'
import ResultView from '../views/ResultView.vue'
import CreateView from '../views/CreateView.vue'
import UserView from '../views/UserView.vue'
import ThankYou from '../views/ThankYou.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'First',
      component: FirstView
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'Sign In',
      component: SignInView
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: SignUpView
    },
    {
      path: '/list',
      name: 'List',
      component: ListView
    },
    {
      path: '/results/:id',
      name: 'Result',
      component: ResultView,
    },
    {
      path: '/create',
      name: 'Quiz Creation',
      component: CreateView
    },
    {
      path: '/thank-you',
      name: 'ThankYou',
      component: ThankYou
    },
    {
      path: '/questionnaires/:id',
      name: 'User View',
      component: UserView,
    },
  ]
})

export default router
