<script setup lang="ts">
import { store, setMatchWinner } from '../store'
import MatchUp from './MatchUp.vue'
</script>

<template>
  <div class="final-section">
    <div class="final-matches">
      <div class="final-match">
        <MatchUp
          :team1="store.knockout.thirdPlace.team1"
          :team2="store.knockout.thirdPlace.team2"
          :winner="store.knockout.thirdPlace.winner"
          label="🥉 三四名决赛"
          @select="(team) => setMatchWinner('thirdPlace', 103, team)"
        />
      </div>
      <div class="final-match gold">
        <MatchUp
          :team1="store.knockout.final.team1"
          :team2="store.knockout.final.team2"
          :winner="store.knockout.final.winner"
          label="🏅 决赛"
          :gold="true"
          @select="(team) => setMatchWinner('final', 104, team)"
        />
      </div>
    </div>
    <div v-if="store.champion" class="champion-banner">
      🏆 {{ store.champion.flag }} {{ store.champion.name }} 🏆
    </div>
  </div>
</template>

<style scoped>
.final-section {
  border-top: 2px solid var(--gold);
  border-bottom: 2px solid var(--gold);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.final-matches {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.final-match { min-width: 140px; }
.champion-banner {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
  text-align: center;
  padding: 8px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 2px solid var(--gold);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
