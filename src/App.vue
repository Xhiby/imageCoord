<template>
  <el-container>
    <el-header>
      <el-menu default-active="/quickStart" mode="horizontal" router>
        <el-menu-item index="/quickStart"> 快速开始 </el-menu-item>
        <el-menu-item index="/props"> Props </el-menu-item>
      </el-menu>
    </el-header>
    <el-main><router-view></router-view></el-main>
  </el-container>
</template>

<script setup>
import { ref } from "vue"

const activeIndex = ref("1")
</script>

<style lang="scss" scoped></style>
