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
  border-top: 3px solid var(--gold);
  border-bottom: 3px solid var(--gold);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);
  border-radius: var(--radius-lg);
}
.final-matches {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}
.final-match { 
  min-width: 180px;
}
.final-match { 
  min-width: 160px;
  animation: fadeIn 0.5s ease-out;
}
.champion-banner {
  font-size: 24px;
  font-weight: 800;
  color: var(--gold);
  text-align: center;
  padding: 16px 32px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 3px solid var(--gold);
  animation: champion-glow 2s infinite;
  box-shadow: 0 0 30px var(--gold-glow);
  letter-spacing: 1px;
}
@keyframes champion-glow {
  0%, 100% { 
    box-shadow: 0 0 20px var(--gold-glow);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px var(--gold-glow);
    transform: scale(1.02);
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
