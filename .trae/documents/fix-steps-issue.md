# 修复 Steps 组件无法使用的问题

## 问题摘要

`src/content/servers/bst.md` 中使用了 Starlight 的 `<Steps>` 组件,但该文件是 `.md`(纯 Markdown)格式,不支持 MDX 语法(ES `import` 和 JSX 组件标签)。导致:
- `import { Steps } from "@astrojs/starlight/components";` 被当作**普通文本**渲染在页面上
- `<Steps>` 被当作**未知 HTML 标签**原样输出,内部列表退化为普通 `<ol>`

## 当前状态分析

- **唯一使用 Steps 的文件**: [bst.md](file:///c:/Users/hjcdu/Desktop/1145/exotic-equinox/src/content/servers/bst.md) 第 7-15 行
- **内容集合定义**: [content.config.ts](file:///c:/Users/hjcdu/Desktop/1145/exotic-equinox/src/content.config.ts) — loader 模式 `**/*.{md,mdx}` 已包含 `.mdx`,无需修改
- **渲染入口**: [[...slug].astro](file:///c:/Users/hjcdu/Desktop/1145/exotic-equinox/src/pages/servers/[...slug].astro) — 通过 `entry.id` 路由,id 取自文件名(不含扩展名),所以 `bst.md` → `bst.mdx` 后 URL `/servers/bst` 不变
- **MDX 集成**: [astro.config.mjs](file:///c:/Users/hjcdu/Desktop/1145/exotic-equinox/astro.config.mjs) 中 Starlight 会自动注册 `@astrojs/mdx` 集成(项目已声明该依赖),`.mdx` 文件会被全局支持

## 修改方案

### 步骤 1:将 `bst.md` 重命名为 `bst.mdx`

- 创建 `src/content/servers/bst.mdx`,内容与 `bst.md` 完全一致
- 删除 `src/content/servers/bst.md`

文件内容**无需任何改动**——`import` 语句和 `<Steps>` 标签在 `.mdx` 中是合法语法,会正常解析。

### 步骤 2:验证

- 运行 `astro dev` 启动开发服务器
- 访问 `http://localhost:4321/servers/bst`
- 确认:
  1. `import` 语句不再显示为页面文本
  2. Steps 组件正确渲染(带编号圆圈和连接线的步骤列表)
  3. 三个步骤文字正常显示
  4. 下方的详细教程内容(### 第一步 等)正常渲染

### 步骤 3(条件性):样式兜底

若 Steps 组件因自定义布局 [Layout.astro](file:///c:/Users/hjcdu/Desktop/1145/exotic-equinox/src/layouts/Layout.astro) 缺少 Starlight CSS 变量而样式异常,则在 `[...slug].astro` 的 `<style>` 中补充 Steps 所需的样式或 CSS 变量。此步骤仅在验证发现样式问题时执行。

## 假设与决策

- **假设**: Starlight 的 Steps 组件自带 scoped 样式,在 `.mdx` 中导入后可独立渲染,不强制依赖 Starlight 的全局 Page 布局。若此假设不成立,则执行步骤 3。
- **决策**: 采用最小改动原则——仅重命名文件扩展名,不改动文件内容,不改动配置和路由代码。因为 `content.config.ts` 的 glob 模式已包含 `.mdx`,且 `entry.id` 不含扩展名,路由不受影响。

## 影响范围

- 仅涉及 `src/content/servers/` 目录下的文件增删
- 不影响 `content.config.ts`、`[...slug].astro`、`Layout.astro` 等其他文件
- 不影响服务器列表页(列表通过 `getCollection('servers')` 获取,扩展名变更不影响集合内容)
- URL `/servers/bst` 保持不变
