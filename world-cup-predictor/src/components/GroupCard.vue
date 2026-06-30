<script setup lang="ts">
import { computed } from 'vue'
import type { Team } from '../data/tournament'
import { store, toggleGroupTeam } from '../store'

const props = defineProps<{ groupName: string }>()

const group = computed(() => store.groups[props.groupName])
const isComplete = computed(() => group.value.first && group.value.second && group.value.third)

function isSelected(team: Team): boolean {
  return group.value.first?.id === team.id || 
         group.value.second?.id === team.id || 
         group.value.third?.id === team.id
}

function getPosition(team: Team): string {
  if (group.value.first?.id === team.id) return '1st'
  if (group.value.second?.id === team.id) return '2nd'
  if (group.value.third?.id === team.id) return '3rd'
  return ''
}
</script>

<template>
  <div class="group-card" :class="{ complete: isComplete }">
    <div class="group-header">
      <span class="group-name">{{ groupName }} 组</span>
      <span class="group-status">{{ isComplete ? '✓' : `${[group.first, group.second, group.third].filter(Boolean).length}/3` }}</span>
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
  padding: 16px;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  box-shadow: var(--shadow-sm);
}
.group-card:hover {
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}
.group-card.complete {
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
}
.group-name {
  font-weight: 800;
  font-size: 16px;
  color: var(--accent);
  letter-spacing: 0.5px;
}
.group-status {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  background: var(--bg-highlight);
  padding: 2px 8px;
  border-radius: 999px;
}
.group-card.complete .group-status {
  color: #fff;
  background: var(--accent);
}
.team-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-normal), border-color var(--transition-normal);
  border: 1px solid transparent;
  margin-bottom: 4px;
}
.team-row:hover { 
  background: var(--bg-highlight); 
}
.team-row.selected {
  background: var(--accent-glow);
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
}
.team-row.eliminated {
  opacity: 0.4;
}
.team-row.eliminated .team-name {
  text-decoration: line-through;
  color: var(--text-muted);
}
.team-flag { 
  font-size: 20px; 
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
}
.team-name { 
  font-size: 14px; 
  color: var(--text-primary); 
  flex: 1; 
  font-weight: 500;
}
.team-row.selected .team-name { 
  color: var(--accent); 
  font-weight: 700; 
}
.team-pos { 
  font-size: 11px; 
  color: var(--accent); 
  font-weight: 800;
  background: var(--accent-glow);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
