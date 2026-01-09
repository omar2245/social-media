<template>
  <el-col class="home">
    <div class="auth-box">
      <h2>動態消息</h2>
      <div class="auth-btn-group" v-show="!user && !isUserLoading">
        <el-button type="primary" @click="() => router.push('/login')"
          >登入</el-button
        >
        <el-button @click="() => router.push('/register')">註冊</el-button>
      </div>
      <div class="auth-btn-group" v-show="user && !isUserLoading">
        <el-button @click="logout()">登出</el-button>
      </div>
    </div>

    <div class="posts">
      <!-- 初始加載骨架屏 -->
      <div v-if="isUserLoading" class="skeleton-container">
        <div class="skeleton-post-btn">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-input"></div>
          <div class="skeleton-button"></div>
        </div>
        <div class="skeleton-divider"></div>

        <div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton-post-card">
          <div class="skeleton-header">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-info">
              <div class="skeleton-name"></div>
              <div class="skeleton-time"></div>
            </div>
          </div>
          <div class="skeleton-content"></div>
          <div
            class="skeleton-content"
            style="margin-top: 8px; width: 70%"
          ></div>
          <div class="skeleton-actions"></div>
        </div>
      </div>

      <!-- 實際內容 -->
      <template v-else>
        <el-col @click="dialogVisible = true" class="post-btn">
          <div class="fake-input">
            <el-avatar :src="user?.avatar" v-if="user?.avatar" />
            <el-avatar
              :size="40"
              :style="{
                backgroundColor: getColorFromChar(user?.username[0]),
              }"
              v-else
              >{{ user?.username[0] || "-" }}</el-avatar
            >
            <p class="placeholder">有什麼新鮮事?</p>
          </div>
          <el-button @click="dialogVisible = true" plain>發佈</el-button>
        </el-col>
        <el-divider class="divider"></el-divider>

        <div
          class="post-card"
          v-for="(post, index) in postsList"
          :key="post.id"
        >
          <div class="post">
            <div @click="goToUser(post.user_id)">
              <el-avatar :src="post?.avatar" v-if="post.avatar" />
              <el-avatar
                :size="40"
                :style="{
                  backgroundColor: getColorFromChar(post?.username[0]),
                }"
                v-else
                >{{ post?.username[0] || "-" }}</el-avatar
              >
            </div>
            <div>
              <el-col class="post-detail">
                <div class="user-info" @click="goToUser(post.user_id)">
                  <span class="username">{{ post.username ?? "-" }}</span>
                </div>

                <div class="post-content" @click="goToPost(post.id)">
                  {{ post.content }}
                </div>

                <!-- 圖片列表 -->
                <div
                  class="post-images"
                  v-if="post.images && post.images.length"
                >
                  <div
                    v-for="(imgUrl, idx) in post.images"
                    :key="idx"
                    class="post-image-wrapper"
                  >
                    <img :src="imgUrl" alt="Post Image" class="post-image" />
                  </div>
                </div>

                <div class="post-actions">
                  <span class="action" @click="onLike(post)">
                    <i
                      :class="[
                        post.is_liked ? 'fas fa-heart liked' : 'far fa-heart',
                      ]"
                    ></i>
                    {{ post.likes > 0 ? post.likes : "0" }}
                  </span>
                  <span class="action" @click="goToPost(post.id)">
                    <i class="far fa-comment"></i>
                    {{ post.comment_count > 0 ? post.comment_count : "0" }}
                  </span>
                </div>
              </el-col>
            </div>
          </div>
          <el-divider class="divider"></el-divider>
        </div>
      </template>

      <!-- 下一頁加載中的骨架屏 -->
      <div v-if="isFetchingNextPage" class="skeleton-container">
        <div v-for="i in 3" :key="`loading-${i}`" class="skeleton-post-card">
          <div class="skeleton-header">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-info">
              <div class="skeleton-name"></div>
              <div class="skeleton-time"></div>
            </div>
          </div>
          <div class="skeleton-content"></div>
          <div
            class="skeleton-content"
            style="margin-top: 8px; width: 70%"
          ></div>
          <div class="skeleton-actions"></div>
        </div>
      </div>

      <el-alert v-if="error" type="error" title="加載錯誤" />
    </div>
    <el-button
      v-if="hasNextPage && !isFetchingNextPage"
      class="load-more-btn"
      plain
      @click="fetchNextPage"
      >載入更多</el-button
    >
    <el-button
      v-if="isFetchingNextPage"
      class="load-more-btn"
      loading
      disabled
      plain
      >載入中...</el-button
    >
  </el-col>

  <el-dialog title="新貼文" v-model="dialogVisible" width="500">
    <el-form :model="form">
      <el-input
        class="dialog-input"
        v-model="form.content"
        placeholder="有什麼新鮮事?"
        type="textarea"
      />

      <!-- 圖片預覽 -->
      <div class="preview-images" v-if="previewImages.length">
        <div
          class="preview-item"
          v-for="(img, idx) in previewImages"
          :key="idx"
        >
          <img :src="img" class="preview-img" />
          <span class="remove" @click="removeImage(idx)">×</span>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <!-- 上傳圖片按鈕 -->
        <!-- <el-button class="upload-btn" @click="triggerFileInput"
          >選擇圖片</el-button
        > -->
        <input
          type="file"
          ref="fileInput"
          multiple
          accept="image/*"
          style="display: none"
          @change="handleFiles"
        />
        <el-button
          @click="onSubmit"
          :disabled="form.content.length === 0"
          type="primary"
          :loading="isSubmitting"
          >發佈
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getPosts, createPost, like, dislike } from "../api/post";
import { computed, ref, reactive } from "vue";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { getMe } from "../api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getColorFromChar } from "../utils/utils";

