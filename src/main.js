import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// import 'vue-select/dist/vue-select.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './components/base/style/common.css'

createApp(App).use(store).use(router).mount('#app')
