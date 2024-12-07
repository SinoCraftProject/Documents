import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "华夏工艺文档",
  description: "华夏工艺系列模组的官方文档",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
