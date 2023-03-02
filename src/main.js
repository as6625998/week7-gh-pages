import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import { date, currency } from './methods/filters'
import $httpMessageState from '@/methods/pushMessageState'

import './assets/all.scss'

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})

// 設定預設語系
setLocale('zh_TW')

const app = createApp(App)
app.config.globalProperties.$filters = {
  date,
  currency
}
// 正常來說不建議太多方法掛 Global，這裡可以使用 provide 來處理
app.config.globalProperties.$httpMessageState = $httpMessageState

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('VueLoading', Loading)
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
