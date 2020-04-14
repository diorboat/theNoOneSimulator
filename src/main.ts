import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElmentUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'jCp9AXG6GceZO2UAiN7zY2TUtVrYZc9f'
})
Vue.use(ElmentUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
