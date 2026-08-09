<!-- src/components/Layout.vue -->
<template>
  <!-- 左邊的菜單 -->
  <nav class="menu-aside" aria-label="主要導覽">
    <el-menu :default-active="activeMenu" class="menu" mode="vertical">
      <el-menu-item index="home" @click="navigate('home')">
        <el-icon class="icon" :size="60"><HomeFilled /></el-icon>
        <span class="nav-label">首頁</span>
        <!-- 房子圖案 -->
      </el-menu-item>
      <el-menu-item index="compose" @click="navigate('compose')">
        <el-icon class="icon" :size="60"><CirclePlus /></el-icon>
        <span class="nav-label">發文</span>
      </el-menu-item>
      <el-menu-item index="profile" @click="navigate('profile')">
        <el-icon class="icon" :size="60"><Avatar /></el-icon>
        <span class="nav-label">個人</span>
        <!-- 人像圖案 -->
      </el-menu-item>
    </el-menu>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Avatar,
  HomeFilled,
  Menu as IconMenu,
  CirclePlus,
} from "@element-plus/icons-vue";
import { getMe } from "../api/user";
const activeMenu = computed(() => route.name); // 或 route.path
const route = useRoute();
const router = useRouter();

const navigate = async (name) => {
  if (name === "profile") {
    const me = await getMe();
    router.push(`/profile/${me.id}`);
  } else if (name === "compose") {
    router.push({ name: "home", query: { compose: "1" } });
  } else {
    router.push({ name });
  } // 使用 Vue Router 來導航到指定頁面
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
.nav-label { display: none; }
.icon {
  color: white;
  width: 100px;
  height: 100px;
}

.menu {
  width: 100%;
  background-color: #121212;
  border: none;
  gap: 24px;
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

@media (max-width: 767px) {
  .menu-aside {
    width: 100%;
    height: 100%;
    padding: 0 0 env(safe-area-inset-bottom);
    background: #121212;
    border-top: 1px solid rgba(243, 245, 247, 0.15);
  }
  .menu {
    height: 64px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  .el-menu-item {
    height: 64px;
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .icon { width: 28px; height: 28px; }
  .nav-label { display: block; font-size: 11px; line-height: 1; }
}
</style>
