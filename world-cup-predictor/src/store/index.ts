import { reactive } from 'vue'
import type { Team } from '../data/tournament'
import { GROUPS, GROUP_NAMES, R16_PAIRINGS, QF_PAIRINGS, SF_PAIRINGS } from '../data/tournament'
import { generateR32, propagateToNextRound, createEmptyKnockout, type KnockoutRound, type Match } from '../utils/bracket'

export interface GroupPrediction {
  teams: Team[]
  first: Team | null
  second: Team | null
  third: Team | null
}

export interface Store {
  groups: Record<string, GroupPrediction>
  bestThirds: string[]        // group letters of 8 best 3rd place teams
  knockout: KnockoutRound
  champion: Team | null
  activeTab: 'group' | 'knockout'
  loading: boolean
  error: string | null
}

function createInitialGroups(): Record<string, GroupPrediction> {
  const result: Record<string, GroupPrediction> = {}
  for (const name of GROUP_NAMES) {
    result[name] = { teams: [...GROUPS[name]], first: null, second: null, third: null }
  }
  return result
}

export const store = reactive<Store>({
  groups: createInitialGroups(),
  bestThirds: [],
  knockout: createEmptyKnockout(),
  champion: null,
  activeTab: 'group',
  loading: false,
  error: null,
})

// Toggle team selection in a group
export function toggleGroupTeam(groupName: string, team: Team) {
  const g = store.groups[groupName]
  if (!g) return

  try {
    // If team is already selected, deselect it
    if (g.first?.id === team.id) {
      g.first = null
      // Promote second to first if exists
      if (g.second) { g.first = g.second; g.second = null }
      // Promote third to second if exists
      if (g.third) { g.second = g.third; g.third = null }
    } else if (g.second?.id === team.id) {
      g.second = null
      // Promote third to second if exists
      if (g.third) { g.second = g.third; g.third = null }
    } else if (g.third?.id === team.id) {
      g.third = null
    } else if (!g.first) {
      g.first = team
    } else if (!g.second) {
      g.second = team
    } else if (!g.third) {
      g.third = team
    }
    // If already 3 selected, do nothing (user must deselect first)
    afterGroupChange()
  } catch (err) {
    store.error = '选择队伍时出错，请重试'
    console.error('Error toggling group team:', err)
  }
}

export function toggleBestThird(groupLetter: string) {
  const idx = store.bestThirds.indexOf(groupLetter)
  if (idx >= 0) {
    store.bestThirds.splice(idx, 1)
  } else if (store.bestThirds.length < 8) {
    store.bestThirds.push(groupLetter)
  }
  afterGroupChange()
}

// Recalculate knockout bracket after group stage changes
function afterGroupChange() {
  // Check if all groups have selections and 8 best thirds chosen
  const allGroupsDone = GROUP_NAMES.every(g => store.groups[g].first && store.groups[g].second && store.groups[g].third)
  const thirdsDone = store.bestThirds.length === 8

  if (!allGroupsDone || !thirdsDone) {
    // Clear knockout
    store.knockout = createEmptyKnockout()
    store.champion = null
    return
  }

  // Build lookup maps
  const winners: Record<string, Team> = {}
  const runners: Record<string, Team> = {}
  const thirds: Record<string, Team> = {}
  for (const name of GROUP_NAMES) {
    const g = store.groups[name]
    winners[name] = g.first!
    runners[name] = g.second!
    thirds[name] = g.third!
  }

  // Generate R32
  const r32 = generateR32(winners, runners, thirds, store.bestThirds)
  // Keep existing R32 winners where team pairings match
  store.knockout.r32 = r32.map((m, i) => {
    const old = store.knockout.r32[i]
    if (old && old.team1?.id === m.team1?.id && old.team2?.id === m.team2?.id) {
      return { ...m, winner: old.winner }
    }
    return m
  })

  // Propagate R32 → R16 → QF → SF → Final
  recascadeFromR32()
}

function recascadeFromR32() {
  store.knockout.r16 = propagateToNextRound(store.knockout.r32, R16_PAIRINGS, store.knockout.r16)
  store.knockout.qf = propagateToNextRound(store.knockout.r16, QF_PAIRINGS, store.knockout.qf)
  store.knockout.sf = propagateToNextRound(store.knockout.qf, SF_PAIRINGS, store.knockout.sf)

  // SF → Final + Third Place
  updateFinalAndThird()
}

// Set winner for a knockout match, then recascade
export function setMatchWinner(round: 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'thirdPlace', matchId: number, team: Team | null) {
  const match = round === 'final' ? store.knockout.final
    : round === 'thirdPlace' ? store.knockout.thirdPlace
    : store.knockout[round].find((m: Match) => m.id === matchId)
  if (!match) return

  // Toggle: clicking same team deselects
  match.winner = match.winner?.id === team?.id ? null : team

  // For final/thirdPlace, just update champion — no need to rebuild anything
  if (round === 'final' || round === 'thirdPlace') {
    store.champion = store.knockout.final.winner
    return
  }

  // Cascade forward from earlier rounds
  if (round === 'r32') {
    store.knockout.r16 = propagateToNextRound(store.knockout.r32, R16_PAIRINGS, store.knockout.r16)
  }
  if (round === 'r32' || round === 'r16') {
    store.knockout.qf = propagateToNextRound(store.knockout.r16, QF_PAIRINGS, store.knockout.qf)
  }
  if (round === 'r32' || round === 'r16' || round === 'qf') {
    store.knockout.sf = propagateToNextRound(store.knockout.qf, SF_PAIRINGS, store.knockout.sf)
  }
  updateFinalAndThird()
}

function updateFinalAndThird() {
  const sf1 = store.knockout.sf.find(m => m.id === 101)
  const sf2 = store.knockout.sf.find(m => m.id === 102)
  const oldFinal = store.knockout.final
  const oldThird = store.knockout.thirdPlace

  const fTeam1 = sf1?.winner || null
  const fTeam2 = sf2?.winner || null
  const fChanged = oldFinal.team1?.id !== fTeam1?.id || oldFinal.team2?.id !== fTeam2?.id
  store.knockout.final = { id: 104, team1: fTeam1, team2: fTeam2, winner: fChanged ? null : oldFinal.winner }

  const tTeam1 = sf1?.winner ? (sf1.team1?.id === sf1.winner.id ? sf1.team2 : sf1.team1) : null
  const tTeam2 = sf2?.winner ? (sf2.team1?.id === sf2.winner.id ? sf2.team2 : sf2.team1) : null
  const tChanged = oldThird.team1?.id !== tTeam1?.id || oldThird.team2?.id !== tTeam2?.id
  store.knockout.thirdPlace = { id: 103, team1: tTeam1, team2: tTeam2, winner: tChanged ? null : oldThird.winner }

  store.champion = store.knockout.final.winner
}
