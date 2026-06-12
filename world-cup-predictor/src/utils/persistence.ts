let saveTimer: ReturnType<typeof setTimeout> | null = null

export async function loadPrediction(): Promise<any> {
  try {
    const res = await fetch('/api/prediction')
    if (!res.ok) return null
    const data = await res.json()
    return Object.keys(data).length > 0 ? data : null
  } catch {
    return null
  }
}

export function savePrediction(data: any, immediate = false) {
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