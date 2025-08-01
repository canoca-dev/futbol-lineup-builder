import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create formations
  const formations = [
    {
      name: '4-4-2 Classic',
      code: '4-4-2',
      description: 'Balanced formation with 4 defenders, 4 midfielders, and 2 forwards',
      positions: JSON.stringify([
        { id: 'GK', x: 50, y: 90, role: 'GK' },
        { id: 'RB', x: 85, y: 75, role: 'RB' },
        { id: 'CB1', x: 65, y: 75, role: 'CB' },
        { id: 'CB2', x: 35, y: 75, role: 'CB' },
        { id: 'LB', x: 15, y: 75, role: 'LB' },
        { id: 'RM', x: 80, y: 50, role: 'RM' },
        { id: 'CM1', x: 60, y: 50, role: 'CM' },
        { id: 'CM2', x: 40, y: 50, role: 'CM' },
        { id: 'LM', x: 20, y: 50, role: 'LM' },
        { id: 'ST1', x: 60, y: 25, role: 'ST' },
        { id: 'ST2', x: 40, y: 25, role: 'ST' }
      ])
    },
    {
      name: '4-3-3 Attack',
      code: '4-3-3',
      description: 'Attacking formation with wide forwards and creative midfield',
      positions: JSON.stringify([
        { id: 'GK', x: 50, y: 90, role: 'GK' },
        { id: 'RB', x: 85, y: 75, role: 'RB' },
        { id: 'CB1', x: 65, y: 75, role: 'CB' },
        { id: 'CB2', x: 35, y: 75, role: 'CB' },
        { id: 'LB', x: 15, y: 75, role: 'LB' },
        { id: 'CDM', x: 50, y: 60, role: 'CDM' },
        { id: 'CM1', x: 65, y: 50, role: 'CM' },
        { id: 'CM2', x: 35, y: 50, role: 'CM' },
        { id: 'RW', x: 80, y: 30, role: 'RW' },
        { id: 'ST', x: 50, y: 20, role: 'ST' },
        { id: 'LW', x: 20, y: 30, role: 'LW' }
      ])
    },
    {
      name: '4-2-3-1 Modern',
      code: '4-2-3-1',
      description: 'Modern formation with double pivot and attacking midfielder',
      positions: JSON.stringify([
        { id: 'GK', x: 50, y: 90, role: 'GK' },
        { id: 'RB', x: 85, y: 75, role: 'RB' },
        { id: 'CB1', x: 65, y: 75, role: 'CB' },
        { id: 'CB2', x: 35, y: 75, role: 'CB' },
        { id: 'LB', x: 15, y: 75, role: 'LB' },
        { id: 'CDM1', x: 60, y: 60, role: 'CDM' },
        { id: 'CDM2', x: 40, y: 60, role: 'CDM' },
        { id: 'RAM', x: 75, y: 40, role: 'CAM' },
        { id: 'CAM', x: 50, y: 35, role: 'CAM' },
        { id: 'LAM', x: 25, y: 40, role: 'CAM' },
        { id: 'ST', x: 50, y: 20, role: 'ST' }
      ])
    }
  ]

  for (const formation of formations) {
    await prisma.formation.upsert({
      where: { code: formation.code },
      update: formation,
      create: formation,
    })
  }

  // Create leagues
  const leagues = [
    { name: 'Premier League', code: 'PL', country: 'England' },
    { name: 'La Liga', code: 'PD', country: 'Spain' },
    { name: 'Serie A', code: 'SA', country: 'Italy' },
    { name: 'Bundesliga', code: 'BL1', country: 'Germany' },
    { name: 'Ligue 1', code: 'FL1', country: 'France' },
    { name: 'Süper Lig', code: 'TR1', country: 'Turkey' }
  ]

  for (const league of leagues) {
    await prisma.league.upsert({
      where: { code: league.code },
      update: league,
      create: league,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
