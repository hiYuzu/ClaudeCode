# 2026 FIFA World Cup Predictor — 设计文档

> 日期：2026-06-12
> 状态：待实现

## 1. 项目概述

一个 2026 美加墨世界杯预测工具，用户可以从小组赛到决赛逐轮预测晋级球队，中途可随时修改。纯前端 Vue 3 + Vite 项目，数据自动持久化到本地 JSON 文件。

**目标用户：** 个人使用，无需登录。

## 2. 技术栈

| 层面 | 选择 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 个人项目平衡方案，模板语法直观 |
| 样式 | 原生 CSS（无 Tailwind） | 避免 AI 味，精准控制视觉 |
| 状态管理 | Vue 3 reactive（不用 Pinia） | 项目规模小，简单 reactive store 够用 |
| 路由 | 无 | 单页 Tab 切换 |
| 持久化 | Vite 插件 + JSON 文件 | 自动读写，无需手动操作 |
| 构建 | Vite dev server | 个人工具只需 dev 模式 |

## 3. 赛事数据

### 3.1 小组赛（12组 × 4队 = 48队）

| 组 | 球队 |
|----|------|
| A | 墨西哥、南非、韩国、捷克 |
| B | 加拿大、波黑、卡塔尔、瑞士 |
| C | 巴西、摩洛哥、海地、苏格兰 |
| D | 美国、巴拉圭、澳大利亚、土耳其 |
| E | 德国、库拉索、科特迪瓦、厄瓜多尔 |
| F | 荷兰、日本、瑞典、突尼斯 |
| G | 比利时、埃及、伊朗、新西兰 |
| H | 西班牙、佛得角、沙特、乌拉圭 |
| I | 法国、塞内加尔、伊拉克、挪威 |
| J | 阿根廷、阿尔及利亚、奥地利、约旦 |
| K | 葡萄牙、刚果(金)、乌兹别克斯坦、哥伦比亚 |
| L | 英格兰、克罗地亚、加纳、巴拿马 |

### 3.2 晋级规则

- 每组前 2 名晋级（24队）
- 8 支最佳第 3 名晋级（从 12 支第 3 名中选）
- 共 32 队进入淘汰赛

### 3.3 淘汰赛对阵

使用 FIFA 官方 R32 对阵模板。R32 的具体配对关系（哪个组第1 vs 哪个组第2/第3名）按 FIFA 官方规则硬编码在数据文件中。

### 3.4 赛制验证

- 小组赛：12组 × 6场 = 72场
- 淘汰赛：R32(16) + R16(8) + QF(4) + SF(2) + Final(1) + 三四名(1) = 32场
- 总计：104场 ✓

## 4. 页面结构

### 4.1 导航

顶部 Tab 切换两个视图：
- **小组赛** — 12 组出线选择 + 最佳第3名选择
- **淘汰赛** — 横向收拢式对阵图

### 4.2 小组赛页面

- 12 个小组卡片，3×4 或 4×3 网格布局
- 每个卡片显示 4 支球队，点击选择前 2 名（最多选 2 支）
- 已选球队高亮 + 标注 1st/2nd，未选球队淡化 + 划线
- 底部：最佳第3名选择面板（从 12 支第3名中选 8 支）
- 顶部进度指示：已完成 X/12 组

### 4.3 淘汰赛页面

**布局：横向收拢式对阵图（上下+左右镜面对称）**

```
R32:  [= = = = = = = =]    上半区 8场
R16:      [= = = =]         上半区 4场
QF:         [= =]           上半区 2场
SF:          [=]            上半区 1场
            [🏆]           决赛 + 三四名
SF:          [=]            下半区 1场
QF:         [= =]           下半区 2场
R16:      [= = = =]         下半区 4场
R32:  [= = = = = = = =]    下半区 8场
```

- 每轮一横排，居中排列
- 相邻两场收敛为下一轮一场，用 SVG 连线
- 每个对决卡片：显示两队，点击选择晋级队
- 上半区和下半区上下镜面对称，每个横排左右也镜面对称
- 决赛 + 三四名决赛居中

## 5. 组件架构

```
App.vue
├── TabNav.vue            — 小组赛/淘汰赛 Tab 切换
├── GroupStage.vue        — 小组赛视图
│   ├── GroupCard.vue ×12 — 单组卡片（选前2名）
│   └── BestThirdPicker.vue — 最佳第3名选择
├── KnockoutStage.vue     — 淘汰赛视图
│   ├── BracketRow.vue    — 单轮横排（含 SVG 连线）
│   │   └── MatchUp.vue   — 单场对决
│   └── FinalMatch.vue    — 决赛 + 三四名
└── Header.vue            — 标题 + 操作按钮
```

## 6. 数据模型

### 6.1 核心 Store

