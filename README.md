# 用于将图片像素自动转换为实际尺寸坐标

## 快速开始

### 安装
```bash
npm install image-coord
```

### 使用
```js
import imageCoord from "image-coord"

app.use(imageCoord)
```

```vue
<template>
  <imageCoord :config="config" />
</template>

<script setup>
let config = {
  imgUrl: "/src/assets/images/imageCoordTest.jpg", // 图片路径
  originX: 50, // 原点X位置
  originY: 50, // 原点Y位置
  width: 100, // 宽
  height: 50, // 高
  x: 0, // X坐标
  y: 0, // Y坐标
  showBoundary: true, // 显示边界
  showAxis: true // 显示轴线
}
</script>
```

## 完整示例

```vue
<template>
  <div class="wrap">
    <div class="imageCoordWrap">
      <imageCoord ref="imageCoordRef" :config="config" />
    </div>

    <button type="primary" @click="drawDot">开始绘制</button>
  </div>
</template>

<script setup>
import { ref } from "vue"

const imageCoordRef = ref()

const config = {
  imgUrl: "/src/assets/images/imageCoordTest.jpg", // 图片路径
  originX: 50, // 原点X位置
  originY: 50, // 原点Y位置
  width: 100, // 宽
  height: 50, // 高
  x: 0, // X坐标
  y: 0, // Y坐标
  showBoundary: true, // 显示边界
  showAxis: true // 显示轴线
}

const drawDot = () => {
  imageCoordRef.value.drawDot()
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .imageCoordWrap {
    width: 70%;
    margin-bottom: 20px;
  }
}
</style>
```

## Props
![props说明](https://github.com/Xhiby/imageCoord/blob/master/src/assets/images/props.png)
