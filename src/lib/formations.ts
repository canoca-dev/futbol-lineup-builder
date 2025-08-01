export interface Position {
  id: string
  x: number // Percentage from left (0-100)
  y: number // Percentage from top (0-100)
  role: string
}

export interface FormationData {
  id: string
  name: string
  code: string
  description: string
  positions: Position[]
}

export const FORMATIONS: FormationData[] = [
  {
    id: '4-4-2',
    name: '4-4-2 Classic',
    code: '4-4-2',
    description: 'Balanced formation with 4 defenders, 4 midfielders, and 2 forwards',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'RB', x: 85, y: 75, role: 'RB' },
      { id: 'CB1', x: 65, y: 75, role: 'CB' },
      { id: 'CB2', x: 35, y: 75, role: 'CB' },
      { id: 'LB', x: 15, y: 75, role: 'LB' },
      
      // Midfielders
      { id: 'RM', x: 80, y: 50, role: 'RM' },
      { id: 'CM1', x: 60, y: 50, role: 'CM' },
      { id: 'CM2', x: 40, y: 50, role: 'CM' },
      { id: 'LM', x: 20, y: 50, role: 'LM' },
      
      // Forwards
      { id: 'ST1', x: 60, y: 25, role: 'ST' },
      { id: 'ST2', x: 40, y: 25, role: 'ST' }
    ]
  },
  {
    id: '4-3-3',
    name: '4-3-3 Attack',
    code: '4-3-3',
    description: 'Attacking formation with wide forwards and creative midfield',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'RB', x: 85, y: 75, role: 'RB' },
      { id: 'CB1', x: 65, y: 75, role: 'CB' },
      { id: 'CB2', x: 35, y: 75, role: 'CB' },
      { id: 'LB', x: 15, y: 75, role: 'LB' },
      
      // Midfielders
      { id: 'CDM', x: 50, y: 60, role: 'CDM' },
      { id: 'CM1', x: 65, y: 50, role: 'CM' },
      { id: 'CM2', x: 35, y: 50, role: 'CM' },
      
      // Forwards
      { id: 'RW', x: 80, y: 30, role: 'RW' },
      { id: 'ST', x: 50, y: 20, role: 'ST' },
      { id: 'LW', x: 20, y: 30, role: 'LW' }
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2 Diamond',
    code: '3-5-2',
    description: 'Defensive solidity with wing-backs providing width',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'CB1', x: 70, y: 75, role: 'CB' },
      { id: 'CB2', x: 50, y: 75, role: 'CB' },
      { id: 'CB3', x: 30, y: 75, role: 'CB' },
      
      // Midfielders
      { id: 'RWB', x: 85, y: 55, role: 'RWB' },
      { id: 'CDM', x: 50, y: 60, role: 'CDM' },
      { id: 'CM1', x: 65, y: 45, role: 'CM' },
      { id: 'CM2', x: 35, y: 45, role: 'CM' },
      { id: 'LWB', x: 15, y: 55, role: 'LWB' },
      
      // Forwards
      { id: 'ST1', x: 60, y: 25, role: 'ST' },
      { id: 'ST2', x: 40, y: 25, role: 'ST' }
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 Modern',
    code: '4-2-3-1',
    description: 'Modern formation with double pivot and attacking midfielder',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'RB', x: 85, y: 75, role: 'RB' },
      { id: 'CB1', x: 65, y: 75, role: 'CB' },
      { id: 'CB2', x: 35, y: 75, role: 'CB' },
      { id: 'LB', x: 15, y: 75, role: 'LB' },
      
      // Defensive Midfielders
      { id: 'CDM1', x: 60, y: 60, role: 'CDM' },
      { id: 'CDM2', x: 40, y: 60, role: 'CDM' },
      
      // Attacking Midfielders
      { id: 'RAM', x: 75, y: 40, role: 'CAM' },
      { id: 'CAM', x: 50, y: 35, role: 'CAM' },
      { id: 'LAM', x: 25, y: 40, role: 'CAM' },
      
      // Forward
      { id: 'ST', x: 50, y: 20, role: 'ST' }
    ]
  },
  {
    id: '5-3-2',
    name: '5-3-2 Defensive',
    code: '5-3-2',
    description: 'Solid defensive formation with wing-backs',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'RWB', x: 90, y: 70, role: 'RWB' },
      { id: 'CB1', x: 70, y: 80, role: 'CB' },
      { id: 'CB2', x: 50, y: 80, role: 'CB' },
      { id: 'CB3', x: 30, y: 80, role: 'CB' },
      { id: 'LWB', x: 10, y: 70, role: 'LWB' },
      
      // Midfielders
      { id: 'CDM', x: 50, y: 55, role: 'CDM' },
      { id: 'CM1', x: 65, y: 45, role: 'CM' },
      { id: 'CM2', x: 35, y: 45, role: 'CM' },
      
      // Forwards
      { id: 'ST1', x: 60, y: 25, role: 'ST' },
      { id: 'ST2', x: 40, y: 25, role: 'ST' }
    ]
  },
  {
    id: '3-4-3',
    name: '3-4-3 Attack',
    code: '3-4-3',
    description: 'Ultra-attacking formation with three forwards',
    positions: [
      // Goalkeeper
      { id: 'GK', x: 50, y: 90, role: 'GK' },
      
      // Defenders
      { id: 'CB1', x: 70, y: 75, role: 'CB' },
      { id: 'CB2', x: 50, y: 75, role: 'CB' },
      { id: 'CB3', x: 30, y: 75, role: 'CB' },
      
      // Midfielders
      { id: 'RM', x: 80, y: 50, role: 'RM' },
      { id: 'CM1', x: 60, y: 50, role: 'CM' },
      { id: 'CM2', x: 40, y: 50, role: 'CM' },
      { id: 'LM', x: 20, y: 50, role: 'LM' },
      
      // Forwards
      { id: 'RW', x: 75, y: 25, role: 'RW' },
      { id: 'ST', x: 50, y: 20, role: 'ST' },
      { id: 'LW', x: 25, y: 25, role: 'LW' }
    ]
  }
]

export const DEFAULT_FORMATION = FORMATIONS[0] // 4-4-2
