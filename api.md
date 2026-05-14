# API Design

## 1. API 架构

### 1.1 REST API

Go backend 提供 REST API，路由通过 Chi router。

主要资源：
- Workspaces
- Issues（包括 UUID 和 human-readable ID 如 MUL-123）
- Agents
- Members
- Labels
- Skills
- Inbox

### 1.2 WebSocket

gorilla/websocket 用于实时事件：
- Agent 进度
- Issue 状态变更
- 评论通知
- Inbox 更新

### 1.3 Real-time 同步

WS events invalidate React Query cache——不直接写 stores。

## 2. 认证与兼容性

### 2.1 API Response Compatibility

Desktop app 安装在用户机器上的版本比它通信的后端旧。

每个响应 shape 是一个 contract，会漂移，前端必须能存活于漂移而不白屏。

规则：
- **Parse，不要 cast**。用 `parseWithFallback` 和 zod schema + explicit fallback。验证失败 log warning 并返回 fallback；不 throw 到 UI。
- **响应 body 不要用 bare `as` casts**。每个被 UI 逻辑消费的 endpoint method 必须先通过 schema。
- **下游用 optional-chain 和 default**。每个 field 都当作可能缺失。用显式 boolean 检查（`=== true`）而非 truthy/falsy negation。
- **不要把 UI affordance 绑定到单一后端 field**。combine signals（cursor presence, page length 等）使 affordance 在最坏情况下也能工作。
- **Enum 降级，不崩溃**。新的 server-side enum 值渲染 generic fallback。switch statements 必须有 `default` branch。
- **添加或改变 endpoint 时**：在同一 PR 添加 schema，并写至少一个测试，喂入 malformed response。

### 2.2 已知事故

三个事故已因违反这些规则发生：#2143, #2147, #2192。

## 3. UUID Handling

### 3.1 路径参数（UUID 或 human-readable ID）

通过 dedicated loader 解析（loadIssueForUser / loadSkillForUser / loadAgentForUser / requireDaemonRuntimeAccess）。解析后所有后续 DB 调用必须使用 entity.ID。

### 3.2 纯 UUID 输入

用 `parseUUIDOrBadRequest(w, s, fieldName)`。invalid input 写 400 并返回。

### 3.3 信任的 UUID round-trip

用 `parseUUID(s)`（调用 `util.MustParseUUID`，invalid input panic）。panic 在这里意味着 unguarded user-input string slipped in——是 real bug。Chi 的 `middleware.Recoverer` 将 panic 翻译为 500，所以进程继续运行。

## 4. 命令

```bash
# Run a single TS test
pnpm --filter @multica/views exec vitest run auth/login-page.test.tsx
pnpm --filter @multica/core exec vitest run runtimes/version.test.ts

# Run a single Go test
cd server && go test ./internal/handler/ -run TestName

# Run E2E test (requires backend + frontend running)
pnpm exec playwright test e2e/tests/specific-test.spec.ts
```
