import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import ListView from '../views/ListView.vue'
import ResultView from '../views/ResultView.vue'
import ChooseQView from '../views/CreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/result',
      name: 'Result',
      component: ResultView
    },
    {
      path: '/createquiz',
      name: 'Choose question type',
      component: ChooseQView
    },
  ]
})

export default router
