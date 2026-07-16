# FeedFlow - 极简 RSS 阅读器

基于 Vibe Coding 工作流开发的 RSS 信息聚合阅读器。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: Turso (SQLite Edge)
- **ORM**: Drizzle ORM
- **部署**: Vercel

## 功能

- 添加/删除 RSS 订阅源
- 自动定时抓取文章（每 30 分钟）
- 按信源筛选文章
- 标记已读 / 全部已读
- 内置 5 个默认信源（Hacker News、少数派、36kr、阮一峰博客、Lobsters）

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量
cp .env.example .env.local
# 填入你的 Turso 数据库 URL 和 Token

# 3. 推送数据库 schema
npm run db:push

# 4. 启动开发服务器
npm run dev
```

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `TURSO_DATABASE_URL` | Turso 数据库 URL |
| `TURSO_AUTH_TOKEN` | Turso 认证 Token |
| `CRON_SECRET` | Vercel Cron Job 认证密钥 |

## 部署

1. 在 Vercel 上导入 GitHub 仓库
2. 配置环境变量
3. 运行 `npm run db:push` 初始化数据库
4. 自动部署完成

## 项目结构

```
feedflow/
├── app/
│   ├── api/           # API 路由
│   ├── components/    # React 组件
│   ├── lib/           # 工具函数
│   ├── page.tsx       # 主页
│   └── settings/      # 设置页
├── drizzle/           # 数据库 schema 和迁移
└── .github/workflows/ # CI 配置
```
