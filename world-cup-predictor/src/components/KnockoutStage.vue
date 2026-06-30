<script setup lang="ts">
import { computed } from 'vue'
import type { Team } from '../data/tournament'
import { store, setMatchWinner } from '../store'
import { R32_TEMPLATE, R16_PAIRINGS, QF_PAIRINGS, SF_PAIRINGS } from '../data/tournament'
import BracketRow from './BracketRow.vue'
import FinalMatch from './FinalMatch.vue'

// Split matches by half
const upperR32 = computed(() =>
  R32_TEMPLATE.filter(t => t.half === 'upper')
    .sort((a, b) => a.posInHalf - b.posInHalf)
    .map(t => store.knockout.r32.find(m => m.id === t.id)!)
    .filter(Boolean)
)
const lowerR32 = computed(() =>
  R32_TEMPLATE.filter(t => t.half === 'lower')
    .sort((a, b) => a.posInHalf - b.posInHalf)
    .map(t => store.knockout.r32.find(m => m.id === t.id)!)
    .filter(Boolean)
)

// R16: split into upper half and lower half
const upperR32Ids = new Set(R32_TEMPLATE.filter(t => t.half === 'upper').map(t => t.id))
const upperR16Pairings = R16_PAIRINGS.filter(([, [a, b]]) => upperR32Ids.has(a))
const lowerR16Pairings = R16_PAIRINGS.filter(([, [a, b]]) => !upperR32Ids.has(a))

const upperR16 = computed(() =>
  upperR16Pairings.map(([id]) => store.knockout.r16.find(m => m.id === id)!)
    .filter(Boolean)
)
const lowerR16 = computed(() =>
  lowerR16Pairings.map(([id]) => store.knockout.r16.find(m => m.id === id)!)
    .filter(Boolean)
)

// QF: first 2 are upper, last 2 are lower
const upperQF = computed(() => store.knockout.qf.filter(m => m.id <= 98))
const lowerQF = computed(() => store.knockout.qf.filter(m => m.id >= 99))

// SF
const upperSF = computed(() => store.knockout.sf.filter(m => m.id === 101))
const lowerSF = computed(() => store.knockout.sf.filter(m => m.id === 102))

function onMatchSelect(roundKey: string, matchId: number, team: Team | null) {
  setMatchWinner(roundKey as 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'thirdPlace', matchId, team)
}
</script>

<template>
  <div class="knockout-stage">

    <BracketRow
      :matches="upperR32" round-label="32强" round-key="r32"
      :match-count="8"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />
    <div class="round-separator"><span class="arrow down">▼</span></div>
    <BracketRow
      :matches="upperR16" round-label="16强" round-key="r16"
      :match-count="4"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <div class="round-separator"><span class="arrow down">▼</span></div>
    <BracketRow
      :matches="upperQF" round-label="¼决赛" round-key="qf"
      :match-count="2"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <div class="round-separator"><span class="arrow down">▼</span></div>
    <BracketRow
      :matches="upperSF" round-label="半决赛" round-key="sf"
      :match-count="1"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />

    <FinalMatch />

    <BracketRow
      :matches="lowerSF" round-label="半决赛" round-key="sf"
      :match-count="1"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />
    <div class="round-separator"><span class="arrow up">▲</span></div>
    <BracketRow
      :matches="lowerQF" round-label="¼决赛" round-key="qf"
      :match-count="2"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <div class="round-separator"><span class="arrow up">▲</span></div>
    <BracketRow
      :matches="lowerR16" round-label="16强" round-key="r16"
      :match-count="4"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <div class="round-separator"><span class="arrow up">▲</span></div>
    <BracketRow
      :matches="lowerR32" round-label="32强" round-key="r32"
      :match-count="8"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />

  </div>
</template>

<style scoped>
.knockout-stage {
  overflow-x: auto;
  padding: 16px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-default) var(--bg-page);
}
.round-separator {
  display: flex;
  justify-content: center;
  padding: 6px 0;
}
.round-separator .arrow {
  font-size: 16px;
  color: var(--text-muted);
  transition: color var(--transition-normal);
  animation: float 2.5s ease-in-out infinite;
  padding: 5px 10px;
  border-radius: 50%;
  background: var(--bg-highlight);
}
.round-separator:hover .arrow {
  color: var(--accent);
  background: var(--accent-glow);
}
.round-separator .arrow.down {
  animation-name: float-down;
}
.round-separator .arrow.up {
  animation-name: float-up;
}
@keyframes float-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
@keyframes float-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
