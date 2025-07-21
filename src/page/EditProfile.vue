<!-- src/views/EditProfile.vue -->
<template>
  <div class="edit-profile">
    <h2>編輯個人檔案</h2>
    <el-form
      :model="form"
      label-position="top"
      label-width="100px"
      class="edit-form"
    >
      <el-form-item label="使用者圖片">
        <div class="upload-avatar">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="onFileChange"
          />
          <el-avatar :src="form.avatar" v-if="form.avatar" :size="60" />
          <el-avatar
            :size="60"
            :style="{ backgroundColor: getColorFromChar(form?.username[0]) }"
            v-else
          >
            {{ form?.username[0] || "-" }}
          </el-avatar>

          <el-button
            type="primary"
            @click="openFileDialog"
            :loading="uploading"
          >
            上傳圖片
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="使用者名稱">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.full_name" />
      </el-form-item>
      <el-form-item label="個人簡介">
        <el-input type="textarea" v-model="form.desc" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">儲存變更</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getMe, updateMe, uploadAvatar } from "../api/user";
import { ElMessage } from "element-plus";
import { endLoading, startLoading } from "../utils/loading";
import { getColorFromChar } from "../utils/utils";

const router = useRouter();
const form = ref({
  avatar: "",
  username: "",
  full_name: "",
  desc: "",
});
const fileInput = ref(null);
const uploading = ref(false);
const userId = ref(null);

onMounted(async () => {
  startLoading();
  try {
    const user = await getMe();
    form.value.username = user.username;
    form.value.full_name = user.full_name;
    form.value.desc = user.desc;
    form.value.avatar = user.avatar;
    userId.value = user.id;
  } finally {
    endLoading();
  }
});

const onSubmit = async () => {
  try {
    await updateMe(form.value);
    ElMessage.success("更新成功！");
    router.push(`/profile/${userId.value}`); // 回到個人頁面
  } catch (e) {
    console.error(e);
  }
};

const openFileDialog = () => {
  fileInput.value.click();
};

const onFileChange = async (event) => {
  const files = event.target.files;
  if (!files || !files[0]) return;

  uploading.value = true;

  try {
    const formData = new FormData();
    formData.append("avatar", files[0]);

    const res = await uploadAvatar(formData); // 你自己實作的上傳 API
    console.log(res);
    form.value.avatar = res.avatar_url;

    ElMessage.success("圖片上傳成功！");
  } catch (error) {
    ElMessage.error("圖片上傳失敗");
  } finally {
    uploading.value = false;
    event.target.value = null; // 清空 input 以便下次可選同一檔案
  }
};
</script>

<style scoped>
.edit-profile {
  max-width: 600px;
  margin: 60px auto;
  background: #2e2e2e;
  padding: 40px;
  border-radius: 8px;
}
.edit-form {
  padding-top: 24px;
  color: white;
  button {
    width: 100%;
  }
}
.upload-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  button {
    width: auto;
  }
}
</style>
