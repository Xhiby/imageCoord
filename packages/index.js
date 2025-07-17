import imageCoord from "./components/imageCoord.vue"

const components = [imageCoord]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
