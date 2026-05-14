---
layout: home

hero:
  name: "Multica Design"
  text: "AI-native Task Management Platform"
  tagline: "开源 AI Agent 管理平台，Agent 与人类并肩工作"
  image:
    src: https://raw.githubusercontent.com/multica-ai/multica/main/docs/assets/logo-light.svg
    alt: Multica Logo
  actions:
    - theme: brand
      text: 架构概览
      link: /architecture
    - theme: brand
      text: 前端架构
      link: /frontend

features:
  - icon: 🏗️
    title: Go Backend
    details: Chi router + sqlc + gorilla/websocket，高性能 Go 后端
  - icon: ⚡
    title: Monorepo 前端
    details: Next.js + Electron + Turborepo + pnpm workspaces
  - icon: 🎨
    title: 原子化 UI
    details: shadcn/Base UI 组件库，零业务逻辑
  - icon: 🧠
    title: Headless 业务逻辑
    details: packages/core 包含所有 Zustand stores 和 React Query hooks
  - icon: 🔄
    title: 实时协作
    details: WebSocket 实时推送，TanStack Query 缓存同步
  - icon: 🐳
    title: 多种部署方式
    details: Docker Compose / Kubernetes / Self-hosted / Cloud
---
