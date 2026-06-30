import type { Team } from '../data/tournament'
import { R32_TEMPLATE, R16_PAIRINGS, QF_PAIRINGS, SF_PAIRINGS, THIRD_PLACE_SLOT_OPTIONS } from '../data/tournament'

export interface Match {
  id: number
  team1: Team | null
  team2: Team | null
  winner: Team | null
}

export interface KnockoutRound {
  r32: Match[]
  r16: Match[]
  qf: Match[]
  sf: Match[]
  final: Match
  thirdPlace: Match
}

function emptyMatch(id: number): Match {
  return { id, team1: null, team2: null, winner: null }
}

// Resolve which 3rd-place group fills each "3rd Group X/Y/Z" slot
// Logic: from the slot's candidate groups, exclude the 4 groups whose 3rd was eliminated
export function resolveThirdPlaceSlots(
  bestThirdGroups: string[], // 8 groups whose 3rd place advanced
): Record<number, string> {
  const eliminated = 'ABCDEFGHIJKL'.split('').filter(g => !bestThirdGroups.includes(g))
  const result: Record<number, string> = {}

  for (const tmpl of R32_TEMPLATE) {
    if (tmpl.slot1.type === 'third') {
      const candidates = THIRD_PLACE_SLOT_OPTIONS[tmpl.slot1.group] || []
      const resolved = candidates.find(c => !eliminated.includes(c))
      if (resolved) result[tmpl.id] = resolved
    }
    if (tmpl.slot2.type === 'third') {
      const candidates = THIRD_PLACE_SLOT_OPTIONS[tmpl.slot2.group] || []
      const resolved = candidates.find(c => !eliminated.includes(c))
      if (resolved) result[tmpl.id] = resolved
    }
  }
  return result
}

// Generate R32 matches from group results + best thirds
export function generateR32(
  groupWinners: Record<string, Team>,
  groupRunners: Record<string, Team>,
  groupThirds: Record<string, Team>,
  bestThirdGroups: string[],
): Match[] {
  const resolved = resolveThirdPlaceSlots(bestThirdGroups)

  return R32_TEMPLATE.map(tmpl => {
    const match = emptyMatch(tmpl.id)
    match.team1 = resolveSlot(tmpl.slot1, groupWinners, groupRunners, groupThirds, resolved, tmpl.id)
    match.team2 = resolveSlot(tmpl.slot2, groupWinners, groupRunners, groupThirds, resolved, tmpl.id)
    return match
  }).sort((a, b) => a.id - b.id)
}

function resolveSlot(
  slot: { type: string; group: string },
  winners: Record<string, Team>,
  runners: Record<string, Team>,
  thirds: Record<string, Team>,
  resolvedThirds: Record<number, string>,
  matchId: number,
): Team | null {
  if (slot.type === 'winner') return winners[slot.group] || null
  if (slot.type === 'runner') return runners[slot.group] || null
  if (slot.type === 'third') {
    const resolvedGroup = resolvedThirds[matchId]
    if (resolvedGroup) return thirds[resolvedGroup] || null
    return null
  }
  return null
}

// Propagate: fill next round's match slots based on previous round's winners
export function propagateToNextRound(
  prevRound: Match[],
  pairings: [number, [number, number]][],
  existingNextRound: Match[],
): Match[] {
  return pairings.map(([nextId, [from1, from2]]) => {
    const existing = existingNextRound.find(m => m.id === nextId)
    const m1 = prevRound.find(m => m.id === from1)
    const m2 = prevRound.find(m => m.id === from2)
    const team1 = m1?.winner || null
    const team2 = m2?.winner || null

    // If teams haven't changed, keep existing winner
    const teamChanged = existing?.team1?.id !== team1?.id || existing?.team2?.id !== team2?.id
    return {
      id: nextId,
      team1,
      team2,
      winner: teamChanged ? null : (existing?.winner || null),
    }
  })
}

// Create empty knockout rounds
export function createEmptyKnockout(): KnockoutRound {
  return {
    r32: R32_TEMPLATE.map(t => emptyMatch(t.id)),
    r16: R16_PAIRINGS.map(([id]) => emptyMatch(id)),
    qf: QF_PAIRINGS.map(([id]) => emptyMatch(id)),
    sf: SF_PAIRINGS.map(([id]) => emptyMatch(id)),
    final: emptyMatch(104),
    thirdPlace: emptyMatch(103),
  }
}
