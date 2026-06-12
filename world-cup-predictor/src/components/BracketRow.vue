<script setup lang="ts">
import type { Match } from '../utils/bracket'
import MatchUp from './MatchUp.vue'

const props = defineProps<{
  matches: Match[]
  roundLabel: string
  roundKey: string
  matchCount?: number
}>()

const emit = defineEmits<{ select: [matchId: number, team: any] }>()
</script>

<template>
  <div class="bracket-row">
    <div class="round-label">{{ roundLabel }}</div>
    <div class="matches-row">
      <div
        v-for="(match, index) in matches"
        :key="match.id"
        class="match-wrapper"
        :class="{
          'connector-top': index % 2 === 0,
          'connector-bottom': index % 2 === 1
        }"
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
  margin-bottom: 4px;
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
  position: relative;
  padding: 3px 12px 3px 0;
}

/* Bracket connector lines: pairs of matches converge into next round */
/* Top match in a pair: horizontal line going right + vertical line going down */
.match-wrapper.connector-top::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 12px;
  height: 0;
  border-top: 1px solid var(--border-default);
}
.match-wrapper.connector-top::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 0;
  height: calc(50% + 3px);
  border-right: 1px solid var(--border-default);
}

/* Bottom match in a pair: horizontal line going right + vertical line going up */
.match-wrapper.connector-bottom::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 12px;
  height: 0;
  border-top: 1px solid var(--border-default);
}
.match-wrapper.connector-bottom::before {
  content: '';
  position: absolute;
  bottom: 50%;
  right: 0;
  width: 0;
  height: calc(50% + 3px);
  border-right: 1px solid var(--border-default);
}

/* Responsive: smaller screens */
@media (max-width: 480px) {
  .matches-row {
    gap: 3px;
  }
  .match-wrapper {
    padding: 2px 8px 2px 0;
  }
  .match-wrapper.connector-top::after,
  .match-wrapper.connector-bottom::after {
    width: 8px;
  }
  .round-label {
    font-size: 10px;
  }
}
</style>
