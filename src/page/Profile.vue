<template>
  <div class="profile">
    <h2>個人檔案</h2>
    <div class="profile-container" v-if="profileUser">
      <div class="user-info">
        <div>
          <h2>
            {{ profileUser?.username ?? "" }}
            <span>
              <el-button
                class="follow_btn"
                v-if="!isMe && me != null"
                :type="isFollowed ? '' : 'primary'"
                @click="toggleFollow"
              >
                {{ isFollowed ? "取消追蹤" : "追蹤" }}
              </el-button>
              <el-button
                class="follow_btn"
                v-if="isMe && me != null"
                @click="goToEditProfile"
              >
                編輯個人檔案
              </el-button>
            </span>
          </h2>
          <p>{{ profileUser?.full_name ?? "" }}</p>
        </div>
        <el-avatar
          :src="profileUser?.avatar"
          :size="60"
          v-if="profileUser.avatar"
        />
        <el-avatar
          :size="60"
          :style="{
            backgroundColor: getColorFromChar(profileUser?.username[0]),
          }"
          v-else
          >{{ profileUser?.username[0] || "-" }}</el-avatar
        >
      </div>
      <p class="desc">{{ profileUser?.desc ?? "" }}</p>
      <div class="follow-stat">
        <p text @click="showFollowers = true">
          粉絲 <span> {{ followStat?.followers ?? 0 }}</span>
        </p>
        <p text @click="showFollowing = true">
          追蹤中 <span>{{ followStat?.following ?? 0 }}</span>
        </p>
      </div>

      <el-divider></el-divider>

      <div class="personal-post">
        <h3>個人動態</h3>
        <div
          class="post-card"
          v-if="userPost.length"
          v-for="(post, index) in userPost"
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
              </el-col>
            </div>
          </div>
          <el-divider class="divider"></el-divider>
        </div>
      </div>
    </div>
  </div>

  <!-- 粉絲 Dialog -->
  <el-dialog v-model="showFollowers" title="粉絲列表" width="500px">
    <el-row
      v-for="user in followers"
      :key="user.id"
      class="follow-item"
      align="middle"
      justify="space-between"
    >
      <div class="user-info" @click="goToUser(user.id)">
        <el-avatar :src="user?.avatar" v-if="user.avatar" />
        <el-avatar
          :size="40"
          :style="{
            backgroundColor: getColorFromChar(user?.username[0]),
          }"
          v-else
          >{{ user?.username[0] || "-" }}</el-avatar
        >
        <div class="user-text">
          <div class="username">{{ user.username }}</div>
          <div class="full-name">{{ user.full_name || "-" }}</div>
        </div>
      </div>
      <el-button @click="goToUser(user.id)">查看</el-button>
    </el-row>
  </el-dialog>

  <!-- 追蹤中 Dialog -->
  <el-dialog v-model="showFollowing" title="追蹤中列表" width="500px">
    <el-row
      v-for="user in following"
      :key="user.id"
      class="follow-item"
      align="middle"
      justify="space-between"
    >
      <div class="user-info" @click="goToUser(user.id)">
        <el-avatar :src="user?.avatar" v-if="user.avatar" />
        <el-avatar
          :size="40"
          :style="{
            backgroundColor: getColorFromChar(user?.username[0]),
          }"
          v-else
          >{{ user?.username[0] || "-" }}</el-avatar
        >
        <div class="user-text">
          <div class="username">{{ user.username || "-" }}</div>
          <div class="full-name">{{ user.full_name || "-" }}</div>
        </div>
      </div>
      <el-button @click="onUnfollow(user.id)">取消追蹤</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// API
import {
  getMe,
  getUser,
  getUserPosts,
  getUserFollowStat,
  getUserFollower,
  getUserFollowing,
  followUser,
  unfollowUser,
  isFollowingUser,
} from "../api/user";
import { endLoading, startLoading } from "../utils/loading";
import { getColorFromChar } from "../utils/utils";
// route 與 router
const route = useRoute();
const router = useRouter();

