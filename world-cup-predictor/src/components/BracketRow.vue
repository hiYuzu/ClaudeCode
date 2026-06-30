<script setup lang="ts">
import type { Team } from '../data/tournament'
import type { Match } from '../utils/bracket'
import MatchUp from './MatchUp.vue'

const props = defineProps<{
  matches: Match[]
  roundLabel: string
  roundKey: string
  matchCount?: number
}>()

const emit = defineEmits<{ select: [matchId: number, team: Team | null] }>()
</script>

<template>
  <div class="bracket-row">
    <div class="round-label">{{ roundLabel }}</div>
    <div class="matches-row">
      <div
        v-for="(match, index) in matches"
        :key="match.id"
        class="match-wrapper"
      >
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
  padding: 8px 0;
}
.round-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--bg-highlight);
  padding: 5px 14px;
  border-radius: 999px;
}
.matches-row {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: nowrap;
}
.match-wrapper {
  flex-shrink: 0;
  position: relative;
}

/* Responsive: smaller screens */
@media (max-width: 480px) {
  .matches-row {
    gap: 6px;
  }
  .round-label {
    font-size: 11px;
    padding: 3px 10px;
  }
}
</style>
