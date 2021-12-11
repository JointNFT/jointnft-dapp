import Vue from 'vue'
import App from './App.vue'
import store from './store'
import "./index.css"
import vuetify from './plugins/vuetify'
import Router from 'vue-router'
import Routes from './routes'
import VueToastify from "vue-toastify";

Vue.config.productionTip = false
Vue.use(Router);
Vue.use(VueToastify);


const router = new Router({
  mode: 'history',
  routes: Routes
})

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
