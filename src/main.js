import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

import '@/styles/index.scss'

Vue.use(ElementUI)
Vue.config.productionTip = false

//注册一个全局守卫，作用是在路由跳转前，对路由进行判断，防止未登陆的用户跳转到其他页面去
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('mytoken')
  //如果已经登陆，那么就不干涉
  if (token) {
    next()
  } else {
    if (to.path !== '/login') {
      //如果没有登陆就跳转到登陆页
      next({path: '/login'})
    } else {
      //如果没有登陆，但是访问的是login，不干涉
      next()
    }
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app')