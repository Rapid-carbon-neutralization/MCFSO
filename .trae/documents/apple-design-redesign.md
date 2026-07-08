# Apple 风格设计重构计划

## 问题摘要

按照 DESIGN.md 中的 Apple 设计规范，将 MCFSO 网站从当前 Minecraft 深色像素风格完全重构为 Apple 摄影-first 白色风格。

## 当前状态分析

### 当前风格 (Minecraft)
- **颜色**: 深色背景 (#131318) + 绿宝石强调色 (#3DDC84)
- **字体**: Silkscreen 像素字体 + Space Grotesk
- **布局**: 像素网格背景，紧凑边距
- **边框**: Beveled 斜切边框（模拟游戏物品栏）
- **阴影**: Glow 效果用于交互元素
- **组件**: Slot 风格卡片、像素方块步骤标记

### 目标风格 (Apple)
- **颜色**: 白色/羊皮纸背景 + 近黑色瓷砖，单一蓝色强调色 #0066cc
- **字体**: SF Pro Display/Text（或 Inter 作为替代），17px body，negative letter-spacing
- **布局**: Edge-to-edge product tiles，80px section padding，交替亮/暗区块
- **阴影**: 仅一个阴影用于产品图片 `rgba(0, 0, 0, 0.22) 3px 5px 30px`
- **圆角**: Pill 按钮 (9999px)，卡片 (18px)
- **组件**: Store-utility-card 风格，pill 形状 CTA 按钮

## 修改方案

### 步骤 1: 重构 Layout.astro — 设计系统核心

**文件**: `src/layouts/Layout.astro`

**修改内容**:
1. **字体**: 从 Google Fonts 加载 Inter（SF Pro 的开源替代），设置 fallback stack
2. **颜色变量**: 完全替换为 Apple 风格
   - `--canvas`: #ffffff (纯白)
   - `--canvas-parchment`: #f5f5f7 (羊皮纸)
   - `--surface-tile-1`: #272729 (近黑瓷砖1)
   - `--surface-tile-2`: #2a2a2c (近黑瓷砖2)
   - `--surface-black`: #000000 (纯黑导航栏)
   - `--primary`: #0066cc (Action Blue)
   - `--primary-focus`: #0071e3 (Focus Blue)
   - `--primary-on-dark`: #2997ff (Sky Link Blue)
   - `--ink`: #1d1d1f (近黑文字)
   - `--ink-muted-80`: #333333 (muted 文字)
   - `--ink-muted-48`: #7a7a7a (disabled/fine-print)
   - `--divider-soft`: #f0f0f0 (分隔线)
   - `--hairline`: #e0e0e0 (卡片边框)
3. **字体变量**: Inter 配合 SF Pro fallback
   - `--font-display`: Inter (600 weight, negative letter-spacing)
   - `--font-body`: Inter (400 weight, 17px, 1.47 line-height)
4. **全局样式**: 移除像素网格背景，改为纯白/羊皮纸背景
5. **阴影**: 定义唯一的产品阴影变量 `--product-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px`
6. **圆角变量**: 定义 Apple 圆角系统
   - `--rounded-sm`: 8px
   - `--rounded-lg`: 18px
   - `--rounded-pill`: 9999px

### 步骤 2: 重构 Header.astro — Apple 全局导航栏

**文件**: `src/components/Header.astro`

**修改内容**:
1. **背景**: `--surface-black` (#000000)，高度 44px
2. **Logo**: 移除 slot 边框，纯白文字
3. **字体**: SF Pro Text fallback，12px，-0.12px letter-spacing
4. **搜索框**: 白色背景，pill 形状 (9999px)，44px 高度，hairline 边框
5. **交互**: 移除 glow 效果，使用简单的 border-color 变化

### 步骤 3: 重构 index.astro — Apple 风格 Hero 页面

**文件**: `src/pages/index.astro`

**修改内容**:
1. **布局**: Edge-to-edge hero tile，80px 上下 padding
2. **背景**: `--canvas-parchment` (#f5f5f7)
3. **标题**: 56px / 600 weight / -0.28px letter-spacing（`hero-display` 规格）
4. **副标题**: 28px / 400 weight（`lead` 规格）
5. **描述**: 17px / 400 weight / 1.47 line-height（`body` 规格）
6. **CTA 按钮**: Action Blue (#0066cc) pill 形状，11px × 22px padding，SF Pro Text 17px
7. **Logo**: 移除 slot 边框，直接展示 PNG 图标，可选添加产品阴影
8. **移除**: 像素方块装饰元素

### 步骤 4: 重构 ServerCard.astro — store-utility-card 风格

**文件**: `src/components/ServerCard.astro`

**修改内容**:
1. **背景**: `--canvas` (#ffffff)
2. **边框**: 1px solid `--hairline` (#e0e0e0)
3. **圆角**: 18px (`--rounded-lg`)
4. **内边距**: 24px
5. **图标**: 1:1 比例，8px 内圆角，可选添加产品阴影
6. **文字**: 
   - 名称: 17px / 600 weight (`body-strong`)
   - 描述: 17px / 400 weight (`body`)
7. **链接**: Action Blue 文字链接，非按钮形式
8. **交互**: 移除 glow 效果，hover 时仅改变 border-color 或轻微 scale

### 步骤 5: 重构 servers/index.astro — 网格列表页

**文件**: `src/pages/servers/index.astro`

**修改内容**:
1. **背景**: `--canvas-parchment` (#f5f5f7)
2. **标题**: 40px / 600 weight / 0 letter-spacing (`display-lg`)
3. **副标题**: 14px / 400 weight (`caption`)
4. **网格**: 2-3 列布局，24px gap，store-utility-card 风格卡片
5. **搜索**: 保持 header 中的搜索框

### 步骤 6: 重构 servers/[...slug].astro — 产品详情页

**文件**: `src/pages/servers/[...slug].astro`

**修改内容**:
1. **布局**: Edge-to-edge，类似 Apple product tile
2. **背景**: 交替使用 `--canvas` 和 `--surface-tile-1`
3. **标题**: 40px / 600 weight (`display-lg`)
4. **描述**: 17px / 400 weight (`body`)
5. **内容**: 17px / 400 weight / 1.47 line-height，Action Blue 链接
6. **步骤列表**: 使用简单的有序列表，移除像素方块标记
7. **代码块**: 移除 command block 风格，使用简单的等宽字体 + 背景色
8. **返回链接**: Action Blue 文字链接，无边框

### 步骤 7: 验证与调整

**验证步骤**:
1. 启动 `astro dev` 查看所有页面
2. 检查颜色一致性：所有交互元素使用 #0066cc
3. 检查字体规格：body 17px，headline negative letter-spacing
4. 检查阴影使用：仅用于产品图片，无卡片/按钮阴影
5. 检查圆角一致性：pill 按钮，lg 卡片
6. 检查响应式：834px, 1068px, 1440px breakpoints

## 假设与决策

- **字体替代**: 使用 Inter 作为 SF Pro 的开源替代，配合 `font-feature-settings: "ss03"` 和 `-0.01em` letter-spacing 调整
- **产品阴影**: 由于服务器图标较小，产品阴影可能不适合，暂时不添加或使用轻微版本
- **Tile 交替**: 由于只有一个服务器数据，首页 hero 使用 parchment 背景，详情页使用 white 背景
- **保持内容**: 文案内容保持不变，仅改变视觉呈现

## 影响范围

- 所有 `.astro` 文件（Layout、Header、index、ServerCard、servers/index、servers/[...slug]）
- 全局 CSS 变量和设计系统
- 字体加载 URL
- 组件视觉风格

## 设计规范关键点（来自 DESIGN.md）

1. **单一蓝色强调色**: 所有交互元素使用 #0066cc，无第二品牌色
2. **17px body 文字**: 非 16px，这是 Apple 的"阅读而非扫描"节奏
3. **Negative letter-spacing**: headline 使用 -0.28 → -0.374px
4. **仅一个阴影**: `rgba(0, 0, 0, 0.22) 3px 5px 30px` 仅用于产品图片
5. **无装饰渐变**: 无 CSS gradient 背景，氛围来自摄影
6. **Pill 按钮**: 所有主要 CTA 使用 9999px 圆角
7. **Edge-to-edge tiles**: 产品区块全宽，颜色变化作为分隔
8. **Weight ladder**: 300 / 400 / 600 / 700，无 500