import { createApp } from "vue"

import App from "./App.vue"
import router from "./router"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

import imageCoord from "/packages/index.js"

import "./assets/styles/index.css"

const app = createApp(App)

app.use(router)

app.use(ElementPlus)

app.use(imageCoord)

app.mount("#app")
