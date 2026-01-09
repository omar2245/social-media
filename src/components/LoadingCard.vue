<template>
  <el-skeleton v-if="isLoading" :rows="5" animated />
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.el-skeleton {
  padding: 20px;
}
</style>
