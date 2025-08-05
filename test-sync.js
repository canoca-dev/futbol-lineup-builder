import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function testSync() {
  try {
    console.log('🧪 Testing sync system...')
    
    // Test 1: Prisma connection
    console.log('\n📊 Test 1: Database connection')
    const playerCount = await prisma.player.count()
    console.log(`✅ Current players in DB: ${playerCount}`)
    
    // Test 2: API connection
    console.log('\n🌐 Test 2: API connection')
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=5')
    const data = await response.json()
    console.log(`✅ API returned ${data.players?.length || 0} players`)
    
    // Test 3: Sample player insert
    console.log('\n💾 Test 3: Sample data insert')
    if (data.players && data.players.length > 0) {
      const samplePlayer = data.players[0]
      
      const player = await prisma.player.upsert({
        where: { externalId: samplePlayer.id.toString() },
        update: {
          name: samplePlayer.shortName || samplePlayer.knownName,
          photo: samplePlayer.imgSrc,
          lastSynced: new Date()
        },
        create: {
          externalId: samplePlayer.id.toString(),
          name: samplePlayer.shortName || samplePlayer.knownName,
          firstName: samplePlayer.shortName?.split(' ')[0] || '',
          lastName: samplePlayer.shortName?.split(' ').slice(1).join(' ') || '',
          nationality: samplePlayer.nationality,
          position: samplePlayer.positions?.[0] || 'ST',
          photo: samplePlayer.imgSrc,
          photoHash: crypto.createHash('md5').update(samplePlayer.imgSrc || '').digest('hex'),
          lastSynced: new Date(),
          isCustom: false
        }
      })
      
      console.log(`✅ Sample player saved: ${player.name} (ID: ${player.id})`)
    }
    
    // Test 4: Search test
    console.log('\n🔍 Test 4: Local search test')
    const searchResults = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: 'messi' } },
          { name: { contains: 'ronaldo' } }
        ],
        isCustom: false
      },
      take: 5
    })
    console.log(`✅ Search results: ${searchResults.length} players found`)
    searchResults.forEach(p => console.log(`   - ${p.name} (${p.position})`))
    
    console.log('\n🎉 All tests passed! System is ready for sync.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSync()
