<template>
  <div class="wrap">
    <div class="container" ref="imgContainer">
      <img class="wrap-img" ref="imgRef" :src="config.imgUrl" @load="handleResize" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, reactive, defineExpose } from "vue"

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      imgUrl: "",
      originX: 0,
      originY: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      showBoundary: true,
      showAxis: true
    })
  }
})

const rules = reactive({
  originX: [
    {
      type: "number",
      min: 0,
      max: 100,
      message: "原点X轴位置必须在0%到100%之间",
      trigger: "blur"
    }
  ],
  originY: [
    {
      type: "number",
      min: 0,
      max: 100,
      message: "原点Y轴位置必须在0%到100%之间",
      trigger: "blur"
    }
  ],
  x: [
    {
      type: "number",
      trigger: "blur"
    }
  ],
  y: [
    {
      type: "number",
      trigger: "blur"
    }
  ]
})

const { config } = toRefs(props)

const imgContainer = ref(null)
const imgRef = ref(null)

let boxData = {}

let originPosition = { x: 0, y: 0 }

const payload = {
  width: 30,
  height: 30,
  color: "red"
}

onMounted(() => {})

const handleResize = () => {
  setAxis()

  drawBoundaryLines(imgContainer.value, boxData)
  drawAxisLines(imgContainer.value)
}

const valueValidate = () => {
  const values = config.value
  const errors = []

  for (const key in rules) {
    const ruleList = rules[key]
    const value = parseFloat(values[key])

    for (const rule of ruleList) {
      if (value < rule.min || value > rule.max) {
        errors.push(rule.message)
        break
      }
    }
  }

  if (errors.length > 0) {
    console.error("参数校验失败：", errors)
    throw new Error(errors)
    return false
  }

  return true
}

const setAxis = () => {
  autoCalibration()
  originPosition = convertToPixelByView(config.value.x, config.value.y)
}

const convertToPixelByView = (x, y) =>
  convertToPixel(x, y, boxData, imgRef.value, config.value.width, config.value.height)

const convertToPixel = (imgX, imgY, box, imgDom, realWidth, realHeight) => {
  const { left, right, top, bottom } = box

  const pixelWidth = right - left
  const pixelHeight = bottom - top

  const relAPx = (imgX / (realWidth / 2)) * (pixelWidth / 2)
  const relBPx = (imgY / realHeight) * pixelHeight

  const originX = config.value.originX / 100
  const originY = config.value.originY / 100
  const pxX = (left + right) * originX + relAPx
  const pxY = (top + bottom) * originY + relBPx

  const rect = imgDom.getBoundingClientRect()
  const scaleX = rect.width / imgDom.naturalWidth
  const scaleY = rect.height / imgDom.naturalHeight

  return {
    x: pxX * scaleX,
    y: pxY * scaleY
  }
}

const setCoordinateRange = () => {
  const width = parseFloat(config.value.width)
  const height = parseFloat(config.value.height)
  const originX = parseFloat(config.value.originX)
  const originY = parseFloat(config.value.originY)

  const xMin = -width * (originX / 100)
  const xMax = width + xMin
  rules.x[0].min = xMin
  rules.x[0].max = xMax
  rules.x[0].message = `X坐标范围为 [${xMin}, ${xMax}]`

  const yMin = -height * (originY / 100)
  const yMax = height + yMin
  rules.y[0].min = yMin
  rules.y[0].max = yMax
  rules.y[0].message = `Y坐标范围为 [${yMin}, ${yMax}]`

  console.log("rules: ", rules)
}

const drawDot = () => {
  const validateRes = valueValidate()
  if (validateRes) {
    removeDot()

    originPosition = convertToPixelByView(config.value.x, config.value.y)

    const container = imgContainer.value
    const dot = document.createElement("div")
    dot.className = "moving-dot"
    dot.style.position = "absolute"
    dot.style.borderRadius = "50%"
    dot.style.width = `${payload.width}px`
    dot.style.height = `${payload.height}px`
    dot.style.backgroundColor = payload.color
    dot.style.pointerEvents = "none"
    dot.style.zIndex = 10
    dot.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)"
    dot.style.left = `${originPosition.x - payload.width / 2}px`
    dot.style.top = `${originPosition.y - payload.height / 2}px`

    container.appendChild(dot)
  }
}

