import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
