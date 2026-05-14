# Packages

## 1. @multica/core

Headless 业务逻辑，零 react-dom，零 localStorage，零 process.env，可在所有平台复用。

### 子模块

| 模块 | 描述 |
|------|------|
| issues/ | Issue 管理（queries, mutations, stores） |
| labels/ | 标签管理 |
| inbox/ | Inbox 通知（WebSocket updaters） |
| agents/ | Agent 管理（presence, activity） |
| permissions/ | 权限规则 |
| notification-preferences/ | 通知偏好 |
| autopilots/ | Autopilot 配置 |
| modals/ | Modal 状态管理 |
| types/ | 类型定义 |
| platform/ | CoreProvider + NavigationAdapter |

### State Management

- **React Query** 拥有所有服务端状态（issues, members, agents, inbox）
- **Zustand** 拥有所有客户端状态（UI 选择、filters、drafts、modals）

## 2. @multica/ui

原子 UI 组件库，zero business logic，zero @multica/core imports。

基于 shadcn/Base UI variant，base-nova style。

## 3. @multica/views

共享业务页面/组件，zero next/* imports，zero react-router-dom imports。

通过 NavigationAdapter 做路由。

## 4. @multica/tsconfig

共享 TypeScript 配置（base.json, react-library.json）。

## 5. pnpm catalog

`pnpm-workspace.yaml` 定义 `catalog:` 用于版本锁定。所有共享依赖使用 `catalog:` 引用，保证单一版本。

添加新的共享依赖时（包括 test deps），先添加到 catalog。

## 6. 包边界（硬规则）

```
packages/core/  ─ 零 react-dom, 零 localStorage, 零 process.env
packages/ui/    ─ 零 @multica/core imports
packages/views/ ─ 零 next/*, 零 react-router-dom, 零 stores
apps/web/platform/ ─ 唯一的 next/* 导入地
apps/desktop/src/renderer/src/platform/ ─ 唯一的 react-router-dom 导入地
```
