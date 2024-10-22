<script setup></script>

<template>
  <router-view></router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  --el-bg-color: #2e2e2e;
}
h1,
h2,
h3,
h4,
p,
span {
  padding: 0;
  margin: 0;
}

body {
  background-color: #121212; /* 黑色背景 */
  color: white; /* 文字顏色為白色 */
  font-family: "Arial", sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.el-card {
  background-color: #2e2e2e; /* 卡片背景色 */
  color: white; /* 卡片中文字顏色 */
  border: none; /* 去掉邊框 */
}

.el-divider {
  margin: 10px 0 !important;
  border-color: rgba(243, 245, 247, 0.15) !important;
}

.el-spinner {
  color: #ffffff; /* 加載動畫顏色 */
}

.el-alert {
  background-color: #333; /* 警告框背景 */
  border-color: #444; /* 邊框顏色 */
  color: white; /* 警告框文字顏色 */
}

a {
  color: #1e90ff; /* 鍵入的文字顏色 */
}

.el-button {
  background-color: #333; /* 按鈕背景 */
  border-color: #444; /* 按鈕邊框 */
  color: white; /* 按鈕文字顏色 */
}

.el-button:hover {
  background-color: #444;
  border-color: #555;
}
</style>