const removeDot = () => {
  const imgCon = imgContainer.value
  const dot = imgCon.querySelector(".moving-dot")

  if (dot) {
    imgCon.removeChild(dot)
  }
}

const createBoundaryLine = style => {
  const line = document.createElement("div")
  line.className = "showBoundary-line"
  Object.assign(line.style, {
    position: "absolute",
    backgroundColor: "red",
    zIndex: 80,
    pointerEvents: "none",
    ...style
  })

  if (config.value.showBoundary === false) {
    line.style.opacity = 0
  }

  return line
}

const createAxisLine = style => {
  const line = document.createElement("div")
  line.className = "showAxis-line"
  Object.assign(line.style, {
    position: "absolute",
    backgroundColor: "Green",
    zIndex: 80,
    pointerEvents: "none",
    ...style
  })

  if (config.value.showAxis === false) {
    line.style.opacity = 0
  }

  return line
}

const drawBoundaryLines = (container, data) => {
  container.querySelectorAll(".showBoundary-line").forEach(el => {
    if (el) {
      el.remove()
    }
  })

  const { left, right, top, bottom } = data

  const rect = container.querySelector("img").getBoundingClientRect()
  const scaleX = rect.width / container.querySelector("img").naturalWidth
  const scaleY = rect.height / container.querySelector("img").naturalHeight

  const pxLeft = left * scaleX
  const pxRight = right * scaleX
  const pxTop = top * scaleY
  const pxBottom = bottom * scaleY

  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxTop}px`,
      width: "4px",
      height: `${pxBottom - pxTop}px`
    })
  )

  container.appendChild(
    createBoundaryLine({
      left: `${pxRight}px`,
      top: `${pxTop}px`,
      width: "4px",
      height: `${pxBottom - pxTop}px`
    })
  )

  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxTop}px`,
      width: `${pxRight - pxLeft}px`,
      height: "4px"
    })
  )

  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxBottom}px`,
      width: `${pxRight - pxLeft}px`,
      height: "4px"
    })
  )
}

const drawAxisLines = container => {
  container.querySelectorAll(".showAxis-line").forEach(el => {
    if (el) {
      el.remove()
    }
  })

  container.appendChild(
    createAxisLine({
      left: `0px`,
      top: `${originPosition.y}px`,
      width: `100%`,
      height: "2px"
    })
  )

  container.appendChild(
    createAxisLine({
      left: `${originPosition.x}px`,
      top: `0px`,
      width: `2px`,
      height: "100%"
    })
  )
}

const autoCalibration = () => {
  boxData = getImageCropRect(imgContainer.value, imgRef.value)
}

const getImageCropRect = (container, img) => {
  if (!container || !img) return null

  const containerRect = container.getBoundingClientRect()
  const imageRect = img.getBoundingClientRect()

  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight

  const imageWidth = imageRect.width
  const imageHeight = imageRect.height

  const containerWidth = containerRect.width
  const containerHeight = containerRect.height

  const scaleX = naturalWidth / imageWidth
  const scaleY = naturalHeight / imageHeight

  const offsetLeft = (containerWidth - imageWidth) / 2
  const offsetTop = (containerHeight - imageHeight) / 2

  const left = Math.round(offsetLeft * scaleX)
  const right = Math.round(containerWidth * scaleX - left)
  const top = Math.round(offsetTop * scaleY)
  const bottom = Math.round(containerHeight * scaleY - top)

  return { left, right, top, bottom }
}

const changeBoundary = () => {
  drawBoundaryLines(imgContainer.value, boxData)
}

const changeAxis = () => {
  setAxis()
  drawAxisLines(imgContainer.value)
}

defineExpose({
  drawDot
})
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 80%;
    position: relative;
    .wrap-img {
      width: 100%;
    }
  }
}
</style>
