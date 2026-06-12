<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { store } from './store'
import { loadPrediction, savePrediction } from './utils/persistence'
import { createEmptyKnockout } from './utils/bracket'
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
  }
)

function resetPrediction() {
  for (const name of Object.keys(store.groups)) {
    store.groups[name].first = null
    store.groups[name].second = null
  }
  store.bestThirds = []
  store.champion = null
  store.activeTab = 'group'
  store.knockout = createEmptyKnockout()
}
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <h1 class="app-title">⚽ 2026 World Cup Predictor</h1>
      <div class="header-actions">
        <button class="btn-outline" @click="resetPrediction">重置预测</button>
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

<style scoped>
.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 6px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-outline:hover {
  color: var(--text-primary);
  border-color: var(--accent);
}
</style>
