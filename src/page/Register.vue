<template>
  <div class="form-container">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="username">
        <el-input placeholder="使用者名稱" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="email">
        <el-input placeholder="電子信箱" v-model="form.email" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="密碼" v-model="form.password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onRegister">註冊</el-button>
      </el-form-item>
      <el-form-item class="login">
        <p>已經有帳號嗎?</p>
        <a @click="() => router.push('/login')">登入</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import { useRouter } from "vue-router";
import { authApi } from "../api/axios";

const router = useRouter();
const formRef = ref();
const form = reactive({
  username: "",
  email: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "請輸入使用者名稱", trigger: "blur" }],
  email: [{ required: true, message: "請輸入電子信箱", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
};

const onRegister = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const res = await authApi.post("/register", form);

      ElMessage.success("Register success!");
      router.push("/login");
    } catch (err) {
      ElMessage.error(err.response?.data?.message || "Register failed");
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

.login {
  a {
    cursor: pointer;
    padding-left: 12px;
  }
}
</style>
