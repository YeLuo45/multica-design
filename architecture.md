# Architecture Overview

## 1. 项目定位

Multica = **Mul**tiplexed **I**nformation and **C**omputing **A**gent

将 coding agents 变成真正的团队成员——分配任务、跟踪进度、累积技能。类 Linear 但 AI agent 是第一公民。

## 2. 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Web (Next) │  │Desktop(Electron)│  CLI (Go)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Packages                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  core/   │  │   ui/    │  │  views/   │  │ tsconfig/    │ │
│  │ (Zustand │  │(shadcn)  │  │ (页面组件) │  │ (共享配置)    │ │
│  │ + RQ)    │  │          │  │           │  │              │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Go)                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Chi Router │ sqlc (DB) │ gorilla/websocket │ Real-time  │ │
│  └────────────────────────────────────────────────────────┘ │
│                        PostgreSQL + pgvector                │
└─────────────────────────────────────────────────────────────┘
```

## 3. 目录结构

```
multica/
├── server/              # Go 后端
│   ├── internal/
│   │   ├── handler/     # HTTP handlers (Chi router)
│   │   ├── service/     # 业务逻辑
│   │   ├── storage/     # 数据访问层
│   │   ├── daemon/      # Local daemon
│   │   └── realtime/    # WebSocket handlers
│   ├── migrations/      # DB migrations (golang-migrate)
│   ├── pkg/db/          # sqlc 生成代码
│   └── go.mod
├── apps/
│   ├── web/             # Next.js (App Router)
│   └── desktop/         # Electron desktop app
├── packages/
│   ├── core/            # Headless 业务逻辑 (Zustand + React Query)
│   ├── ui/              # 原子 UI 组件 (shadcn/Base UI)
│   ├── views/           # 共享业务页面组件
│   └── tsconfig/        # 共享 TypeScript 配置
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 4. 技术决策

### 4.1 Internal Packages Pattern

所有共享包导出原始 .ts/.tsx 文件（无预编译）。消费 app 的 bundler 直接编译，实现零配置 HMR 和即时跳转定义。

### 4.2 依赖方向

`views/ → core/ + ui/`。Core 和 UI 互相独立。无 package 导入 `next/*`、`react-router-dom`。

### 4.3 Platform Bridge

`packages/core/platform/` 提供 `CoreProvider`——初始化 API client、auth/workspace stores、WebSocket 连接和 QueryClient。每个 app 用 `<CoreProvider>` 包装根节点并提供自己的 `NavigationAdapter`。

## 5. 状态管理

- **TanStack Query** 拥有所有服务端状态
- **Zustand** 拥有所有客户端状态
- **WebSocket events** invalidate queries，不直接写 stores
