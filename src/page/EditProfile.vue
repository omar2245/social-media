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
import { getMe, updateMe } from "../api/user";
import { ElMessage } from "element-plus";
import { endLoading, startLoading } from "../utils/loading";

const router = useRouter();
const form = ref({
  username: "",
  full_name: "",
  desc: "",
});
const userId = ref(null);

onMounted(async () => {
  startLoading();
  try {
    const user = await getMe();
    form.value.username = user.username;
    form.value.full_name = user.full_name;
    form.value.desc = user.desc;
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
</style>
