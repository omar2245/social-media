import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "127.0.0.1", // 或你可以用 'localhost' 或特定 IP
    port: 5001, // 你要使用的 port
  },
});
