export interface Team {
  id: string
  name: string
  flag: string
  group: string
}

export interface Slot {
  type: 'winner' | 'runner' | 'third'
  group: string
}

export interface R32MatchTemplate {
  id: number        // match number 73-88
  half: 'upper' | 'lower'
  posInHalf: number // 0-7 within half, determines horizontal position
  slot1: Slot
  slot2: Slot
}

// 48 teams in 12 groups
export const GROUPS: Record<string, Team[]> = {
  A: [
    { id: 'mex', name: '墨西哥', flag: '🇲🇽', group: 'A' },
    { id: 'rsa', name: '南非', flag: '🇿🇦', group: 'A' },
    { id: 'kor', name: '韩国', flag: '🇰🇷', group: 'A' },
    { id: 'cze', name: '捷克', flag: '🇨🇿', group: 'A' },
  ],
  B: [
    { id: 'can', name: '加拿大', flag: '🇨🇦', group: 'B' },
    { id: 'bih', name: '波黑', flag: '🇧🇦', group: 'B' },
    { id: 'qat', name: '卡塔尔', flag: '🇶🇦', group: 'B' },
    { id: 'sui', name: '瑞士', flag: '🇨🇭', group: 'B' },
  ],
  C: [
    { id: 'bra', name: '巴西', flag: '🇧🇷', group: 'C' },
    { id: 'mar', name: '摩洛哥', flag: '🇲🇦', group: 'C' },
    { id: 'hai', name: '海地', flag: '🇭🇹', group: 'C' },
    { id: 'sco', name: '苏格兰', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  ],
  D: [
    { id: 'usa', name: '美国', flag: '🇺🇸', group: 'D' },
    { id: 'par', name: '巴拉圭', flag: '🇵🇾', group: 'D' },
    { id: 'aus', name: '澳大利亚', flag: '🇦🇺', group: 'D' },
    { id: 'tur', name: '土耳其', flag: '🇹🇷', group: 'D' },
  ],
  E: [
    { id: 'ger', name: '德国', flag: '🇩🇪', group: 'E' },
    { id: 'cuw', name: '库拉索', flag: '🇨🇼', group: 'E' },
    { id: 'civ', name: '科特迪瓦', flag: '🇨🇮', group: 'E' },
    { id: 'ecu', name: '厄瓜多尔', flag: '🇪🇨', group: 'E' },
  ],
  F: [
    { id: 'ned', name: '荷兰', flag: '🇳🇱', group: 'F' },
    { id: 'jpn', name: '日本', flag: '🇯🇵', group: 'F' },
    { id: 'swe', name: '瑞典', flag: '🇸🇪', group: 'F' },
    { id: 'tun', name: '突尼斯', flag: '🇹🇳', group: 'F' },
  ],
  G: [
    { id: 'bel', name: '比利时', flag: '🇧🇪', group: 'G' },
    { id: 'egy', name: '埃及', flag: '🇪🇬', group: 'G' },
    { id: 'irn', name: '伊朗', flag: '🇮🇷', group: 'G' },
    { id: 'nzl', name: '新西兰', flag: '🇳🇿', group: 'G' },
  ],
  H: [
    { id: 'esp', name: '西班牙', flag: '🇪🇸', group: 'H' },
    { id: 'cpv', name: '佛得角', flag: '🇨🇻', group: 'H' },
    { id: 'ksa', name: '沙特', flag: '🇸🇦', group: 'H' },
    { id: 'uru', name: '乌拉圭', flag: '🇺🇾', group: 'H' },
  ],
  I: [
    { id: 'fra', name: '法国', flag: '🇫🇷', group: 'I' },
    { id: 'sen', name: '塞内加尔', flag: '🇸🇳', group: 'I' },
    { id: 'irq', name: '伊拉克', flag: '🇮🇶', group: 'I' },
    { id: 'nor', name: '挪威', flag: '🇳🇴', group: 'I' },
  ],
  J: [
    { id: 'arg', name: '阿根廷', flag: '🇦🇷', group: 'J' },
    { id: 'alg', name: '阿尔及利亚', flag: '🇩🇿', group: 'J' },
    { id: 'aut', name: '奥地利', flag: '🇦🇹', group: 'J' },
    { id: 'jor', name: '约旦', flag: '🇯🇴', group: 'J' },
  ],
  K: [
    { id: 'por', name: '葡萄牙', flag: '🇵🇹', group: 'K' },
    { id: 'cod', name: '刚果(金)', flag: '🇨🇩', group: 'K' },
    { id: 'uzb', name: '乌兹别克斯坦', flag: '🇺🇿', group: 'K' },
    { id: 'col', name: '哥伦比亚', flag: '🇨🇴', group: 'K' },
  ],
  L: [
    { id: 'eng', name: '英格兰', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
    { id: 'cro', name: '克罗地亚', flag: '🇭🇷', group: 'L' },
    { id: 'gha', name: '加纳', flag: '🇬🇭', group: 'L' },
    { id: 'pan', name: '巴拿马', flag: '🇵🇦', group: 'L' },
  ],
}

export const GROUP_NAMES = Object.keys(GROUPS)

// All teams flat
export const ALL_TEAMS: Team[] = Object.values(GROUPS).flat()

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id)
}