// 目前 profile 的 user id
const profileUserId = computed(() => Number(route.params.id));

// 登入的使用者
const me = ref(null);
const profileUser = ref(null);

// 狀態資料
const userPost = ref([]);
const followStat = ref({ followers: 0, following: 0 });
const followers = ref([]);
const following = ref([]);
const isFollowed = ref(false);

// 顯示 modal
const showFollowers = ref(false);
const showFollowing = ref(false);

// 載入狀態
const isPostLoading = ref(false);
const isUserLoading = ref(true);

const loadProfileData = async () => {
  isUserLoading.value = true;
  isPostLoading.value = true;
  startLoading();
  try {
    me.value = await getMe();
    profileUser.value = await getUser(profileUserId.value);
    followStat.value = await getUserFollowStat(profileUserId.value);
    followers.value = await getUserFollower(profileUserId.value);
    following.value = await getUserFollowing(profileUserId.value);
    if (me.value.id !== profileUserId.value) {
      const res = await isFollowingUser(profileUserId.value);

      isFollowed.value = res.is_followed;
    }
    const res = await getUserPosts(profileUserId.value);
    userPost.value = res.posts;
  } catch (e) {
    console.error("載入失敗", e);
  } finally {
    isUserLoading.value = false;
    isPostLoading.value = false;
    endLoading();
  }
};

// 首次載入
onMounted(() => {
  loadProfileData();
});

// 當 profileId 改變時重新抓資料
watch(profileUserId, () => {
  loadProfileData();
});

const isMe = computed(() => me.value?.id === profileUserId.value);

const toggleFollow = async () => {
  try {
    if (isFollowed.value) {
      await unfollowUser(profileUserId.value);
      ElMessage.success("已退追蹤");
    } else {
      await followUser(profileUserId.value);
      ElMessage.success("追蹤成功");
    }

    isFollowed.value = !isFollowed.value;
    followStat.value = await getUserFollowStat(profileUserId.value);
    following.value = await getUserFollowing(profileUserId.value);
    followers.value = await getUserFollower(profileUserId.value);
  } catch (e) {
    ElMessage.error("操作失敗");
  }
};

const onUnfollow = async (id) => {
  try {
    await unfollowUser(id);
    ElMessage.success("退追蹤成功");

    followStat.value = await getUserFollowStat(profileUserId.value);
    following.value = await getUserFollowing(profileUserId.value);
    followers.value = await getUserFollower(profileUserId.value);
  } catch (e) {
    ElMessage.error("操作失敗");
  }
};

const goToUser = (id) => {
  router.push(`/profile/${id}`);
  showFollowers.value = false;
  showFollowing.value = false;
};

const goToEditProfile = () => {
  router.push(`/profile/edit`);
};
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
      color: rgb(168, 168, 168);
    }
  }
}
.desc {
  padding-top: 24px;
  padding-bottom: 24px;
}
.personal-post {
  margin-top: 40px;
}
.post-card {
  margin-top: 24px;
  .post {
    display: flex;
    gap: 4px;
  }
}

.el-card {
  background-color: #2e2e2e; /* Dark background */
  color: white;
}
.post-content {
  margin-bottom: 4px;
  cursor: pointer;
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
}
.username {
  font-size: 16px;
  font-weight: bold;
}

.follow-stat {
  display: flex;
  gap: 12px;
  p {
    color: rgb(168, 168, 168);
    cursor: pointer;
    span {
      color: white;
    }
  }
}

.follow-item {
  margin-bottom: 16px;
  padding: 4px;
  cursor: pointer;
}

.follow-item .user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-text {
  display: flex;
  flex-direction: column;
  .username {
    font-weight: bold;
  }
  .full-name {
    opacity: 0.7;
    font-size: 14px;
  }
  .follow_btn {
    padding-left: 80px;
  }
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
</style>
