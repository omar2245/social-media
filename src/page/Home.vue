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

      <div class="post-card" v-for="(post, index) in postsList" :key="post.id">
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
              <div class="post-images" v-if="post.images && post.images.length">
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

      <el-alert v-if="error" type="error" title="加載錯誤" />
    </div>
    <el-button
      v-if="hasNextPage && !isFetchingNextPage"
      class="load-more-btn"
      plain
      @click="fetchNextPage"
      >載入更多</el-button
    >
  </el-col>

  <el-dialog title="新貼文" v-model="dialogVisible" width="500">
    <el-form :model="form">
      <el-input
        class="dialog-input"
        v-model="form.content"
        placeholder="有什麼新鮮事?"
        type="textarea"
      ></el-input>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onSubmit" :disabled="form.content.length === 0"
          >發佈</el-button
        >
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
const form = reactive({ content: "" });

// 使用者資料
const { data: user, isLoading: isUserLoading } = useQuery({
  queryKey: ["user"],
  queryFn: () => getMe(),
});

// 發文
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    ElMessage({ message: "發佈貼文成功", type: "success" });
    dialogVisible.value = false;
    form.content = "";
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  },
});

const onSubmit = async () => {
  try {
    await createPostMutation.mutateAsync(form);
  } catch (e) {
    ElMessage({ message: "發佈失敗", type: "error" });
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
</style>
