# Backend Stack

## 1. 技术栈

| 组件 | 技术 |
|------|------|
| 语言 | Go 1.26+ |
| Router | Chi (轻量, idiomatic Go) |
| Database | PostgreSQL 17 + pgvector (向量存储) |
| Code Gen | sqlc (type-safe SQL) |
| WebSocket | gorilla/websocket |
| Migrations | golang-migrate |

## 2. 目录结构

```
server/
├── internal/
│   ├── handler/         # HTTP handlers (Chi router)
│   ├── service/         # 业务逻辑层
│   ├── storage/         # 数据访问层
│   ├── daemon/          # Local daemon (agent runtime)
│   ├── daemonws/         # Daemon WebSocket
│   ├── realtime/         # Real-time events (WS broadcast)
│   ├── migrations/      # DB migrations
│   ├── analytics/       # 分析功能
│   ├── auth/            # 认证
│   ├── cli/             # CLI 集成
│   ├── events/          # Event system
│   ├── metrics/         # Prometheus metrics
│   ├── middleware/      # Chi middleware
│   ├── mention/         # @mentions 处理
│   └── util/            # 工具函数
├── pkg/
│   └── db/              # sqlc 生成代码
│       └── queries/     # SQL queries
├── migrations/          # SQL migration files
├── go.mod
├── go.sum
└── sqlc.yaml           # sqlc 配置
```

## 3. 关键架构决策

### 3.1 Handler UUID Parsing Convention

每个 Go handler 必须遵循：
- 接受 UUID 或 human-readable identifier 的路径参数 → 通过 loader 解析
- 纯 UUID 输入 → 用 `parseUUIDOrBadRequest(w, s, fieldName)`
- 信任的 UUID round-trip → 用 `parseUUID(s)`

防止 #1661 类型的问题：DELETE 返回 204 但 SQL DELETE 匹配零行。

### 3.2 Real-time Architecture

WebSocket 用于：
- Agent 进度实时推送
- 多人协作事件广播
- Inbox 通知

WS events invalidate React Query（不直接写 stores）。

### 3.3 数据库

PostgreSQL + pgvector 用于：
- 结构化数据（issues, agents, workspaces）
- 向量相似性搜索（skill matching）

## 4. 命令

```bash
make server           # Run Go server only (port 8080)
make daemon           # Run local daemon
make build            # Build server + CLI binaries to server/bin/
make test             # Go tests
make sqlc             # Regenerate sqlc code after editing SQL
make migrate-up       # Run database migrations
make migrate-down     # Rollback migrations
```
