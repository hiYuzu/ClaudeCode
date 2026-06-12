<script setup lang="ts">
import { computed } from 'vue'
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

function onMatchSelect(roundKey: string, matchId: number, team: any) {
  setMatchWinner(roundKey as any, matchId, team)
}
</script>

<template>
  <div class="knockout-stage">
    <div class="half-label">⬆ 上半区</div>

    <BracketRow
      :matches="upperR32" round-label="32强" round-key="r32"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />
    <BracketRow
      :matches="upperR16" round-label="16强" round-key="r16"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <BracketRow
      :matches="upperQF" round-label="¼决赛" round-key="qf"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <BracketRow
      :matches="upperSF" round-label="半决赛" round-key="sf"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />

    <FinalMatch />

    <BracketRow
      :matches="lowerSF" round-label="半决赛" round-key="sf"
      @select="(id, team) => onMatchSelect('sf', id, team)"
    />
    <BracketRow
      :matches="lowerQF" round-label="¼决赛" round-key="qf"
      @select="(id, team) => onMatchSelect('qf', id, team)"
    />
    <BracketRow
      :matches="lowerR16" round-label="16强" round-key="r16"
      @select="(id, team) => onMatchSelect('r16', id, team)"
    />
    <BracketRow
      :matches="lowerR32" round-label="32强" round-key="r32"
      @select="(id, team) => onMatchSelect('r32', id, team)"
    />

    <div class="half-label">⬇ 下半区</div>
  </div>
</template>

<style scoped>
.knockout-stage {
  overflow-x: auto;
  padding: 8px 0;
}
.half-label {
  text-align: center;
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
  padding: 6px 0;
}
</style>
