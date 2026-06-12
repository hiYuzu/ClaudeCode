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
