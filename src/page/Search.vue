<template>
  <div class="search">
    <h2>用戶搜尋</h2>
    <div class="search-container">
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
              <p class="name">{{ user.name }}</p>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>

          <div>
            <el-button plain>查看</el-button>
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
import { computed } from "vue";
const {
  data: users,
  isLoading,
  error,
} = useQuery({ queryKey: ["users"], queryFn: getUserLists });
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
</style>
