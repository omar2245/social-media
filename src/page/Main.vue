<script setup lang="ts">
import SideMenu from "../components/SideMenu.vue";
</script>

<template>
  <el-col class="layout">
    <el-container class="side-menu"><SideMenu /></el-container>
    <el-main><router-view></router-view></el-main>
  </el-col>
</template>

<style scoped>
.layout {
  display: flex;
  position: relative;
  .side-menu {
    position: fixed;
  }
}
</style>
