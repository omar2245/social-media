<template>
  <div class="post-detail">
    <el-card v-if="post">
      <div class="header">
        <el-avatar :src="post?.avatar" v-if="post.avatar" />
        <el-avatar
          :size="40"
          :style="{
            backgroundColor: getColorFromChar(post?.username[0]),
          }"
          v-else
          >{{ post?.username[0] || "-" }}</el-avatar
        >
        <div class="user-info">
          <p class="username">{{ post.username }}</p>
          <p class="date">{{ formatDate(post.created_at) }}</p>
        </div>
      </div>

      <p class="content">{{ post.content }}</p>

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
            :class="[post.is_liked ? 'fas fa-heart liked' : 'far fa-heart']"
          ></i>
          {{ post.likes > 0 ? post.likes : "0" }}
        </span>

        <span class="action">
          <i class="far fa-comment"></i>
          {{ post.comment_count > 0 ? post.comment_count : "0" }}
        </span>
      </div>
    </el-card>

    <el-divider />

    <p>留言區</p>
    <el-form class="comment-form">
      <el-form-item>
        <el-input
          class="comment-input"
          v-model="newComment"
          placeholder="留下你的留言..."
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitComment"
          :disabled="!newComment.trim().length"
        >
          送出留言
        </el-button>
      </el-form-item>
    </el-form>

    <div v-for="comment in comments" :key="comment.id" class="comment">
      <el-card class="comment-card">
        <div class="comment-header">
          <div class="avatar">
            <el-avatar :src="comment?.avatar" v-if="comment.avatar" />
            <el-avatar
              :size="40"
              :style="{
                backgroundColor: getColorFromChar(comment?.username[0]),
              }"
              v-else
              >{{ comment?.username[0] || "-" }}</el-avatar
            >
            <strong>{{ comment.username }}</strong>
          </div>

          <span class="date">{{ formatDate(comment.created_at) }}</span>
        </div>

        <p class="comment-content">{{ comment.content }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getPostDetail, getPostComments, createComment } from "../api/post";
import { ElMessage } from "element-plus";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { getColorFromChar } from "../utils/utils";

const route = useRoute();
const postId = route.params.id;
const queryClient = useQueryClient();
const newComment = ref("");

// 取得貼文詳情
const { data: postData } = useQuery({
  queryKey: ["post", postId],
  queryFn: () => getPostDetail(postId),
});

// 取得留言清單
const { data: commentData } = useQuery({
  queryKey: ["post-comments", postId],
  queryFn: () => getPostComments(postId),
});

// 發送留言
const createCommentMutation = useMutation({
  mutationFn: createComment,
  onSuccess: () => {
    ElMessage.success("留言成功");
    newComment.value = "";
    queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
  },
  onError: () => {
    ElMessage.error("留言失敗");
  },
});

const post = computed(() => postData.value?.post);
const comments = computed(() => commentData.value?.comments || []);

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  await createCommentMutation.mutateAsync({
    post_id: postId,
    content: newComment.value.trim(),
  });
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("zh-TW", {
    dateStyle: "short",
    timeStyle: "short",
  });
</script>

<style scoped>
.post-detail {
  max-width: 700px;
  margin: 40px auto;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.content {
  padding-top: 12px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
}
.date {
  font-size: 12px;
  color: #999;
}
.meta {
  margin-top: 16px;
  font-size: 14px;
  color: #aaa;
}
.comment {
  margin-bottom: 16px;
}
.comment-card {
  padding: 12px;
  p {
    font-size: 14px;
    color: #ccc;
  }
}
.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  .avatar {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
.comment-content {
  padding-left: 48px;
}
.comment-form {
  gap: 12px;
  display: flex;
  min-width: 100%;
  margin-top: 24px;
  .comment-input {
    min-width: 600px;
  }
}
.post-actions {
  display: flex;
  gap: 24px;
  margin-top: 16px;
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

.post-images {
  display: flex;
  gap: 16px;
  margin-top: 16px;
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
</style>
