import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Post from '@/components/Post'
import ProgressBar from '@/components/ProgressBar'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    // console.log('scroll', to.path, from.path, savedPosition)
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(savedPosition.x, savedPosition.y)
        // console.log('top', window.document.body.scrollTop)
        // return savedPosition
      }, 200)
    } else {
      if (to.name === 'Post') {
        return { x: 0, y: 0 }
      }
    }
  },
  routes: [
    {
      path: '/',
      name: 'List',
      component: List,
      meta: { keepAlive: true }
    },
    {
      path: '/post/:id',
      name: 'Post',
      component: Post
    },
    { path: '*', redirect: '/' }
  ]
})