const router = useRouter();
const queryClient = useQueryClient();

const dialogVisible = ref(false);

const form = reactive({ content: "", files: [] });
const isSubmitting = ref(false);
const fileInput = ref(null); // 參考 file input
const previewImages = ref([]); // 預覽用 URL

// 使用者資料
const { data: user, isLoading: isUserLoading } = useQuery({
  queryKey: ["user"],
  queryFn: () => getMe(),
});

// 發文
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    dialogVisible.value = false;
    form.content = "";
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  },
});

// 觸發隱藏 input
const triggerFileInput = () => {
  fileInput.value.click();
};

// 選擇圖片
const handleFiles = (event) => {
  const files = Array.from(event.target.files);
  console.log(event.target.files);
  // 限制最多 5 張
  if (form.files.length + files.length > 2) {
    ElMessage.warning("最多只能上傳 2 張圖片");
    return;
  }

  files.forEach((file) => {
    form.files.push(file);
    previewImages.value.push(URL.createObjectURL(file));
  });

  // 清空 input value，避免同一張圖片無法重複選擇
  event.target.value = "";
};

// 移除單張圖片
const removeImage = (index) => {
  form.files.splice(index, 1);
  previewImages.value.splice(index, 1);
};

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("content", form.content);

    form.files.forEach((file) => {
      formData.append("images", file);
    });

    await createPostMutation.mutateAsync(formData);
    ElMessage.success("發佈成功");

    // 清空表單
    form.content = "";
    form.files = [];
    previewImages.value = [];
  } catch (e) {
    ElMessage.error("發佈失敗");
  } finally {
    isSubmitting.value = false;
  }
};

// 登出
const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  router.push("/login");
};

// 貼文分頁查詢
const limit = 10;
const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total_post / limit);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
  });

// 合併所有貼文
const postsList = computed(() => {
  return data.value?.pages.flatMap((page) => page.posts) || [];
});

// 按讚 / 收回讚
const onLike = async (post) => {
  try {
    if (!post.is_liked) {
      await like(post.id);
    } else {
      await dislike(post.id);
    }
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  } catch (e) {
    ElMessage({ message: "操作失敗", type: "error" });
  }
};

// 點擊留言跳轉
const goToPost = (postId) => {
  router.push(`/posts/${postId}`);
};

const goToUser = (id) => {
  router.push(`/profile/${id}`);
};
</script>

<style scoped>
.home {
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.posts {
  max-width: 700px;
  min-width: 500px;
  border-radius: 12px;
  border: 1px solid rgba(243, 245, 247, 0.15);
  background-color: #2e2e2e;
}
.post-card {
  padding: 20px;
}

.dialog-input {
  border: none;
  outline: none;
}
.el-card {
  background-color: #2e2e2e;
  color: white;
}
.post-detail {
  margin-bottom: 10px;
  cursor: pointer;
}
.el-avatar {
  margin-right: 12px;
}
.user-info {
  margin-bottom: 4px;
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
}
.fake-input {
  display: flex;
  align-items: center;
}
.placeholder {
  opacity: 60%;
}

.post {
  display: flex;
  gap: 4px;
}
.post-content {
  margin-bottom: 4px;
  cursor: pointer;
}
.el-divider {
  margin: 10px 0;
  border-color: rgba(243, 245, 247, 0.15) !important;
}
.post-images {
  display: flex;
  gap: 16px;
}

.post-image-wrapper {
  width: 200px;
  height: 200px;
  background-color: white; /* 白底 */
  border-radius: 8px; /* 可選，圓角 */
  overflow: hidden; /* 超出區域隱藏 */
  flex-shrink: 0; /* 避免縮小 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 圖片裁切填滿 */
  display: block;
}
.post-actions {
  display: flex;
  gap: 24px;
  margin-top: 8px;
  font-size: 16px;
  color: #b4b4b4;
}
.action {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.fa-heart.liked {
  color: red;
}
.auth-box {
  width: 100%;
  max-width: 700px;
  min-width: 500px;
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;
}
.load-more-btn {
  margin-top: 24px;
}

.preview-images {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.preview-item {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ddd;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove {
  position: absolute;
  top: 2px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 100%;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 12px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 骨架屏樣式 */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-container {
  padding: 20px;
}

.skeleton-post-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.skeleton-input {
  flex: 1;
  height: 36px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.skeleton-button {
  width: 80px;
  height: 36px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.skeleton-divider {
  height: 1px;
  background: rgba(243, 245, 247, 0.15);
  margin: 10px 0;
}

.skeleton-post-card {
  margin-bottom: 20px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid rgba(243, 245, 247, 0.15);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.skeleton-info {
  flex: 1;
}

.skeleton-name {
  width: 120px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  margin-bottom: 8px;
}

.skeleton-time {
  width: 80px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.skeleton-content {
  width: 100%;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.skeleton-actions {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.skeleton-actions::before,
.skeleton-actions::after {
  content: "";
  width: 60px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>
