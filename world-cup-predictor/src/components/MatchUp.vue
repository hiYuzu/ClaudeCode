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
  border-radius: var(--radius-md);
  overflow: hidden;
  min-width: 160px;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  box-shadow: var(--shadow-sm);
}
.matchup:hover {
  border-color: var(--border-default);
}
.matchup.decided {
  border-color: var(--accent);
  box-shadow: 0 0 15px var(--accent-glow);
}
.matchup.gold {
  background: var(--gold-gradient);
  border-color: var(--gold);
  padding: 0;
  box-shadow: var(--shadow-md);
}
.matchup.gold.decided {
  box-shadow: 0 0 20px var(--gold-glow);
}
.match-label {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-subtle);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.matchup.gold .match-label {
  color: rgba(0, 0, 0, 0.7);
  border-bottom-color: rgba(0,0,0,0.15);
}
.match-team {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background var(--transition-normal);
  font-size: 14px;
  border-bottom: 1px solid var(--border-subtle);
}
.match-team:last-child { border-bottom: none; }
.match-team:hover { 
  background: var(--bg-highlight); 
}
.match-team.winner {
  background: var(--accent-glow);
  animation: win-flash 0.4s ease-out;
}
.matchup.gold .match-team.winner {
  background: rgba(255,255,255,0.35);
}
.match-team.lost {
  opacity: 0.35;
}
.match-team.lost .team-name { 
  text-decoration: line-through; 
}
.team-flag { 
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
.team-name { 
  flex: 1; 
  color: var(--text-primary); 
  font-weight: 500;
}
.match-team.winner .team-name { 
  color: var(--accent); 
  font-weight: 700; 
}
.matchup.gold .match-team .team-name { 
  color: #111; 
}
.matchup.gold .match-team.winner .team-name { 
  color: #111; 
  font-weight: 800; 
}
.check {
  color: var(--accent);
  font-size: 14px;
  font-weight: 800;
  animation: check-pop 0.4s ease-out;
}
.matchup.gold .check { 
  color: #111; 
}

@keyframes win-flash {
  0% { background: rgba(46, 125, 50, 0.3); }
  100% { background: var(--accent-glow); }
}
@keyframes check-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.4); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
