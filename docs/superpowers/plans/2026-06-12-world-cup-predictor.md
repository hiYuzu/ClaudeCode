# World Cup 2026 Predictor 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 2026 世界杯预测 Web 应用，用户可从小组赛到决赛逐轮预测，数据自动持久化。

**Architecture:** Vue 3 + Vite + TypeScript 单页应用。两个 Tab 视图（小组赛/淘汰赛），reactive store 管理状态，Vite 中间件处理 JSON 自动读写。淘汰赛为横向收拢式对阵图，上下左右四向对称。

**Tech Stack:** Vue 3.5+, Vite 6, TypeScript 5, 原生 CSS（无 Tailwind）

---

## Task 1: 项目脚手架搭建

**Files:**
- Create: `world-cup-predictor/package.json`
- Create: `world-cup-predictor/vite.config.ts`
- Create: `world-cup-predictor/tsconfig.json`
- Create: `world-cup-predictor/index.html`
- Create: `world-cup-predictor/src/main.ts`
- Create: `world-cup-predictor/src/App.vue`
- Create: `world-cup-predictor/src/vite-env.d.ts`

- [ ] **Step 1: 创建项目目录并初始化**

```bash
cd D:\project\ClaudeCode
mkdir world-cup-predictor
cd world-cup-predictor
```

- [ ] **Step 2: 创建 package.json**

```json
{
  "name": "world-cup-predictor",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "vite-plugins/**/*.ts"]
}
```

- [ ] **Step 4: 创建 vite.config.ts**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { persistencePlugin } from './vite-plugins/persistence'

export default defineConfig({
  plugins: [vue(), persistencePlugin()],
  server: { port: 3000 }
})
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>2026 World Cup Predictor</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 6: 创建 src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 7: 创建 src/main.ts**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

- [ ] **Step 8: 创建 src/App.vue（骨架）**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'group' | 'knockout'>('group')
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <h1 class="app-title">⚽ 2026 World Cup Predictor</h1>
    </header>
    <nav class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'group' }"
        @click="activeTab = 'group'"
      >小组赛</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'knockout' }"
        @click="activeTab = 'knockout'"
      >淘汰赛</button>
    </nav>
    <main class="app-main">
      <p style="color:#888;text-align:center;padding:40px;">Loading...</p>
    </main>
  </div>
</template>
```

- [ ] **Step 9: 安装依赖**

```bash
cd D:\project\ClaudeCode\world-cup-predictor && npm install
```

- [ ] **Step 10: 创建 data 目录占位**

```bash
mkdir data
```

- [ ] **Step 11: 提交**

```bash
git add . && git commit -m "chore: scaffold Vue 3 + Vite + TS project"
```

---

## Task 2: 全局样式

**Files:**
- Create: `world-cup-predictor/src/style.css`

- [ ] **Step 1: 创建全局样式文件**

定义 CSS 变量和基础样式。色弱友好的明度梯度配色。

```css
:root {
  --bg-page: #111111;
  --bg-card: #1c1c1c;
  --bg-highlight: #2a2a2a;
  --border-subtle: #333333;
  --border-default: #444444;
  --accent: #3b82f6;
  --accent-glow: rgba(59, 130, 246, 0.15);
  --gold: #f59e0b;
  --gold-gradient: linear-gradient(135deg, #f59e0b, #d97706);
  --text-primary: #f0f0f0;
  --text-secondary: #888888;
  --text-muted: #555555;
  --transition-fast: 0.15s ease;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg-page);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
}

#app-root {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.tab-nav {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
}

.tab-btn {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  padding: 10px 28px;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
.tab-btn:last-child { border-radius: 0 var(--radius-md) var(--radius-md) 0; }

.tab-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  background: var(--bg-highlight);
}

.app-main { min-height: 60vh; }

