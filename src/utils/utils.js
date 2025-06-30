const colors = [
  "#A26769", // 深玫瑰紅
  "#D9A5B3", // 飽和裸粉
  "#AA7D66", // 溫暖橘棕
  "#888C6C", // 暖橄欖綠
  "#9C9C89", // 穩重卡其灰
  "#B07280", // 暖紫紅
  "#6E5A7E", // 鈍紫色
  "#A1764D", // 焦糖奶茶
  "#7A9E9F", // 藍綠灰
  "#A4B494", // 淡苔綠
];

export function getColorFromChar(char) {
  if (!char) return "#999";
  const code = char.charCodeAt(0);
  const index = code % colors.length;
  return colors[index];
}
