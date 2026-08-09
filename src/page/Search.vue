<template>
  <div class="search">
    <h2>用戶列表</h2>
    <div class="search-container">
      <el-skeleton v-if="isLoading" :rows="4" animated class="search-state" aria-busy="true" />
      <el-alert v-else-if="error" title="使用者載入失敗" type="error" show-icon class="search-state">
        <template #default><el-button size="small" @click="refetch">重新載入</el-button></template>
      </el-alert>
      <p v-else-if="!users?.length" class="search-state">找不到使用者</p>
      <div v-for="user in users" :key="user.id" class="card">
        <div class="card-item">
          <div class="content">
            <div>
              <el-avatar
                :size="50"
                :src="`https://i.pravatar.cc/300?img=${user.id}`"
              />
            </div>

            <div class="user-info">
              <p class="name">{{ user.username }}</p>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>

          <div>
            <el-button plain @click="handleClick(user.id)">查看</el-button>
          </div>
        </div>

        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from "@tanstack/vue-query";
import { getUserLists } from "../api/user";
import { useRouter } from "vue-router";

const router = useRouter();
const {
  data: users,
  isLoading,
  error,
  refetch,
} = useQuery({ queryKey: ["users"], queryFn: getUserLists });

function handleClick(userId) {
  router.push({
    name: "profile",
    params: { id: userId },
  });
}
</script>

<style scoped>
.search {
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin-bottom: 20px;
  }
}
.search-container {
  min-width: 700px;
  max-width: 700px;
  border-radius: 12px;
  border: 1px solid rgba(243, 245, 247, 0.15);
  background-color: #2e2e2e;
}
.card {
  background-color: #2e2e2e;
  color: white;
  border: none;
}
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
}
.content {
  display: flex;
  align-items: center;
  .user-info {
    margin-left: 12px;

    .name {
      font-weight: 700;
      font-size: 20px;
    }
    .email {
      opacity: 60%;
      font-size: 14px;
      margin-top: 4px;
    }
  }
}
.el-divider {
  margin: 0 !important;
}
.search-state { margin: 0; padding: 24px; text-align: center; color: #aaa; }
@media (max-width: 767px) {
  .search { margin: 20px 0; align-items: stretch; }
  .search-container { min-width: 0; width: 100%; }
  .card-item { padding: 16px 12px; gap: 8px; }
  .content { min-width: 0; }
  .email { overflow-wrap: anywhere; }
}
</style>
