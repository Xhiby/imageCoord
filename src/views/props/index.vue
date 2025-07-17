<!-- 封装的工具函数库 -->
<template>
  <div class="wrap">
    <div class="img-form">
      <h2>props</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="auto">
        <el-form-item label="原点X轴位置:">
          <el-input v-model="form.originY">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="原点Y轴位置:">
          <el-input v-model="form.originX">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="图片实际宽度:" prop="width">
          <el-input v-model="form.width" />
        </el-form-item>
        <el-form-item label="图片实际高度:" prop="height">
          <el-input v-model="form.height" />
        </el-form-item>
        <el-form-item label="X坐标:" prop="x">
          <el-input v-model.number="form.x" />
        </el-form-item>
        <el-form-item label="Y坐标:" prop="y">
          <el-input v-model.number="form.y" />
        </el-form-item>
        <el-form-item label="是否显示坐标边界:" prop="showBoundary">
          <el-switch v-model="form.showBoundary" />
        </el-form-item>
        <el-form-item label="是否显示坐标轴线:" prop="showAxis">
          <el-switch v-model="form.showAxis" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="drawDot">绘制</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="imageCoordWrap">
      <imageCoord ref="imageCoordRef" :config="form" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"

const imageCoordRef = ref()

const form = reactive({
  imgUrl: "/src/assets/images/imageCoordTest.jpg", // 图片路径
  originX: 50, // 原点X位置
  originY: 50, // 原点Y位置
  width: 100, // 宽
  height: 50, // 高
  x: 0, // X坐标
  y: 0, // Y坐标
  showBoundary: false, // 显示边界
  showAxis: true // 显示轴线
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

onMounted(() => {})

const drawDot = () => {
  imageCoordRef.value.drawDot()
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: center;
  .imageCoordWrap {
    width: 70%;
    margin-bottom: 20px;
  }
  ::v-deep(.el-form) {
    width: calc(100% - 50px);
  }
  ::v-deep(.el-input-number) {
    width: 100%;
  }
  ::v-deep(.el-form-item__label) {
    font-size: 16px;
  }
}
</style>
