import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStats() {
  try {
    const totalPlayers = await prisma.player.count()
    const withPhotos = await prisma.player.count({
      where: { photo: { not: null } }
    })
    
    const topNationalities = await prisma.player.groupBy({
      by: ['nationality'],
      _count: { nationality: true },
      orderBy: { _count: { nationality: 'desc' } },
      take: 10,
      where: { nationality: { not: null } }
    })
    
    const samplePlayers = await prisma.player.findMany({
      where: { 
        OR: [
          { name: { contains: 'Messi' } },
          { name: { contains: 'Ronaldo' } },
          { name: { contains: 'Haaland' } },
          { name: { contains: 'Mbappe' } }
        ]
      },
      take: 10
    })
    
    console.log('📊 DATABASE STATS:')
    console.log(`✅ Total Players: ${totalPlayers.toLocaleString()}`)
    console.log(`📷 With Photos: ${withPhotos.toLocaleString()}`)
    console.log(`💾 Database Size: ~${Math.round(totalPlayers * 0.001)}MB`)
    
    console.log('\n🌍 Top Nationalities:')
    topNationalities.forEach((country, i) => {
      console.log(`${i + 1}. ${country.nationality}: ${country._count.nationality.toLocaleString()}`)
    })
    
    console.log('\n⭐ Sample Star Players:')
    samplePlayers.forEach(p => {
      console.log(`- ${p.name} (${p.nationality}) - ${p.position}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStats()
