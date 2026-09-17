// Small deterministic PRNG so demo data is stable across reloads/renders
// (mulberry32). Not cryptographic — purely for reproducible mock data.
export function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

export const TEAM_PREFIXES = [
  'Iron', 'Ash', 'Nova', 'Rogue', 'Cinder', 'Void', 'Rust', 'Wraith', 'Fallen',
  'Static', 'Ember', 'Grim', 'Shard', 'Blackout', 'Feral', 'Crimson', 'Hollow',
  'Nomad', 'Vulture', 'Chrome', 'Dust', 'Reaper', 'Ghost', 'Havoc', 'Scrap',
  'Obsidian', 'Ruin', 'Siege', 'Bastion', 'Wildfire', 'Salvage', 'Outland',
  'Pariah', 'Warden', 'Dredge', 'Fracture', 'Marrow', 'Talon', 'Onyx', 'Slate',
]

export const TEAM_SUFFIXES = [
  'Syndicate', 'Cartel', 'Division', 'Legion', 'Collective', 'Outfit', 'Crew',
  'Company', 'Battalion', 'Clan', 'Faction', 'Brigade', 'Guild', 'Squad',
  'Order', 'Pack', 'Union', 'Cell', 'Regiment', 'Front',
]

export const FIRST_NAMES = [
  'Arjun', 'Kabir', 'Vihaan', 'Rehan', 'Dev', 'Kunal', 'Rohan', 'Aditya',
  'Sameer', 'Yusuf', 'Nikhil', 'Farhan', 'Zaid', 'Aryan', 'Ishaan', 'Rudra',
  'Vivek', 'Karan', 'Om', 'Tanish', 'Marco', 'Kenji', 'Diego', 'Liam',
  'Noah', 'Lucas', 'Mateo', 'Ivan', 'Felix', 'Owen', 'Ezra', 'Theo',
]

export const HANDLES = [
  'Vantage', 'Slug', 'Ricochet', 'Nightshade', 'Circuit', 'Fuse', 'Blackice',
  'Hollowpoint', 'Static', 'Wisp', 'Talon', 'Grim', 'Dash', 'Reaper', 'Vex',
  'Kilo', 'Zero', 'Echo', 'Ninth', 'Rune', 'Ash', 'Snare', 'Marrow', 'Onyx',
  'Cinder', 'Wraithe', 'Bolt', 'Rift', 'Torque', 'Pike', 'Sable', 'Grit',
]

export const APOCALYPSE_LOCATIONS = [
  'Dulang Overpass', 'Rustwater Docks', 'The Ashfields', 'Silo District',
  'Cracked Reservoir', 'Old Refinery', 'Scorched Terminal', 'Undercroft Market',
  'Signal Ridge', 'Collapsed Interchange', 'Bonefield Quarry', 'Hollow Transit Yard',
  'Grey Sector Rooftops', 'Sunken Substation', 'Northgate Ruins',
]
