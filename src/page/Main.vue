<script setup lang="ts">
import SideMenu from "../components/SideMenu.vue";
</script>

<template>
  <div class="layout">
    <aside class="side-menu"><SideMenu /></aside>
    <main class="main-content"><router-view /></main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100dvh;
}
.side-menu {
  position: fixed;
  inset: 0 auto 0 0;
  width: 70px;
  z-index: 20;
}
.main-content {
  width: calc(100% - 70px);
  min-width: 0;
  margin-left: 70px;
  padding: 20px;
}
@media (max-width: 767px) {
  .side-menu {
    inset: auto 0 0;
    width: 100%;
    height: calc(64px + env(safe-area-inset-bottom));
  }
  .main-content {
    width: 100%;
    margin-left: 0;
    padding: 0 12px calc(80px + env(safe-area-inset-bottom));
  }
}
</style>
