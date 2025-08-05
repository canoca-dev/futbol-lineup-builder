import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function miniSync() {
  console.log('🚀 Starting mini sync test (100 players)...')
  
  try {
    // Create sync log
    const syncLog = await prisma.syncLog.create({
      data: { 
        operation: 'mini_sync',
        status: 'running'
      }
    })
    
    console.log(`📊 Sync log created: ${syncLog.id}`)
    
    // Fetch 100 players
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=100')
    const data = await response.json()
    const apiPlayers = data.players || []
    
    console.log(`🌐 Fetched ${apiPlayers.length} players from API`)
    
    let processed = 0
    
    for (const apiPlayer of apiPlayers) {
      try {
        const photoHash = crypto.createHash('md5').update(apiPlayer.imgSrc || '').digest('hex')
        
        await prisma.player.upsert({
          where: { externalId: apiPlayer.id.toString() },
          update: {
            name: apiPlayer.shortName || apiPlayer.knownName,
            firstName: apiPlayer.shortName?.split(' ')[0] || '',
            lastName: apiPlayer.shortName?.split(' ').slice(1).join(' ') || '',
            nationality: apiPlayer.nationality,
            position: mapPosition(apiPlayer.positions?.[0]),
            photo: apiPlayer.imgSrc,
            photoHash,
            lastSynced: new Date()
          },
          create: {
            externalId: apiPlayer.id.toString(),
            name: apiPlayer.shortName || apiPlayer.knownName,
            firstName: apiPlayer.shortName?.split(' ')[0] || '',
            lastName: apiPlayer.shortName?.split(' ').slice(1).join(' ') || '',
            nationality: apiPlayer.nationality,
            position: mapPosition(apiPlayer.positions?.[0]),
            shirtNumber: apiPlayer.kitNumber,
            photo: apiPlayer.imgSrc,
            photoHash,
            lastSynced: new Date(),
            isCustom: false
          }
        })
        
        processed++
        if (processed % 10 === 0) {
          console.log(`✅ Processed ${processed}/${apiPlayers.length} players`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 50))
        
      } catch (error) {
        console.warn(`⚠️ Failed to process player ${apiPlayer.shortName}:`, error.message)
      }
    }
    
    // Complete sync log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'completed',
        totalItems: processed,
        processedItems: processed,
        completedAt: new Date()
      }
    })
    
    // Test search
    console.log('\n🔍 Testing search...')
    const messi = await prisma.player.findMany({
      where: { name: { contains: 'Messi' } },
      take: 3
    })
    
    const haaland = await prisma.player.findMany({
      where: { name: { contains: 'Haaland' } },
      take: 3
    })
    
    console.log(`🐐 Messi search: ${messi.length} results`)
    messi.forEach(p => console.log(`   - ${p.name} (${p.nationality})`))
    
    console.log(`⚡ Haaland search: ${haaland.length} results`)
    haaland.forEach(p => console.log(`   - ${p.name} (${p.nationality})`))
    
    console.log(`\n🎉 Mini sync completed! ${processed} players processed`)
    
  } catch (error) {
    console.error('❌ Mini sync failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function mapPosition(apiPosition) {
  if (!apiPosition) return 'ST'
  const position = apiPosition.toUpperCase()
  if (position === 'GK') return 'GK'
  if (['CB', 'LB', 'RB'].includes(position)) return position
  if (['CDM', 'CM', 'CAM'].includes(position)) return 'CM'
  if (['LW', 'RW'].includes(position)) return position
  if (['ST', 'CF'].includes(position)) return 'ST'
  return 'ST'
}

miniSync()
