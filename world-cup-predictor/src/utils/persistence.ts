import type { Team } from '../data/tournament'
import type { KnockoutRound } from './bracket'

export interface PredictionData {
  groups: Record<string, { first: Team | null; second: Team | null; third: Team | null }>
  bestThirds: string[]
  knockout: KnockoutRound
  champion: Team | null
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export async function loadPrediction(): Promise<PredictionData | null> {
  try {
    const res = await fetch('/api/prediction')
    if (!res.ok) return null
    const data = await res.json()
    return Object.keys(data).length > 0 ? data : null
  } catch {
    return null
  }
}

export function savePrediction(data: PredictionData, immediate = false) {
  const doSave = () => {
    fetch('/api/prediction', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})
  }

  if (immediate) {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
    doSave()
  } else {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(doSave, 500)
  }
}