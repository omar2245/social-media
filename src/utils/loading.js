import { ElLoading, ElMessage } from "element-plus";

let loadingInstance;
let slowLoadingTimer;

const startLoading = (text = "載入中") => {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: text,
    background: "rgba(0, 0, 0, 0.7)",
  });

  // 3 秒後如果還在加載，顯示提示
  slowLoadingTimer = setTimeout(() => {
    if (loadingInstance) {
      // 更新加載文本
      const loadingElement = document.querySelector(".el-loading-text");
      if (loadingElement) {
        loadingElement.textContent = "伺服器回應較慢，請耐心等待...";
        loadingElement.style.fontSize = "14px";
      }
    }
  }, 3000);
};

const endLoading = () => {
  clearTimeout(slowLoadingTimer);
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
};

export { startLoading, endLoading };
