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
