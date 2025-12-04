import { createApp } from 'vue'
import App from './App.js'
import router from './router/index.js'
import store from './store/index.js'

// Инициализируем Vue приложение
const app = createApp(App)

app.use(store)
app.use(router)

// Монтируем приложение
app.mount('#app')

console.log('🎉 NutriPlanner успешно запущен!')