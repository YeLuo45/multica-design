import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Multica Design",
  description: "Multica 架构设计文档站",
  base: "/multica-design/",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "https://raw.githubusercontent.com/multica-ai/multica/main/docs/assets/logo-light.svg" }],
  ],
  themeConfig: {
    logo: "https://raw.githubusercontent.com/multica-ai/multica/main/docs/assets/logo-light.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "架构", link: "/architecture" },
      { text: "前端", link: "/frontend" },
      { text: "后端", link: "/backend" },
      { text: "包结构", link: "/packages" },
      { text: "状态管理", link: "/state-management" },
      { text: "部署", link: "/deployment" },
      { text: "API", link: "/api" },
    ],
    sidebar: [
      {
        text: "文档",
        items: [
          { text: "首页", link: "/" },
          { text: "架构概览", link: "/architecture" },
          { text: "前端架构", link: "/frontend" },
          { text: "后端架构", link: "/backend" },
          { text: "包结构", link: "/packages" },
          { text: "状态管理", link: "/state-management" },
          { text: "部署", link: "/deployment" },
          { text: "API 设计", link: "/api" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/multica-ai/multica" },
    ],
    footer: {
      message: "基于 Multica 开源项目构建",
      copyright: "Copyright © 2024-present Multica Contributors",
    },
  },
});
