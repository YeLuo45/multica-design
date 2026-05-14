# State Management

## 1. 核心原则

架构依赖服务端状态和客户端状态的严格分离。混合它们是最常见的破坏方式。

## 2. TanStack Query（服务端状态）

拥有所有服务端状态。任何从 API 获取的数据都在 Query cache 中。

- Issues, users, workspaces, inbox
- WebSocket events 通过 invalidation 保持新鲜（无 polling，无 staleTime workaround）

## 3. Zustand（客户端状态）

拥有所有客户端状态：UI selections, filters, drafts, modal state, navigation history。

- 所有 Zustand stores 位于 packages/core/（不在 packages/views/ 或 app 目录）
- 两个 app 共享同一个 store

## 4. React Context

保留给跨切面的平台管道：WorkspaceIdProvider, NavigationProvider。

不要用于一般状态。

## 5. Auth 和 Workspace Stores

唯一允许直接调用 api.* 的 stores，因为它们管理在 queries 运行前必须存在的关键状态。

它们通过 factory + injected dependencies 创建，由 platform 层注册。

## 6. 硬规则

1. **不要复制服务端数据到 Zustand**。如果数据来自 API，它属于 Query cache。复制到 store 会产生两个真相源并最终漂移。
2. **Workspace-scoped queries 必须以 wsId 为 key**。这使得 workspace 切换自动化——cache key 改变，正确数据出现，无需手动 invalidation。
3. **Mutations 默认 optimistic**。本地应用变更，发送请求，失败回滚，settle 时 invalidation。用户不应该等待服务器。
4. **WS events invalidate queries——从不直接写 stores**。这保持 cache 作为单一真相源，避免 race conditions。
5. **持久化值得跨重启保留的**（user preferences, drafts, tab layout）。**不要持久化临时 UI 状态**（modal open/close, transient selections）或服务端数据。

## 7. Zustand Footguns

- Selectors 必须返回稳定引用。返回 freshly built object 或 array（`s => ({ a: s.a, b: s.b })` 或 `s => s.items.map(...)`）会触发无限 re-render。要么单独选择 primitives，要么使用 shallow comparison。
- 需要 workspace context 的 hooks 应该接受 wsId 作为参数，而不是内部调用 useWorkspaceId()——这让它们在 WorkspaceIdProvider 外部也能工作。
