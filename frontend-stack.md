# Frontend Stack

## 1. 应用层

### 1.1 Web (Next.js App Router)

`apps/web/` 是主要 Web 应用，使用 Next.js App Router。

关键目录：
- `app/` — App Router 页面
- `platform/` — **唯一的** Next.js API 入口（`next/navigation`）
- `features/` — 功能模块

### 1.2 Desktop (Electron)

`apps/desktop/` 是 Electron 桌面应用，使用 electron-vite。

关键目录：
- `src/renderer/src/platform/` — **唯一的** react-router-dom 导航接线

## 2. Package 层级

```
apps/web/platform/     ← 唯一的 next/* 导入地
apps/desktop/src/renderer/src/platform/  ← 唯一的 react-router-dom 导入地
                │
                ▼
packages/core/platform/  ← CoreProvider + NavigationAdapter
                │
        ┌───────┴───────┐
        ▼               ▼
packages/core/      packages/ui/
(Zustand stores,   (纯 UI 组件，
 React Query)       无业务逻辑)
        │               │
        ▼               │
packages/views/          ← 共享业务页面/组件
        │               │  (无 next/*, 无 react-router)
        ▼               │
    apps/web/        apps/desktop/
```

## 3. Package 边界规则（硬规则）

| Package | 约束 |
|---------|------|
| packages/core/ | 零 react-dom，零 localStorage（用 StorageAdapter），零 process.env，零 UI 库 |
| packages/ui/ | 零 @multica/core 导入 |
| packages/views/ | 零 next/* 导入，零 react-router-dom 导入，零 stores。用 NavigationAdapter 做路由 |

## 4. 命令

```bash
pnpm dev:web          # Next.js dev server (port 3000)
pnpm dev:desktop      # Electron dev (electron-vite, HMR)
pnpm build            # Build all frontend apps
pnpm typecheck        # TypeScript check (all packages + apps via turbo)
pnpm test             # TS tests (Vitest, all packages + apps via turbo)
pnpm ui:add badge     # Adds component to packages/ui/components/ui/
```
