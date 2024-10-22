<template>
  <div class="profile">
    <h2>個人檔案</h2>
    <div class="profile-container">
      <div class="user-info">
        <div>
          <h2>{{ user?.username ?? "" }}</h2>
          <p>{{ user?.email ?? "" }}</p>
        </div>

        <el-avatar :size="60" :src="`https://i.pravatar.cc/300?img=${5}`" />
      </div>

      <el-divider></el-divider>

      <div class="personal-post">
        <h3>個人動態</h3>
        <div class="post-card" v-for="(post, index) in userPost" :key="post.id">
          <div class="post">
            <el-col class="post-header">
              <el-avatar
                :size="50"
                :src="`https://i.pravatar.cc/300?img=${5}`"
              />
              <div class="user-info">
                <span class="username">{{ user.username ?? "" }}</span>
                <!-- 顯示使用者名稱 -->
              </div>
            </el-col>
            <div class="post-content">
              <!-- <h3>{{ post.title }}</h3> -->
              <p>{{ post.body }}</p>
            </div>
          </div>
          <el-divider class="divider"></el-divider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUser } from "../api/user";
import { getUserPosts } from "../api/post";

import { useQuery } from "@tanstack/vue-query";

const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: () => getUser(5),
});

const { data: userPost } = useQuery({
  queryKey: ["userPost"],
  queryFn: () => getUserPosts(5),
});
</script>

<style scoped>
.profile {
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin-bottom: 20px;
  }
}
.profile-container {
  min-width: 700px;
  max-width: 700px;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid rgba(243, 245, 247, 0.15);
  background-color: #2e2e2e;
  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    p {
      font-size: 16;
      opacity: 60%;
    }
  }
}
.personal-post {
  margin-top: 40px;
}
.post-card {
  margin-bottom: 20px;
  .post {
    padding: 20px;
  }
}

.el-card {
  background-color: #2e2e2e; /* Dark background */
  color: white;
}
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.el-avatar {
  margin-right: 12px;
}

.username {
  font-size: 16px;
  font-weight: bold;
}

.post-content {
  margin-top: 10px;
  padding-left: 62px;
}
.username {
  font-size: 16px;
  font-weight: bold;
}

.post-content {
  margin-top: 10px;
  padding-left: 62px;
}
</style>
