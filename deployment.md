# Deployment

## 1. 部署模式

### 1.1 Docker Compose (推荐本地/开发)

```bash
docker-compose up -d
```

### 1.2 Self-hosted

完整自托管部署指南见 `SELF_HOSTING.md`。

关键镜像：`ghcr.io/multica-ai/multica/server:latest`

### 1.3 Kubernetes

 Helm chart 可用。见 `SELF_HOSTING.md` 详细说明。

### 1.4 Cloud

官方托管：https://multica.ai/app

## 2. 前端构建

```bash
pnpm install
pnpm build          # 构建所有前端 apps
pnpm typecheck      # TypeScript check
```

## 3. 后端构建

```bash
make build          # 构建 server + CLI 到 server/bin/
make server         # 运行 Go server (port 8080)
make daemon         # 运行 local daemon
```

## 4. 数据库

PostgreSQL 17 + pgvector。

本地开发用 `make db-up` 启动共享容器。

CI 用 `pgvector/pgvector:pg17` 镜像。

## 5. Worktree 支持

所有 checkouts 共享一个 PostgreSQL 容器。隔离在数据库级别——每个 worktree 通过 `.env.worktree` 获取独立的 DB name 和唯一端口。

`make dev` 自动检测 worktrees 并处理一切。显式控制：

```bash
make worktree-env       # Generate .env.worktree with unique DB/ports
make setup-worktree     # Setup using .env.worktree
make start-worktree     # Start using .env.worktree
```

## 6. 环境变量

`.env.example` 提供所有配置选项。

Main checkouts 使用 `.env`。Worktrees 使用 `.env.worktree`。

## 7. CI

CI 运行在 Node 22 和 Go 1.26.1 上，使用 `pgvector/pgvector:pg17` PostgreSQL 服务。

详见 `.github/workflows/ci.yml`。