/* 通用小组卡片网格 */
.group-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 1100px) { .group-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .group-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .group-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: 验证 dev server 启动**

```bash
cd D:\project\ClaudeCode\world-cup-predictor && npm run dev
```

预期：浏览器打开 localhost:3000 看到标题和两个 Tab。

- [ ] **Step 3: 提交**

```bash
git add . && git commit -m "feat: add global styles with colorblind-friendly palette"
```

---

## Task 3: 赛事数据 + Bracket 模板

**Files:**
- Create: `world-cup-predictor/src/data/tournament.ts`

此文件包含全部 48 队数据和 FIFA 官方 R32 对阵模板。

- [ ] **Step 1: 创建赛事数据文件**

根据 FIFA 官方分组和 Wikipedia 淘汰赛对阵表。R32 对阵的 8 个第三名位取决于哪 8 支第 3 名出线，有 495 种组合（Annex C）。简化处理：使用一个函数根据选出的 8 支第 3 名查找对应的组合编号，然后映射到各场比赛。

```ts
export interface Team {
  id: string
  name: string
  flag: string
  group: string
}

export interface Slot {
  type: 'winner' | 'runner' | 'third'
  group: string
}

export interface R32MatchTemplate {
  id: number        // match number 73-88
  half: 'upper' | 'lower'
  posInHalf: number // 0-7 within half, determines horizontal position
  slot1: Slot
  slot2: Slot
}

// 48 teams in 12 groups
export const GROUPS: Record<string, Team[]> = {
  A: [
    { id: 'mex', name: '墨西哥', flag: '🇲🇽', group: 'A' },
    { id: 'rsa', name: '南非', flag: '🇿🇦', group: 'A' },
    { id: 'kor', name: '韩国', flag: '🇰🇷', group: 'A' },
    { id: 'cze', name: '捷克', flag: '🇨🇿', group: 'A' },
  ],
  B: [
    { id: 'can', name: '加拿大', flag: '🇨🇦', group: 'B' },
    { id: 'bih', name: '波黑', flag: '🇧🇦', group: 'B' },
    { id: 'qat', name: '卡塔尔', flag: '🇶🇦', group: 'B' },
    { id: 'sui', name: '瑞士', flag: '🇨🇭', group: 'B' },
  ],
  C: [
    { id: 'bra', name: '巴西', flag: '🇧🇷', group: 'C' },
    { id: 'mar', name: '摩洛哥', flag: '🇲🇦', group: 'C' },
    { id: 'hai', name: '海地', flag: '🇭🇹', group: 'C' },
    { id: 'sco', name: '苏格兰', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  ],
  D: [
    { id: 'usa', name: '美国', flag: '🇺🇸', group: 'D' },
    { id: 'par', name: '巴拉圭', flag: '🇵🇾', group: 'D' },
    { id: 'aus', name: '澳大利亚', flag: '🇦🇺', group: 'D' },
    { id: 'tur', name: '土耳其', flag: '🇹🇷', group: 'D' },
  ],
  E: [
    { id: 'ger', name: '德国', flag: '🇩🇪', group: 'E' },
    { id: 'cuw', name: '库拉索', flag: '🇨🇼', group: 'E' },
    { id: 'civ', name: '科特迪瓦', flag: '🇨🇮', group: 'E' },
    { id: 'ecu', name: '厄瓜多尔', flag: '🇪🇨', group: 'E' },
  ],
  F: [
    { id: 'ned', name: '荷兰', flag: '🇳🇱', group: 'F' },
    { id: 'jpn', name: '日本', flag: '🇯🇵', group: 'F' },
    { id: 'swe', name: '瑞典', flag: '🇸🇪', group: 'F' },
    { id: 'tun', name: '突尼斯', flag: '🇹🇳', group: 'F' },
  ],
  G: [
    { id: 'bel', name: '比利时', flag: '🇧🇪', group: 'G' },
    { id: 'egy', name: '埃及', flag: '🇪🇬', group: 'G' },
    { id: 'irn', name: '伊朗', flag: '🇮🇷', group: 'G' },
    { id: 'nzl', name: '新西兰', flag: '🇳🇿', group: 'G' },
  ],
  H: [
    { id: 'esp', name: '西班牙', flag: '🇪🇸', group: 'H' },
    { id: 'cpv', name: '佛得角', flag: '🇨🇻', group: 'H' },
    { id: 'ksa', name: '沙特', flag: '🇸🇦', group: 'H' },
    { id: 'uru', name: '乌拉圭', flag: '🇺🇾', group: 'H' },
  ],
  I: [
    { id: 'fra', name: '法国', flag: '🇫🇷', group: 'I' },
    { id: 'sen', name: '塞内加尔', flag: '🇸🇳', group: 'I' },
    { id: 'irq', name: '伊拉克', flag: '🇮🇶', group: 'I' },
    { id: 'nor', name: '挪威', flag: '🇳🇴', group: 'I' },
  ],
  J: [
    { id: 'arg', name: '阿根廷', flag: '🇦🇷', group: 'J' },
    { id: 'alg', name: '阿尔及利亚', flag: '🇩🇿', group: 'J' },
    { id: 'aut', name: '奥地利', flag: '🇦🇹', group: 'J' },
    { id: 'jor', name: '约旦', flag: '🇯🇴', group: 'J' },
  ],
  K: [
    { id: 'por', name: '葡萄牙', flag: '🇵🇹', group: 'K' },
    { id: 'cod', name: '刚果(金)', flag: '🇨🇩', group: 'K' },
    { id: 'uzb', name: '乌兹别克斯坦', flag: '🇺🇿', group: 'K' },
    { id: 'col', name: '哥伦比亚', flag: '🇨🇴', group: 'K' },
  ],
  L: [
    { id: 'eng', name: '英格兰', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
    { id: 'cro', name: '克罗地亚', flag: '🇭🇷', group: 'L' },
    { id: 'gha', name: '加纳', flag: '🇬🇭', group: 'L' },
    { id: 'pan', name: '巴拿马', flag: '🇵🇦', group: 'L' },
  ],
}

export const GROUP_NAMES = Object.keys(GROUPS)

// All teams flat
export const ALL_TEAMS: Team[] = Object.values(GROUPS).flat()

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id)
}

// FIFA official R32 bracket template
// Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage
// posInHalf determines horizontal order within each row (0=leftmost, 7=rightmost)
export const R32_TEMPLATE: R32MatchTemplate[] = [
  // Upper half (matches 73-80) — ordered by posInHalf for horizontal layout
  { id: 73, half: 'upper', posInHalf: 0, slot1: { type: 'runner', group: 'A' }, slot2: { type: 'runner', group: 'B' } },
  { id: 76, half: 'upper', posInHalf: 1, slot1: { type: 'winner', group: 'C' }, slot2: { type: 'runner', group: 'F' } },
  { id: 74, half: 'upper', posInHalf: 2, slot1: { type: 'winner', group: 'E' }, slot2: { type: 'third', group: 'A/B/C/D/F' } },
  { id: 75, half: 'upper', posInHalf: 3, slot1: { type: 'winner', group: 'F' }, slot2: { type: 'runner', group: 'C' } },
  { id: 78, half: 'upper', posInHalf: 4, slot1: { type: 'runner', group: 'E' }, slot2: { type: 'runner', group: 'I' } },
  { id: 77, half: 'upper', posInHalf: 5, slot1: { type: 'winner', group: 'I' }, slot2: { type: 'third', group: 'C/D/F/G/H' } },
  { id: 79, half: 'upper', posInHalf: 6, slot1: { type: 'winner', group: 'A' }, slot2: { type: 'third', group: 'C/E/F/H/I' } },
  { id: 80, half: 'upper', posInHalf: 7, slot1: { type: 'winner', group: 'L' }, slot2: { type: 'third', group: 'E/H/I/J/K' } },
  // Lower half (matches 81-88)
  { id: 81, half: 'lower', posInHalf: 0, slot1: { type: 'winner', group: 'D' }, slot2: { type: 'third', group: 'B/E/F/I/J' } },
  { id: 82, half: 'lower', posInHalf: 1, slot1: { type: 'winner', group: 'G' }, slot2: { type: 'third', group: 'A/E/H/I/J' } },
  { id: 83, half: 'lower', posInHalf: 2, slot1: { type: 'runner', group: 'K' }, slot2: { type: 'runner', group: 'L' } },
  { id: 84, half: 'lower', posInHalf: 3, slot1: { type: 'winner', group: 'H' }, slot2: { type: 'runner', group: 'J' } },
  { id: 85, half: 'lower', posInHalf: 4, slot1: { type: 'winner', group: 'B' }, slot2: { type: 'third', group: 'E/F/G/I/J' } },
  { id: 86, half: 'lower', posInHalf: 5, slot1: { type: 'winner', group: 'J' }, slot2: { type: 'runner', group: 'H' } },
  { id: 87, half: 'lower', posInHalf: 6, slot1: { type: 'winner', group: 'K' }, slot2: { type: 'third', group: 'D/E/I/J/L' } },
  { id: 88, half: 'lower', posInHalf: 7, slot1: { type: 'runner', group: 'D' }, slot2: { type: 'runner', group: 'G' } },
]

// R16 pairings: which two R32 winners feed into each R16 match
// [r16MatchId, [r32MatchId1, r32MatchId2]]
export const R16_PAIRINGS: [number, [number, number]][] = [
  [89, [74, 77]],
  [90, [73, 75]],
  [91, [76, 78]],
  [92, [79, 80]],
  [93, [83, 84]],
  [94, [81, 82]],
  [95, [86, 88]],
  [96, [85, 87]],
]

// QF pairings
export const QF_PAIRINGS: [number, [number, number]][] = [
  [97, [89, 90]],
  [98, [93, 94]],
  [99, [91, 92]],
  [100, [95, 96]],
]

// SF pairings
export const SF_PAIRINGS: [number, [number, number]][] = [
  [101, [97, 98]],
  [102, [99, 100]],
]

// Third place: losers of both SFs
// Final: winners of both SFs

// Third-place team slot resolution
// Given the 8 third-placed groups that advance, resolve which specific 3rd team goes to which match
// This uses a lookup based on FIFA Annex C combinations
// The third-place slot patterns in R32_TEMPLATE use group sets like "A/B/C/D/F"
// We need to pick the right group based on which 4 groups DID NOT advance their 3rd place team
export const THIRD_PLACE_SLOT_OPTIONS: Record<string, string[]> = {
  'A/B/C/D/F': ['A', 'B', 'C', 'D', 'F'],
  'C/D/F/G/H': ['C', 'D', 'F', 'G', 'H'],
  'C/E/F/H/I': ['C', 'E', 'F', 'H', 'I'],
  'E/H/I/J/K': ['E', 'H', 'I', 'J', 'K'],
  'B/E/F/I/J': ['B', 'E', 'F', 'I', 'J'],
  'A/E/H/I/J': ['A', 'E', 'H', 'I', 'J'],
  'E/F/G/I/J': ['E', 'F', 'G', 'I', 'J'],
  'D/E/I/J/L': ['D', 'E', 'I', 'J', 'L'],
}
```

- [ ] **Step 2: 提交**

```bash
git add . && git commit -m "feat: add tournament data with 48 teams and bracket template"
```

---

## Task 4: Reactive Store + Bracket 逻辑

**Files:**
- Create: `world-cup-predictor/src/utils/bracket.ts`
- Create: `world-cup-predictor/src/store/index.ts`

- [ ] **Step 1: 创建 bracket.ts — 对阵生成与级联逻辑**

核心函数：
1. `resolveThirdPlaceSlots` — 根据选出的 8 支第 3 名，用排除法确定每场 R32 的第三名对手来自哪个组
2. `generateR32` — 根据小组结果 + 最佳第3名 → 生成 R32 的 16 场对阵
3. `propagateWinners` — 用户选择晋级队后，自动填入下一轮

排除法原理：每个第三名位（如 `A/B/C/D/F`）有 5 个候选组。从 12 组中选出 8 支第 3 名，意味着有 4 组的第 3 名被淘汰。那 4 个被淘汰的组不可能是任何比赛中的第三名对手。所以 `A/B/C/D/F` 中的 5 个候选，去掉 4 个被淘汰组（如果 5 个中有被淘汰的），剩余的就是该场比赛的第三名来源。

```ts
import type { Team } from '../data/tournament'
import { R32_TEMPLATE, R16_PAIRINGS, QF_PAIRINGS, SF_PAIRINGS, THIRD_PLACE_SLOT_OPTIONS } from '../data/tournament'

export interface Match {
  id: number
  team1: Team | null
  team2: Team | null
  winner: Team | null
}

export interface KnockoutRound {
  r32: Match[]
  r16: Match[]
  qf: Match[]
  sf: Match[]
  final: Match
  thirdPlace: Match
}

function emptyMatch(id: number): Match {
  return { id, team1: null, team2: null, winner: null }
}

// Resolve which 3rd-place group fills each "3rd Group X/Y/Z" slot
// Logic: from the slot's candidate groups, exclude the 4 groups whose 3rd was eliminated
export function resolveThirdPlaceSlots(
  bestThirdGroups: string[], // 8 groups whose 3rd place advanced
): Record<number, string> {
  const eliminated = 'ABCDEFGHIJKL'.split('').filter(g => !bestThirdGroups.includes(g))
  const result: Record<number, string> = {}

  for (const tmpl of R32_TEMPLATE) {
    if (tmpl.slot1.type === 'third') {
      const candidates = THIRD_PLACE_SLOT_OPTIONS[tmpl.slot1.group] || []
      const resolved = candidates.find(c => !eliminated.includes(c))
      if (resolved) result[tmpl.id] = resolved
    }
    if (tmpl.slot2.type === 'third') {
      const candidates = THIRD_PLACE_SLOT_OPTIONS[tmpl.slot2.group] || []
      const resolved = candidates.find(c => !eliminated.includes(c))
      if (resolved) result[tmpl.id] = resolved
    }
  }
  return result
}

// Generate R32 matches from group results + best thirds
export function generateR32(
  groupWinners: Record<string, Team>,
  groupRunners: Record<string, Team>,
  groupThirds: Record<string, Team>,
  bestThirdGroups: string[],
): Match[] {
  const resolved = resolveThirdPlaceSlots(bestThirdGroups)

  return R32_TEMPLATE.map(tmpl => {
    const match = emptyMatch(tmpl.id)
    match.team1 = resolveSlot(tmpl.slot1, groupWinners, groupRunners, groupThirds, resolved, tmpl.id, true)
    match.team2 = resolveSlot(tmpl.slot2, groupWinners, groupRunners, groupThirds, resolved, tmpl.id, false)
    return match
  }).sort((a, b) => a.id - b.id)
}

function resolveSlot(
  slot: { type: string; group: string },
  winners: Record<string, Team>,
  runners: Record<string, Team>,
  thirds: Record<string, Team>,
  resolvedThirds: Record<number, string>,
  matchId: number,
  isFirst: boolean,
): Team | null {
  if (slot.type === 'winner') return winners[slot.group] || null
  if (slot.type === 'runner') return runners[slot.group] || null
  if (slot.type === 'third') {
    // For third-place slots, check if this match has a resolved group
    const resolvedGroup = resolvedThirds[matchId]
    if (resolvedGroup) return thirds[resolvedGroup] || null
    return null
  }
  return null
}

// Propagate: fill next round's match slots based on previous round's winners
export function propagateToNextRound(
  prevRound: Match[],
  pairings: [number, [number, number]][],
  existingNextRound: Match[],
): Match[] {
  return pairings.map(([nextId, [from1, from2]]) => {
    const existing = existingNextRound.find(m => m.id === nextId)
    const m1 = prevRound.find(m => m.id === from1)
    const m2 = prevRound.find(m => m.id === from2)
    const team1 = m1?.winner || null
    const team2 = m2?.winner || null

    // If teams haven't changed, keep existing winner
    const teamChanged = existing?.team1?.id !== team1?.id || existing?.team2?.id !== team2?.id
    return {
      id: nextId,
      team1,
      team2,
      winner: teamChanged ? null : (existing?.winner || null),
    }
  })
}

// Create empty knockout rounds
export function createEmptyKnockout(): KnockoutRound {
  return {
    r32: R32_TEMPLATE.map(t => emptyMatch(t.id)),
    r16: R16_PAIRINGS.map(([id]) => emptyMatch(id)),
    qf: QF_PAIRINGS.map(([id]) => emptyMatch(id)),
    sf: SF_PAIRINGS.map(([id]) => emptyMatch(id)),
    final: emptyMatch(104),
    thirdPlace: emptyMatch(103),
  }
}
```

- [ ] **Step 2: 创建 store/index.ts — 全局 reactive store**

```ts
import { reactive, watch } from 'vue'
import type { Team } from '../data/tournament'
import { GROUPS, GROUP_NAMES } from '../data/tournament'
import { generateR32, propagateToNextRound, createEmptyKnockout, type KnockoutRound, type Match } from '../utils/bracket'

export interface GroupPrediction {
  teams: Team[]
  first: Team | null
  second: Team | null
}

export interface Store {
  groups: Record<string, GroupPrediction>
  bestThirds: string[]        // group letters of 8 best 3rd place teams
  knockout: KnockoutRound
  champion: Team | null
  activeTab: 'group' | 'knockout'
}

function createInitialGroups(): Record<string, GroupPrediction> {
  const result: Record<string, GroupPrediction> = {}
  for (const name of GROUP_NAMES) {
    result[name] = { teams: [...GROUPS[name]], first: null, second: null }
  }
  return result
}

export const store = reactive<Store>({
  groups: createInitialGroups(),
  bestThirds: [],
  knockout: createEmptyKnockout(),
  champion: null,
  activeTab: 'group',
})

// Toggle team selection in a group
export function toggleGroupTeam(groupName: string, team: Team) {
  const g = store.groups[groupName]
  if (!g) return

  if (g.first?.id === team.id) {
    g.first = null
    // promote second to first if exists
    if (g.second) { g.first = g.second; g.second = null }
  } else if (g.second?.id === team.id) {
    g.second = null
  } else if (!g.first) {
    g.first = team
  } else if (!g.second) {
    g.second = team
  }
  // If already 2 selected, do nothing (user must deselect first)
  afterGroupChange()
}

export function toggleBestThird(groupLetter: string) {
  const idx = store.bestThirds.indexOf(groupLetter)
  if (idx >= 0) {
    store.bestThirds.splice(idx, 1)
  } else if (store.bestThirds.length < 8) {
    store.bestThirds.push(groupLetter)
  }
  afterGroupChange()
}

// Recalculate knockout bracket after group stage changes
function afterGroupChange() {
  // Check if all groups have selections and 8 best thirds chosen
  const allGroupsDone = GROUP_NAMES.every(g => store.groups[g].first && store.groups[g].second)
  const thirdsDone = store.bestThirds.length === 8

  if (!allGroupsDone || !thirdsDone) {
    // Clear knockout
    store.knockout = createEmptyKnockout()
    store.champion = null
    return
  }

  // Build lookup maps
  const winners: Record<string, Team> = {}
  const runners: Record<string, Team> = {}
  const thirds: Record<string, Team> = {}
  for (const name of GROUP_NAMES) {
    const g = store.groups[name]
    winners[name] = g.first!
    runners[name] = g.second!
    const thirdTeam = g.teams.find(t => t.id !== g.first?.id && t.id !== g.second?.id)
    if (thirdTeam) thirds[name] = thirdTeam
  }

  // Generate R32
  const r32 = generateR32(winners, runners, thirds, store.bestThirds)
  // Keep existing R32 winners where team pairings match
  store.knockout.r32 = r32.map((m, i) => {
    const old = store.knockout.r32[i]
    if (old && old.team1?.id === m.team1?.id && old.team2?.id === m.team2?.id) {
      return { ...m, winner: old.winner }
    }
    return m
  })

  // Propagate R32 → R16 → QF → SF → Final
  recascadeFromR32()
}

function recascadeFromR32() {
  store.knockout.r16 = propagateToNextRound(store.knockout.r32, R16_PAIRINGS_IMPORT, store.knockout.r16)
  store.knockout.qf = propagateToNextRound(store.knockout.r16, QF_PAIRINGS_IMPORT, store.knockout.qf)
  store.knockout.sf = propagateToNextRound(store.knockout.qf, SF_PAIRINGS_IMPORT, store.knockout.sf)

  // SF → Final + Third Place
  const sf1 = store.knockout.sf.find(m => m.id === 101)
  const sf2 = store.knockout.sf.find(m => m.id === 102)
  const oldFinal = store.knockout.final
  const oldThird = store.knockout.thirdPlace

  const fTeam1 = sf1?.winner || null
  const fTeam2 = sf2?.winner || null
  const fChanged = oldFinal.team1?.id !== fTeam1?.id || oldFinal.team2?.id !== fTeam2?.id
  store.knockout.final = { id: 104, team1: fTeam1, team2: fTeam2, winner: fChanged ? null : oldFinal.winner }

  const tTeam1 = sf1?.winner ? (sf1.team1?.id === sf1.winner.id ? sf1.team2 : sf1.team1) : null
  const tTeam2 = sf2?.winner ? (sf2.team1?.id === sf2.winner.id ? sf2.team2 : sf2.team1) : null
  const tChanged = oldThirdPlace.team1?.id !== tTeam1?.id || oldThirdPlace.team2?.id !== tTeam2?.id
  store.knockout.thirdPlace = { id: 103, team1: tTeam1, team2: tTeam2, winner: tChanged ? null : oldThirdPlace.winner }

  // Champion
  store.champion = store.knockout.final.winner
}

// Set winner for a knockout match, then recascade
export function setMatchWinner(round: 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'thirdPlace', matchId: number, team: Team | null) {
  const match = round === 'final' ? store.knockout.final
    : round === 'thirdPlace' ? store.knockout.thirdPlace
    : store.knockout[round].find((m: Match) => m.id === matchId)
  if (!match) return

  // Toggle: clicking same team deselects
  match.winner = match.winner?.id === team?.id ? null : team

  // Cascade forward
  if (round === 'r32') {
    store.knockout.r16 = propagateToNextRound(store.knockout.r32, R16_PAIRINGS_IMPORT, store.knockout.r16)
  }
  if (round === 'r32' || round === 'r16') {
    store.knockout.qf = propagateToNextRound(store.knockout.r16, QF_PAIRINGS_IMPORT, store.knockout.qf)
  }
  if (round === 'r32' || round === 'r16' || round === 'qf') {
    store.knockout.sf = propagateToNextRound(store.knockout.qf, SF_PAIRINGS_IMPORT, store.knockout.sf)
  }
  // Always update final + thirdPlace
  const sf1 = store.knockout.sf.find(m => m.id === 101)
  const sf2 = store.knockout.sf.find(m => m.id === 102)
  const oldFinal = store.knockout.final
  const fTeam1 = sf1?.winner || null
  const fTeam2 = sf2?.winner || null
  const fChanged = oldFinal.team1?.id !== fTeam1?.id || oldFinal.team2?.id !== fTeam2?.id
  store.knockout.final = { id: 104, team1: fTeam1, team2: fTeam2, winner: fChanged ? null : oldFinal.winner }

  const tTeam1 = sf1?.winner ? (sf1.team1?.id === sf1.winner.id ? sf1.team2 : sf1.team1) : null
  const tTeam2 = sf2?.winner ? (sf2.team1?.id === sf2.winner.id ? sf2.team2 : sf2.team1) : null
  const oldThird = store.knockout.thirdPlace
  const tChanged = oldThird.team1?.id !== tTeam1?.id || oldThird.team2?.id !== tTeam2?.id
  store.knockout.thirdPlace = { id: 103, team1: tTeam1, team2: tTeam2, winner: tChanged ? null : oldThird.winner }

  store.champion = store.knockout.final.winner
}

// NOTE: These imports are needed for the pairings
import { R16_PAIRINGS as R16_PAIRINGS_IMPORT, QF_PAIRINGS as QF_PAIRINGS_IMPORT, SF_PAIRINGS as SF_PAIRINGS_IMPORT } from '../data/tournament'
```

> ⚠️ **重要修复**: 上面 store/index.ts 中引用了 `oldThirdPlace` 变量名但实际应为 `oldThird`。实现时需统一。另外 import 语句需要移到文件顶部。

- [ ] **Step 3: 提交**

```bash
git add . && git commit -m "feat: add reactive store with bracket generation and cascade logic"
```

---

## Task 5: Vite 持久化插件

**Files:**
- Create: `world-cup-predictor/vite-plugins/persistence.ts`

- [ ] **Step 1: 创建 Vite 中间件**

```ts
import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.resolve(__dirname, '../data/prediction.json')

export function persistencePlugin(): Plugin {
  return {
    name: 'prediction-persistence',
    configureServer(server) {
      server.middlewares.use('/api/prediction', async (req, res) => {
        // GET: read prediction data
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8')
            res.end(data)
          } catch {
            res.end('{}')
          }
          return
        }

        // PUT: save prediction data
        if (req.method === 'PUT') {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const body = Buffer.concat(chunks).toString()

          try {
            // Validate it's valid JSON
            JSON.parse(body)
            const dir = path.dirname(DATA_FILE)
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
            }
            fs.writeFileSync(DATA_FILE, body, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end('{"ok":true}')
          } catch {
            res.statusCode = 400
            res.end('{"error":"invalid json"}')
          }
          return
        }

        res.statusCode = 405
        res.end('{"error":"method not allowed"}')
      })
    },
  }
}
```

- [ ] **Step 2: 创建 src/utils/persistence.ts — 前端 API 封装**

```ts
let saveTimer: ReturnType<typeof setTimeout> | null = null

export async function loadPrediction(): Promise<any> {
  try {
    const res = await fetch('/api/prediction')
    if (!res.ok) return null
    const data = await res.json()
    return Object.keys(data).length > 0 ? data : null
  } catch {
    return null
  }
}

export function savePrediction(data: any, immediate = false) {
  const doSave = () => {
    fetch('/api/prediction', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})
  }

  if (immediate) {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
    doSave()
  } else {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(doSave, 500)
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add . && git commit -m "feat: add Vite persistence plugin and API client"
```

---

## Task 6: 小组赛组件

**Files:**
- Create: `world-cup-predictor/src/components/GroupCard.vue`
- Create: `world-cup-predictor/src/components/BestThirdPicker.vue`
- Create: `world-cup-predictor/src/components/GroupStage.vue`

- [ ] **Step 1: 创建 GroupCard.vue**

显示 4 支球队，点击选前 2 名。已选球队蓝色高亮 + 标注 1st/2nd，未选球队淡化划线。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Team } from '../data/tournament'
import { store, toggleGroupTeam } from '../store'

