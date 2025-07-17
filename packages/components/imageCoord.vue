<template>
  <div class="wrap">
    <div class="container" ref="imgContainer">
      <img class="wrap-img" ref="imgRef" :src="config.imgUrl" @load="handleResize" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, reactive, watch, defineExpose } from "vue"

defineOptions({
  name: "imageCoord"
})

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      imgUrl: "", // 图片路径
      originX: 0, // 原点X位置
      originY: 0, // 原点Y位置
      width: 0, // 宽
      height: 0, // 高
      x: 0, // X坐标
      y: 0, // Y坐标
      showBoundary: true, // 显示边界
      showAxis: true // 显示轴线
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

// 原点相对位置
let originPosition = { x: 0, y: 0 }

// 红点大小和属性
const payload = {
  width: 30, // 宽度
  height: 30, // 高度
  color: "red" // 深度
}

onMounted(() => {})

// 窗口自适应
const handleResize = () => {
  setAxis()
  // drawDot()
  drawBoundaryLines(imgContainer.value, boxData)
  drawAxisLines(imgContainer.value)
}

// 模仿elementPlus的rule校验
const valueValidate = () => {
  const values = config.value
  const errors = []

  for (const key in rules) {
    const ruleList = rules[key]
    const value = parseFloat(values[key]) // 转换为数值以防是字符串

    for (const rule of ruleList) {
      // 校验最大最小值
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

// 设置坐标轴
const setAxis = () => {
  autoCalibration()
  originPosition = convertToPixelByView(config.value.x, config.value.y)
}

// 优化坐标转换调用
const convertToPixelByView = (x, y) =>
  convertToPixel(x, y, boxData, imgRef.value, config.value.width, config.value.height)

/**
 * 将物理坐标转换为像素坐标
 * @param {number} imgX 实际X坐标（如x或y）
 * @param {number} imgY 实际Y坐标（如z）
 * @param {object} box 图像的四边像素位置 { left, right, top, bottom }
 * @param {HTMLElement} imgDom 图片DOM
 * @param {number} realWidth 实际物理宽度（如 length 或 breadth）
 * @param {number} realHeight 实际物理高度（如 height）
 * @returns {object} { x, y } 像素坐标
 */
const convertToPixel = (imgX, imgY, box, imgDom, realWidth, realHeight) => {
  const { left, right, top, bottom } = box

  // 图片的像素宽高
  const pixelWidth = right - left
  const pixelHeight = bottom - top

  // 通过实际坐标和实际宽高得出一个比例，再用比例和像素宽高得出实际坐标下的像素宽高
  const relAPx = (imgX / (realWidth / 2)) * (pixelWidth / 2)
  const relBPx = (imgY / realHeight) * pixelHeight

  // 获取原点位置计算起点
  const originX = config.value.originX / 100
  const originY = config.value.originY / 100
  const pxX = (left + right) * originX + relAPx
  const pxY = (top + bottom) * originY + relBPx

  // const pxY = bottom - relBPx

  // 计算在缩放情况下的比例
  const rect = imgDom.getBoundingClientRect()
  const scaleX = rect.width / imgDom.naturalWidth
  const scaleY = rect.height / imgDom.naturalHeight

  return {
    x: pxX * scaleX,
    y: pxY * scaleY
  }
}

// 设置坐标范围
const setCoordinateRange = () => {
  const width = parseFloat(config.value.width)
  const height = parseFloat(config.value.height)
  const originX = parseFloat(config.value.originX)
  const originY = parseFloat(config.value.originY)

  // 设置X坐标范围
  const xMin = -width * (originX / 100)
  const xMax = width + xMin
  rules.x[0].min = xMin
  rules.x[0].max = xMax
  rules.x[0].message = `X坐标范围为 [${xMin}, ${xMax}]`

  // 设置Y坐标范围
  const yMin = -height * (originY / 100)
  const yMax = height + yMin
  rules.y[0].min = yMin
  rules.y[0].max = yMax
  rules.y[0].message = `Y坐标范围为 [${yMin}, ${yMax}]`

  console.log("rules: ", rules)
}

// 在图上绘制红点
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

// 移除场景小球
const removeDot = () => {
  const imgCon = imgContainer.value
  const dot = imgCon.querySelector(".moving-dot")

  if (dot) {
    imgCon.removeChild(dot)
  }
}

// 创建边界线条
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

// 创建坐标轴线条
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

// 绘制边界
const drawBoundaryLines = (container, data) => {
  // 清理旧标线
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

  // 左线
  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxTop}px`,
      width: "4px",
      height: `${pxBottom - pxTop}px`
    })
  )
  // 右线
  container.appendChild(
    createBoundaryLine({
      left: `${pxRight}px`,
      top: `${pxTop}px`,
      width: "4px",
      height: `${pxBottom - pxTop}px`
    })
  )
  // 上线
  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxTop}px`,
      width: `${pxRight - pxLeft}px`,
      height: "4px"
    })
  )
  // 下线
  container.appendChild(
    createBoundaryLine({
      left: `${pxLeft}px`,
      top: `${pxBottom}px`,
      width: `${pxRight - pxLeft}px`,
      height: "4px"
    })
  )
}

// 绘制坐标轴
const drawAxisLines = container => {
  // 清理旧标线
  container.querySelectorAll(".showAxis-line").forEach(el => {
    if (el) {
      el.remove()
    }
  })

  // X轴
  container.appendChild(
    createAxisLine({
      left: `0px`,
      top: `${originPosition.y}px`,
      width: `100%`,
      height: "2px"
    })
  )
  // y轴
  container.appendChild(
    createAxisLine({
      left: `${originPosition.x}px`,
      top: `0px`,
      width: `2px`,
      height: "100%"
    })
  )
}

// 自动处理图像四边，不精确可手动录入信息
const autoCalibration = () => {
  boxData = getImageCropRect(imgContainer.value, imgRef.value)
}

// 获取传入图像对应图片实际像素位置
const getImageCropRect = (container, img) => {
  if (!container || !img) return null

  const containerRect = container.getBoundingClientRect()
  const imageRect = img.getBoundingClientRect()

  // 获取原图尺寸（自然尺寸）
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight

  // 实际显示尺寸
  const imageWidth = imageRect.width
  const imageHeight = imageRect.height

  // 容器尺寸
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height

  // 缩放比
  const scaleX = naturalWidth / imageWidth
  const scaleY = naturalHeight / imageHeight

  // 偏移量（居中）
  const offsetLeft = (containerWidth - imageWidth) / 2
  const offsetTop = (containerHeight - imageHeight) / 2

  // 计算边界（注意右下要用 naturalWidth - (offset + size)）
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

watch(() => config.value.showBoundary, changeBoundary)

watch(
  () => [config.value.originX, config.value.originY, config.value.width, config.value.height, config.value.showAxis],
  changeAxis
)

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
