<script setup lang="ts">
import { computed } from 'vue'
import { store, toggleBestThird } from '../store'
import { GROUP_NAMES } from '../data/tournament'

const thirdTeams = computed(() => {
  return GROUP_NAMES.map(g => {
    const group = store.groups[g]
    return { group: g, team: group.third || null }
  }).filter(item => item.team)
})

const allGroupsSelected = computed(() =>
  GROUP_NAMES.every(g => store.groups[g].first && store.groups[g].second && store.groups[g].third)
)
</script>

<template>
  <div class="best-third-picker">
    <h3 class="section-title">⭐ 选择 8 支最佳第三名 <span class="count">{{ store.bestThirds.length }}/8</span></h3>
    <p v-if="!allGroupsSelected" class="hint">请先完成所有小组的排名选择（前三名）</p>
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
  padding: 20px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.count { 
  color: var(--accent); 
  font-weight: 800;
  background: var(--accent-glow);
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 14px;
}
.hint { 
  color: var(--text-muted); 
  font-size: 13px;
  font-style: italic;
}
.third-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.third-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: var(--bg-highlight);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  box-shadow: var(--shadow-sm);
}
.third-chip:hover:not(.disabled) { 
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}
.third-chip.selected {
  background: var(--accent-glow);
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
}
.third-chip.disabled { 
  opacity: 0.4; 
  cursor: not-allowed;
  transform: none !important;
}
.chip-flag { 
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
.chip-name { 
  font-size: 13px; 
  color: var(--text-primary); 
  font-weight: 500;
}
.third-chip.selected .chip-name { 
  color: var(--accent); 
  font-weight: 700; 
}
.chip-group { 
  font-size: 11px; 
  color: var(--text-muted);
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
