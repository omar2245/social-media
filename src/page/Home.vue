<!-- src/components/UserList.vue -->
<template>
  <el-col class="home">
    <h2>動態消息</h2>
    <el-col class="posts" v-if="!isLoading">
      <el-col @click="dialogVisible = true" class="post-btn">
        <div class="fake-input">
          <el-avatar :size="40" :src="`https://i.pravatar.cc/300?img=5`" />
          <p class="placeholder">有什麼新鮮事?</p>
        </div>
        <el-button @click="dialogVisible = true" plain>發佈</el-button>
      </el-col>
      <el-divider class="divider"></el-divider>
      <div
        class="post-card"
        v-if="!isLoading && posts.length"
        v-for="(post, index) in postsList"
        :key="post.id"
      >
        <div class="post">
          <el-col class="post-header">
            <el-avatar
              :size="40"
              :src="`https://i.pravatar.cc/300?img=${post.userId}`"
            />
            <div class="user-info">
              <span class="username">{{
                users?.[post.userId]?.username ?? "-"
              }}</span>
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

      <el-alert v-if="error" type="error" title="加載錯誤" />
    </el-col>
  </el-col>

  <el-dialog
    title="新貼文"
    v-model="dialogVisible"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-input
        class="dialog-input"
        v-model="form.body"
        placeholder="有什麼新鮮事?"
        type="textarea"
      ></el-input>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onSubmit" :disabled="form.body.length === 0"
          >發佈</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getPosts, createPost } from "../api/post";
import { computed, ref, reactive } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getUserLists } from "../api/user";
import { ElMessage } from "element-plus";

const {
  data: posts,
  isLoading,
  error,
} = useQuery({ queryKey: ["posts"], queryFn: () => getPosts() });
const postsList = computed(() => {
  const clonedPosts = [...posts.value]; // 複製數據
  return clonedPosts
    .filter((x) => x.userId !== 10)
    .reverse()
    .slice(0, 50);
});
const { data: users } = useQuery({
  queryKey: ["users"],
  queryFn: () => getUserLists(),
});

const dialogVisible = ref(false);
const form = reactive({ body: "" });

const handleClose = () => (dialogVisible.value = false);
const onSubmit = async () => {
  try {
    const res = await createPost({ ...form, userId: 5, title: "" });
    posts.value.unshift();
    ElMessage({ message: "發佈貼文成功", type: "success" });
    handleClose();
  } catch (e) {}
};
</script>

<style scoped>
.home {
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin-bottom: 20px;
  }
}
.posts {
  max-width: 700px;
  border-radius: 12px;
  border: 1px solid rgba(243, 245, 247, 0.15);
  background-color: #2e2e2e;
}

.post-card {
  margin-bottom: 20px;
  .post {
    padding: 20px;
  }
}
.el-dialog {
  display: flex;
  color: white;

  .dialog-btn {
    justify-self: end;
  }
}
.dialog-input {
  border: none; /* 隱藏邊框 */
  outline: none; /* 移除點擊後的外框 */
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

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 16px;
  font-weight: bold;
}
.post-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 30px 20px 20px 20px;
  .fake-input {
    display: flex;
    align-items: center;
    .placeholder {
      opacity: 60%;
    }
  }
}

.post-content {
  margin-top: 10px;
  padding-left: 62px;
}
.el-divider {
  margin: 10px 0;
  border-color: rgba(243, 245, 247, 0.15) !important;
}
</style>
