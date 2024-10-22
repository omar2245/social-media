<!-- src/components/Layout.vue -->
<template>
  <!-- 左邊的菜單 -->
  <el-aside width="70px" class="menu-aside">
    <el-menu :default-active="activeMenu" class="menu" mode="vertical">
      <el-menu-item index="/home" @click="navigate('/home')">
        <el-icon class="icon" :size="60"><HomeFilled /></el-icon>
        <!-- 房子圖案 -->
      </el-menu-item>
      <el-menu-item index="/search" @click="navigate('/search')">
        <el-icon class="icon" :size="60"><Search /></el-icon>
        <!-- 放大鏡圖案 -->
      </el-menu-item>
      <el-menu-item index="/profile" @click="navigate('/profile')">
        <el-icon class="icon" :size="60"><Avatar /></el-icon>
        <!-- 人像圖案 -->
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  Avatar,
  HomeFilled,
  Menu as IconMenu,
  Search,
} from "@element-plus/icons-vue";

const activeMenu = ref("/home");
const router = useRouter();

const navigate = (path) => {
  activeMenu.value = path;
  router.push(path); // 使用 Vue Router 來導航到指定頁面
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh; /* 讓佈局占滿整個頁面 */
}

.menu-aside {
  height: 100vh; /* 高度100% */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 60px;
}
.icon {
  color: white;
  width: 100px;
  height: 100px;
}

.menu {
  width: 100%;
  background-color: #121212;
  border: none;
}

.el-menu-item {
  border: none;
  padding: 20px 0;
}
.el-menu-item:hover {
  background-color: #5f5d5d;
}

.main-content {
  flex-grow: 1;
  padding: 40px;
}
</style>