```ts
interface Team {
  id: string           // "mex", "bra" 等
  name: string         // "墨西哥"
  flag: string         // emoji 或图片路径
  group: string        // "A"-"L"
}

interface GroupPrediction {
  teams: Team[]        // 4 支球队
  first: Team | null   // 用户选的第1名
  second: Team | null  // 用户选的第2名
}

interface Match {
  id: string           // "r32-1", "sf-upper" 等
  team1: Team | null   // 可能为 null（待定）
  team2: Team | null
  winner: Team | null  // 用户选的晋级队
}

interface Store {
  groups: Record<string, GroupPrediction>  // A-L
  bestThirds: Team[]                        // 8支最佳第3名
  knockout: {
    r32: Match[]                             // 16场
    r16: Match[]                             // 8场
    qf: Match[]                              // 4场
    sf: Match[]                              // 2场
    final: Match                             // 1场
    thirdPlace: Match                        // 1场
  }
  champion: Team | null
}
```

### 6.2 对阵生成逻辑

用户完成小组选择 + 最佳第3名选择后：
1. 按 FIFA 官方对阵模板，将 24 支出线队 + 8 支最佳第3名填入 R32 的 16 场对决
2. 用户选择 R32 晋级队后，自动填入 R16 对应位置
3. 逐轮递推直到决赛

**级联修改规则：** 修改小组出线选择 → 清空所有受影响的后续轮次（R32 → R16 → QF → SF → Final）

## 7. 数据持久化

### 7.1 方案：Vite 中间件 + JSON 文件

```
data/prediction.json  ←→  Vite Plugin (API)  ←→  浏览器
```

### 7.2 Vite 插件实现

```ts
// vite-plugins/persistence.ts
// 注册中间件处理 /api/prediction
// GET → 读取 data/prediction.json 返回
// PUT → 将请求体写入 data/prediction.json
```

### 7.3 自动化流程

- **页面加载**：`GET /api/prediction` → 恢复状态（若无文件则初始空状态）
- **每次修改**：防抖 500ms 后 `PUT /api/prediction` → 自动保存
- **手动备份**：Header 区域保留「导出 JSON」/「导入 JSON」按钮作为备用

## 8. 视觉设计

### 8.1 配色（色弱友好）

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#111111` | 深灰黑 |
| 卡片背景 | `#1c1c1c` | 用明度区分，不依赖色相 |
| 高亮条目 | `#2a2a2a` | 选中/悬浮背景 |
| 边框 | `#333`/`#444` | 清晰边界 |
| 选中强调 | `#3b82f6` | 蓝色，避免红绿 |
| 决赛/金色 | `#f59e0b` | 冠军、决赛 |
| 主文字 | `#f0f0f0` | 高对比 |
| 次要文字 | `#888` | 标签、提示 |

### 8.2 动效

- 选中/取消：平滑高亮 + 轻微缩放（0.15s ease）
- 级联清空：淡出动画提示受影响的后续轮次
- Tab 切换：滑动过渡
- 进度条：填充动画

### 8.3 响应式

- 小组卡片：大屏 4列 → 中屏 3列 → 小屏 2列 → 手机 1列
- 淘汰赛对阵图：支持横向滚动（R32 8场排开需要较宽空间）
- 决赛区域始终居中可见

## 9. 文件结构

```
world-cup-predictor/
├── data/
│   ├── prediction.json              ← 自动存档
│   └── tournament.json              ← 赛事静态数据（分组、对阵模板）
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── style.css                    ← 全局样式 + CSS 变量
│   ├── store/
│   │   └── index.ts                 ← reactive store + 自动持久化
│   ├── data/
│   │   └── tournament.ts            ← 48队数据 + 对阵模板
│   ├── components/
│   │   ├── Header.vue
│   │   ├── TabNav.vue
│   │   ├── GroupStage.vue
│   │   ├── GroupCard.vue
│   │   ├── BestThirdPicker.vue
│   │   ├── KnockoutStage.vue
│   │   ├── BracketRow.vue
│   │   ├── MatchUp.vue
│   │   └── FinalMatch.vue
│   └── utils/
│       ├── bracket.ts               ← 对阵生成 + 级联逻辑
│       └── persistence.ts           ← API 调用封装
├── vite-plugins/
│   └── persistence.ts               ← Vite 中间件
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 10. 成功标准

- [ ] 小组赛页面能正确展示 12 组，用户可选前 2 名
- [ ] 最佳第3名选择面板正确展示 12 支第3名，可选 8 支
- [ ] 淘汰赛对阵图按横向收拢式布局，上下+左右镜面对称
- [ ] SVG 连线正确连接各轮次
- [ ] 选择 R32 晋级队后自动填入 R16，逐轮递推
- [ ] 修改小组出线后级联清空受影响轮次
- [ ] 页面加载时自动从 JSON 恢复状态
- [ ] 每次修改后 500ms 防抖自动保存
- [ ] 色弱友好配色，明度区分层次清晰
