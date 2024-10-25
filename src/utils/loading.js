import { ElLoading } from "element-plus";

let loadingInstance;
const startLoading = () => {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "載入中",
    background: "rgba(0, 0, 0, 0.7)",
  });
};
const endLoading = () => {
  loadingInstance.close();
};

export { startLoading, endLoading };
