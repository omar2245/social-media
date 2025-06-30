<template>
  <div class="form-container">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="username">
        <el-input placeholder="使用者名稱或電子信箱" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="密碼" v-model="form.password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin">登入</el-button>
      </el-form-item>
      <el-form-item class="register">
        <p>沒有帳號嗎?</p>
        <a @click="() => router.push('/register')">註冊</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { useRouter } from "vue-router";
import { authApi } from "../api/axios";

const router = useRouter();
const formRef = ref();
const form = reactive({
  username: "", // 可以是 email 或 username
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      message: "Please enter email or username",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please enter password", trigger: "blur" },
  ],
};

const onLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      const res = await authApi.post("/login", form);
      const { access_token, refresh_token } = res.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      ElMessage.success("登入成功");
      router.push("/home"); // 登入後導向主頁
    } catch (err) {
      ElMessage.error(err.response?.data?.message || "登入失敗");
    }
  });
};
</script>
<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 垂直置中 */
  padding: 40px;
  box-sizing: border-box;
}

.el-form {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #bbb;
  button {
    width: 100%;
  }
}
.register {
  a {
    cursor: pointer;
    padding-left: 12px;
  }
}
</style>