// FIFA official R32 bracket template
// Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage
// posInHalf determines horizontal order within each row (0=leftmost, 7=rightmost)
export const R32_TEMPLATE: R32MatchTemplate[] = [
  // Upper half (matches 73-80) — ordered by posInHalf for horizontal layout
  { id: 73, half: 'upper', posInHalf: 0, slot1: { type: 'runner', group: 'A' }, slot2: { type: 'runner', group: 'B' } },
  { id: 76, half: 'upper', posInHalf: 1, slot1: { type: 'winner', group: 'C' }, slot2: { type: 'runner', group: 'F' } },
  { id: 74, half: 'upper', posInHalf: 2, slot1: { type: 'winner', group: 'E' }, slot2: { type: 'third', group: 'A/B/C/D/F' } },
  { id: 75, half: 'upper', posInHalf: 3, slot1: { type: 'winner', group: 'F' }, slot2: { type: 'runner', group: 'C' } },
  { id: 78, half: 'upper', posInHalf: 4, slot1: { type: 'runner', group: 'E' }, slot2: { type: 'runner', group: 'I' } },
  { id: 77, half: 'upper', posInHalf: 5, slot1: { type: 'winner', group: 'I' }, slot2: { type: 'third', group: 'C/D/F/G/H' } },
  { id: 79, half: 'upper', posInHalf: 6, slot1: { type: 'winner', group: 'A' }, slot2: { type: 'third', group: 'C/E/F/H/I' } },
  { id: 80, half: 'upper', posInHalf: 7, slot1: { type: 'winner', group: 'L' }, slot2: { type: 'third', group: 'E/H/I/J/K' } },
  // Lower half (matches 81-88)
  { id: 81, half: 'lower', posInHalf: 0, slot1: { type: 'winner', group: 'D' }, slot2: { type: 'third', group: 'B/E/F/I/J' } },
  { id: 82, half: 'lower', posInHalf: 1, slot1: { type: 'winner', group: 'G' }, slot2: { type: 'third', group: 'A/E/H/I/J' } },
  { id: 83, half: 'lower', posInHalf: 2, slot1: { type: 'runner', group: 'K' }, slot2: { type: 'runner', group: 'L' } },
  { id: 84, half: 'lower', posInHalf: 3, slot1: { type: 'winner', group: 'H' }, slot2: { type: 'runner', group: 'J' } },
  { id: 85, half: 'lower', posInHalf: 4, slot1: { type: 'winner', group: 'B' }, slot2: { type: 'third', group: 'E/F/G/I/J' } },
  { id: 86, half: 'lower', posInHalf: 5, slot1: { type: 'winner', group: 'J' }, slot2: { type: 'runner', group: 'H' } },
  { id: 87, half: 'lower', posInHalf: 6, slot1: { type: 'winner', group: 'K' }, slot2: { type: 'third', group: 'D/E/I/J/L' } },
  { id: 88, half: 'lower', posInHalf: 7, slot1: { type: 'runner', group: 'D' }, slot2: { type: 'runner', group: 'G' } },
]

// R16 pairings: which two R32 winners feed into each R16 match
// [r16MatchId, [r32MatchId1, r32MatchId2]]
export const R16_PAIRINGS: [number, [number, number]][] = [
  [89, [74, 77]],
  [90, [73, 75]],
  [91, [76, 78]],
  [92, [79, 80]],
  [93, [83, 84]],
  [94, [81, 82]],
  [95, [86, 88]],
  [96, [85, 87]],
]

// QF pairings
export const QF_PAIRINGS: [number, [number, number]][] = [
  [97, [89, 90]],
  [98, [93, 94]],
  [99, [91, 92]],
  [100, [95, 96]],
]

// SF pairings
export const SF_PAIRINGS: [number, [number, number]][] = [
  [101, [97, 98]],
  [102, [99, 100]],
]

// Third-place team slot resolution
export const THIRD_PLACE_SLOT_OPTIONS: Record<string, string[]> = {
  'A/B/C/D/F': ['A', 'B', 'C', 'D', 'F'],
  'C/D/F/G/H': ['C', 'D', 'F', 'G', 'H'],
  'C/E/F/H/I': ['C', 'E', 'F', 'H', 'I'],
  'E/H/I/J/K': ['E', 'H', 'I', 'J', 'K'],
  'B/E/F/I/J': ['B', 'E', 'F', 'I', 'J'],
  'A/E/H/I/J': ['A', 'E', 'H', 'I', 'J'],
  'E/F/G/I/J': ['E', 'F', 'G', 'I', 'J'],
  'D/E/I/J/L': ['D', 'E', 'I', 'J', 'L'],
}