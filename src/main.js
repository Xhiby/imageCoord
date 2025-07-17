import { createApp } from "vue"
import App from "./App.vue"

import imageCoord from "/packages/index.js"

const app = createApp(App)

app.use(imageCoord)

app.mount("#app")
