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
