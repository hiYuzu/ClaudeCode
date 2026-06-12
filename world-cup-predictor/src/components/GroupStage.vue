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