const props = defineProps<{ groupName: string }>()

const group = computed(() => store.groups[props.groupName])
const isComplete = computed(() => group.value.first && group.value.second)

function isSelected(team: Team): boolean {
  return group.value.first?.id === team.id || group.value.second?.id === team.id
}

function getPosition(team: Team): string {
  if (group.value.first?.id === team.id) return '1st'
  if (group.value.second?.id === team.id) return '2nd'
  return ''
}
</script>

<template>
  <div class="group-card" :class="{ complete: isComplete }">
    <div class="group-header">
      <span class="group-name">{{ groupName }} 组</span>
      <span class="group-status">{{ isComplete ? '✓' : `${group.first ? 1 : 0}/2` }}</span>
    </div>
    <div class="group-teams">
      <div
        v-for="team in group.teams"
        :key="team.id"
        class="team-row"
        :class="{ selected: isSelected(team), eliminated: isComplete && !isSelected(team) }"
        @click="toggleGroupTeam(groupName, team)"
      >
        <span class="team-flag">{{ team.flag }}</span>
        <span class="team-name">{{ team.name }}</span>
        <span v-if="getPosition(team)" class="team-pos">{{ getPosition(team) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 12px;
  transition: border-color var(--transition-fast);
}
.group-card.complete {
  border-color: var(--accent);
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.group-name {
  font-weight: 700;
  font-size: 13px;
  color: var(--accent);
}
.group-status {
  font-size: 11px;
  color: var(--text-secondary);
}
.group-card.complete .group-status {
  color: var(--accent);
}
.team-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.team-row:hover { background: var(--bg-highlight); }
.team-row.selected {
  background: var(--accent-glow);
  border-color: var(--accent);
}
.team-row.eliminated {
  opacity: 0.35;
}
.team-row.eliminated .team-name {
  text-decoration: line-through;
  color: var(--text-muted);
}
.team-flag { font-size: 16px; }
.team-name { font-size: 13px; color: var(--text-primary); flex: 1; }
.team-row.selected .team-name { color: var(--accent); font-weight: 600; }
.team-pos { font-size: 10px; color: var(--accent); font-weight: 700; }
</style>
```

- [ ] **Step 2: 创建 BestThirdPicker.vue**

从 12 支第 3 名中选 8 支。需先计算各组的第 3 名（未被选为 1st/2nd 的队）。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { store, toggleBestThird } from '../store'
import { GROUP_NAMES } from '../data/tournament'

const thirdTeams = computed(() => {
  return GROUP_NAMES.map(g => {
    const group = store.groups[g]
    const third = group.teams.find(
      t => t.id !== group.first?.id && t.id !== group.second?.id
    )
    return { group: g, team: third || null }
  }).filter(item => item.team)
})

const allGroupsSelected = computed(() =>
  GROUP_NAMES.every(g => store.groups[g].first && store.groups[g].second)
)
</script>

<template>
  <div class="best-third-picker">
    <h3 class="section-title">⭐ 选择 8 支最佳第三名 <span class="count">{{ store.bestThirds.length }}/8</span></h3>
    <p v-if="!allGroupsSelected" class="hint">请先完成所有小组的出线选择</p>
    <div v-else class="third-grid">
      <div
        v-for="item in thirdTeams"
        :key="item.group"
        class="third-chip"
        :class="{ selected: store.bestThirds.includes(item.group), disabled: !store.bestThirds.includes(item.group) && store.bestThirds.length >= 8 }"
        @click="toggleBestThird(item.group)"
      >
        <span class="chip-flag">{{ item.team?.flag }}</span>
        <span class="chip-name">{{ item.team?.name }}</span>
        <span class="chip-group">{{ item.group }}组第3</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.best-third-picker {
  margin-top: 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px;
  border: 1px solid var(--border-subtle);
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.count { color: var(--accent); }
.hint { color: var(--text-muted); font-size: 13px; }
.third-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.third-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-highlight);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.third-chip:hover:not(.disabled) { border-color: var(--border-default); }
.third-chip.selected {
  background: var(--accent-glow);
  border-color: var(--accent);
}
.third-chip.disabled { opacity: 0.35; cursor: not-allowed; }
.chip-flag { font-size: 14px; }
.chip-name { font-size: 12px; color: var(--text-primary); }
.third-chip.selected .chip-name { color: var(--accent); font-weight: 600; }
.chip-group { font-size: 10px; color: var(--text-muted); }
</style>
```

- [ ] **Step 3: 创建 GroupStage.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { store } from '../store'
import { GROUP_NAMES } from '../data/tournament'
import GroupCard from './GroupCard.vue'
import BestThirdPicker from './BestThirdPicker.vue'

const completedCount = computed(() =>
  GROUP_NAMES.filter(g => store.groups[g].first && store.groups[g].second).length
)
</script>

<template>
  <div class="group-stage">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(completedCount / 12) * 100}%` }"></div>
      <span class="progress-text">小组赛 {{ completedCount }}/12 已完成</span>
    </div>
    <div class="group-grid">
      <GroupCard v-for="g in GROUP_NAMES" :key="g" :group-name="g" />
    </div>
    <BestThirdPicker />
  </div>
</template>

<style scoped>
.progress-bar {
  background: var(--bg-card);
  border-radius: 999px;
  height: 24px;
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-subtle);
}
.progress-fill {
  background: var(--accent);
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 999px;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 4: 提交**

```bash
git add . && git commit -m "feat: add group stage components with progress bar and best-third picker"
```

---

## Task 7: 淘汰赛组件

**Files:**
- Create: `world-cup-predictor/src/components/MatchUp.vue`
- Create: `world-cup-predictor/src/components/BracketRow.vue`
- Create: `world-cup-predictor/src/components/FinalMatch.vue`
- Create: `world-cup-predictor/src/components/KnockoutStage.vue`

这是最复杂的部分——横向收拢式对阵图。

- [ ] **Step 1: 创建 MatchUp.vue — 单场对决卡片**

```vue
<script setup lang="ts">
import type { Team } from '../data/tournament'

const props = defineProps<{
  team1: Team | null
  team2: Team | null
  winner: Team | null
  label?: string
  gold?: boolean
}>()

const emit = defineEmits<{ select: [team: Team | null] }>()

function handleClick(team: Team | null) {
  if (!team) return
  emit('select', team)
}
</script>

<template>
  <div class="matchup" :class="{ gold, decided: winner }">
    <div v-if="label" class="match-label">{{ label }}</div>
    <div
      class="match-team"
      :class="{ winner: winner?.id === team1?.id, lost: winner && winner?.id !== team1?.id && team1 }"
      @click="handleClick(team1)"
    >
      <span class="team-flag">{{ team1?.flag || '' }}</span>
      <span class="team-name">{{ team1?.name || '待定' }}</span>
      <span v-if="winner?.id === team1?.id" class="check">✓</span>
    </div>
    <div
      class="match-team"
      :class="{ winner: winner?.id === team2?.id, lost: winner && winner?.id !== team2?.id && team2 }"
      @click="handleClick(team2)"
    >
      <span class="team-flag">{{ team2?.flag || '' }}</span>
      <span class="team-name">{{ team2?.name || '待定' }}</span>
      <span v-if="winner?.id === team2?.id" class="check">✓</span>
    </div>
  </div>
</template>

<style scoped>
.matchup {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  min-width: 100px;
  transition: border-color var(--transition-fast);
}
.matchup.gold {
  background: var(--gold-gradient);
  border-color: var(--gold);
  padding: 0;
}
.match-label {
  font-size: 9px;
  color: var(--text-muted);
  text-align: center;
  padding: 2px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.matchup.gold .match-label {
  color: #111;
  border-bottom-color: rgba(0,0,0,0.2);
}
.match-team {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 11px;
  border-bottom: 1px solid var(--border-subtle);
}
.match-team:last-child { border-bottom: none; }
.match-team:hover { background: var(--bg-highlight); }
.match-team.winner {
  background: var(--accent-glow);
}
.matchup.gold .match-team.winner {
  background: rgba(255,255,255,0.3);
}
.match-team.lost { opacity: 0.3; }
.match-team.lost .team-name { text-decoration: line-through; }
.team-flag { font-size: 12px; }
.team-name { flex: 1; color: var(--text-primary); }
.match-team.winner .team-name { color: var(--accent); font-weight: 600; }
.matchup.gold .match-team .team-name { color: #111; }
.matchup.gold .match-team.winner .team-name { color: #111; font-weight: 700; }
.check { color: var(--accent); font-size: 10px; }
.matchup.gold .check { color: #111; }
</style>
```

- [ ] **Step 2: 创建 BracketRow.vue — 单轮横排**

显示该轮所有比赛，居中排列。上半区和下半区各一排。

```vue
<script setup lang="ts">
import type { Match } from '../utils/bracket'
import MatchUp from './MatchUp.vue'

const props = defineProps<{
  matches: Match[]
  roundLabel: string
  roundKey: string
}>()

const emit = defineEmits<{ select: [matchId: number, team: any] }>()
</script>

<template>
  <div class="bracket-row">
    <div class="round-label">{{ roundLabel }}</div>
    <div class="matches-row">
      <div v-for="match in matches" :key="match.id" class="match-wrapper">
        <MatchUp
          :team1="match.team1"
          :team2="match.team2"
          :winner="match.winner"
          @select="(team) => emit('select', match.id, team)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bracket-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}
.round-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  font-weight: 600;
}
.matches-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
}
.match-wrapper {
  flex-shrink: 0;
}
</style>
```

- [ ] **Step 3: 创建 FinalMatch.vue — 决赛 + 三四名**

```vue
<script setup lang="ts">
import { store, setMatchWinner } from '../store'
import MatchUp from './MatchUp.vue'
</script>

<template>
  <div class="final-section">
    <div class="final-matches">
      <div class="final-match">
        <MatchUp
          :team1="store.knockout.thirdPlace.team1"
          :team2="store.knockout.thirdPlace.team2"
          :winner="store.knockout.thirdPlace.winner"
          label="🥉 三四名决赛"
          @select="(team) => setMatchWinner('thirdPlace', 103, team)"
        />
      </div>
      <div class="final-match gold">
        <MatchUp
          :team1="store.knockout.final.team1"
          :team2="store.knockout.final.team2"
          :winner="store.knockout.final.winner"
          label="🏅 决赛"
          :gold="true"
          @select="(team) => setMatchWinner('final', 104, team)"
        />
      </div>
    </div>
    <div v-if="store.champion" class="champion-banner">
      🏆 {{ store.champion.flag }} {{ store.champion.name }} 🏆
    </div>
  </div>
</template>

<style scoped>
.final-section {
  border-top: 2px solid var(--gold);
  border-bottom: 2px solid var(--gold);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.final-matches {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.final-match { min-width: 140px; }
.champion-banner {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
  text-align: center;
  padding: 8px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 2px solid var(--gold);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
```

- [ ] **Step 4: 创建 KnockoutStage.vue — 完整对阵图页面**

按横向收拢式布局排列：上半区 R32→R16→QF→SF → 决赛 → 下半区 SF→QF→R16→R32。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { store, setMatchWinner } from '../store'
import { R32_TEMPLATE, R16_PAIRINGS, QF_PAIRINGS, SF_PAIRINGS } from '../data/tournament'
import BracketRow from './BracketRow.vue'
import FinalMatch from './FinalMatch.vue'

// Split matches by half
const upperR32 = computed(() =>
  R32_TEMPLATE.filter(t => t.half === 'upper')
    .sort((a, b) => a.posInHalf - b.posInHalf)
    .map(t => store.knockout.r32.find(m => m.id === t.id)!)
    .filter(Boolean)
)
const lowerR32 = computed(() =>
  R32_TEMPLATE.filter(t => t.half === 'lower')
    .sort((a, b) => a.posInHalf - b.posInHalf)
    .map(t => store.knockout.r32.find(m => m.id === t.id)!)
    .filter(Boolean)
)

// R16: split into upper half (matches from upper R32) and lower half
const upperR32Ids = new Set(R32_TEMPLATE.filter(t => t.half === 'upper').map(t => t.id))
const upperR16Pairings = R16_PAIRINGS.filter(([, [a, b]]) => upperR32Ids.has(a))
const lowerR16Pairings = R16_PAIRINGS.filter(([, [a, b]]) => !upperR32Ids.has(a))

const upperR16 = computed(() =>
  upperR16Pairings.map(([id]) => store.knockout.r16.find(m => m.id === id)!)
    .filter(Boolean)
)
const lowerR16 = computed(() =>
  lowerR16Pairings.map(([id]) => store.knockout.r16.find(m => m.id === id)!)
    .filter(Boolean)
)

// QF: first 2 are upper, last 2 are lower (based on SF pairings)
const upperQF = computed(() => store.knockout.qf.filter(m => m.id <= 98))
const lowerQF = computed(() => store.knockout.qf.filter(m => m.id >= 99))

// SF
const upperSF = computed(() => store.knockout.sf.filter(m => m.id === 101))
const lowerSF = computed(() => store.knockout.sf.filter(m => m.id === 102))

function onMatchSelect(roundKey: string, matchId: number, team: any) {
  setMatchWinner(roundKey as any, matchId, team)
}
</script>

<template>
  <div class="knockout-stage">
    <div class="half-label">⬆ 上半区</div>

    <BracketRow
      :matches="upperR32" round-label="32强" round-key="r32"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />
    <BracketRow
      :matches="upperR16" round-label="16强" round-key="r16"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <BracketRow
      :matches="upperQF" round-label="¼决赛" round-key="qf"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <BracketRow
      :matches="upperSF" round-label="半决赛" round-key="sf"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />

    <FinalMatch />

    <BracketRow
      :matches="lowerSF" round-label="半决赛" round-key="sf"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />
    <BracketRow
      :matches="lowerQF" round-label="¼决赛" round-key="qf"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <BracketRow
      :matches="lowerR16" round-label="16强" round-key="r16"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <BracketRow
      :matches="lowerR32" round-label="32强" round-key="r32"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />

    <div class="half-label">⬇ 下半区</div>
  </div>
</template>

<style scoped>
.knockout-stage {
  overflow-x: auto;
  padding: 8px 0;
}
.half-label {
  text-align: center;
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
  padding: 6px 0;
}
</style>
```

- [ ] **Step 5: 提交**

```bash
git add . && git commit -m "feat: add knockout bracket components with horizontal converging layout"
```

---

## Task 8: 组装 App.vue + 自动持久化

**Files:**
- Modify: `world-cup-predictor/src/App.vue`

- [ ] **Step 1: 更新 App.vue**

集成所有组件，加载时恢复状态，修改时自动保存。

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { store } from './store'
import { loadPrediction, savePrediction } from './utils/persistence'
import GroupStage from './components/GroupStage.vue'
import KnockoutStage from './components/KnockoutStage.vue'

onMounted(async () => {
  const saved = await loadPrediction()
  if (saved) {
    // Restore groups
    if (saved.groups) {
      for (const name of Object.keys(saved.groups)) {
        if (store.groups[name]) {
          store.groups[name].first = saved.groups[name].first
          store.groups[name].second = saved.groups[name].second
        }
      }
    }
    if (saved.bestThirds) store.bestThirds = saved.bestThirds
    if (saved.knockout) {
      store.knockout = saved.knockout
    }
    if (saved.champion) store.champion = saved.champion
  }
})

// Auto-save on any store change (debounced)
watch(
  () => JSON.stringify({ groups: store.groups, bestThirds: store.bestThirds, knockout: store.knockout, champion: store.champion }),
  () => {
    savePrediction({
      groups: Object.fromEntries(
        Object.entries(store.groups).map(([k, v]) => [k, { first: v.first, second: v.second }])
      ),
      bestThirds: store.bestThirds,
      knockout: store.knockout,
      champion: store.champion,
    })
  },
  { deep: false }
)
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <h1 class="app-title">⚽ 2026 World Cup Predictor</h1>
      <div class="header-actions">
        <button class="btn-outline" @click="() => { /* reset logic */ }">重置预测</button>
      </div>
    </header>
    <nav class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: store.activeTab === 'group' }"
        @click="store.activeTab = 'group'"
      >小组赛</button>
      <button
        class="tab-btn"
        :class="{ active: store.activeTab === 'knockout' }"
        @click="store.activeTab = 'knockout'"
      >淘汰赛</button>
    </nav>
    <main class="app-main">
      <GroupStage v-if="store.activeTab === 'group'" />
      <KnockoutStage v-else />
    </main>
  </div>
</template>
```

- [ ] **Step 2: 验证完整功能**

```bash
npm run dev
```

测试：
1. 小组赛页面：12 组选前 2 名 ✓
2. 最佳第 3 名选 8 支 ✓
3. 切换到淘汰赛：R32 对阵自动生成 ✓
4. 逐轮选晋级队 ✓
5. 冠军显示 ✓
6. 刷新页面，数据恢复 ✓

- [ ] **Step 3: 提交**

```bash
git add . && git commit -m "feat: integrate all components with auto-persistence"
```

---

## Task 9: SVG 连线 + 视觉润色

**Files:**
- Modify: `world-cup-predictor/src/components/KnockoutStage.vue`
- Modify: `world-cup-predictor/src/components/BracketRow.vue`

- [ ] **Step 1: 在 BracketRow 之间添加 SVG 连线**

在 KnockoutStage.vue 中，相邻两轮之间用 SVG 绘制连接线（经典 bracket 线条）。使用绝对定位的 SVG 层覆盖在比赛卡片之上（`pointer-events: none`）。

每个 BracketRow 需要暴露其 match 卡片的 DOM 位置，然后 SVG 画线连接上一轮的相邻两场比赛到下一轮的一场。

实现方式：使用 `ref` 获取行容器和各 match 元素的位置，在 `onMounted` + `onUpdated` 时计算连线坐标。

- [ ] **Step 2: 添加过渡动画**

- 选队时 0.15s ease 高亮
- 级联清空时淡出效果（`opacity` transition）
- Tab 切换时滑动过渡（CSS transition）

- [ ] **Step 3: 响应式调整**

- 淘汰赛页面：overflow-x: auto 支持横向滚动
- R32 8 场排开时确保在小屏可滚动查看
- 决赛区域始终居中

- [ ] **Step 4: 提交**

```bash
git add . && git commit -m "feat: add SVG connector lines and visual polish"
```

---

## Task 10: Bug 修复 + 最终验证

- [ ] **Step 1: 验证所有成功标准**

对照设计文档 Section 10 的 checklist：
- [ ] 小组赛页面能正确展示 12 组，用户可选前 2 名
- [ ] 最佳第3名选择面板正确展示 12 支第3名，可选 8 支
- [ ] 淘汰赛对阵图按横向收拢式布局，上下+左右镜面对称
- [ ] SVG 连线正确连接各轮次
- [ ] 选择 R32 晋级队后自动填入 R16，逐轮递推
- [ ] 修改小组出线后级联清空受影响轮次
- [ ] 页面加载时自动从 JSON 恢复状态
- [ ] 每次修改后 500ms 防抖自动保存
- [ ] 色弱友好配色，明度区分层次清晰

- [ ] **Step 2: 修复发现的问题**

- [ ] **Step 3: 最终提交**

```bash
git add . && git commit -m "fix: final bug fixes and verification"
```
