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
