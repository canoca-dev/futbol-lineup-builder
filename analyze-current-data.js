import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeCurrentData() {
  try {
    console.log('📊 Mevcut database verilerini analiz ediyoruz...')
    
    // 1. Toplam ve unique sayıları
    const totalCount = await prisma.player.count()
    const uniqueExternalIds = await prisma.player.groupBy({
      by: ['externalId'],
      _count: { externalId: true }
    })
    
    console.log(`\n📈 GENEL İSTATİSTİKLER:`)
    console.log(`• Toplam kayıt: ${totalCount.toLocaleString()}`)
    console.log(`• Unique externalId: ${uniqueExternalIds.length.toLocaleString()}`)
    console.log(`• Duplicate ratio: ${Math.round(((totalCount - uniqueExternalIds.length) / totalCount) * 100)}%`)
    
    // 2. En son sync edilenler
    const recentSynced = await prisma.player.findMany({
      where: { lastSynced: { not: null } },
      orderBy: { lastSynced: 'desc' },
      take: 10,
      select: {
        name: true,
        externalId: true,
        lastSynced: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log(`\n🕐 EN SON SYNC EDİLENLER:`)
    recentSynced.forEach(p => {
      console.log(`• ${p.name} (ID: ${p.externalId}) - Last sync: ${p.lastSynced?.toISOString()}`)
    })
    
    // 3. En güncel data'nın tarih aralığı
    const syncStats = await prisma.player.aggregate({
      _min: { lastSynced: true, createdAt: true },
      _max: { lastSynced: true, createdAt: true },
      where: { lastSynced: { not: null } }
    })
    
    console.log(`\n📅 TARİH ARALIĞI:`)
    console.log(`• İlk sync: ${syncStats._min.lastSynced?.toISOString()}`)
    console.log(`• Son sync: ${syncStats._max.lastSynced?.toISOString()}`)
    console.log(`• İlk kayıt: ${syncStats._min.createdAt?.toISOString()}`)
    console.log(`• Son kayıt: ${syncStats._max.createdAt?.toISOString()}`)
    
    // 4. Duplicate'ların detayı
    const duplicates = await prisma.$queryRaw`
      SELECT externalId, COUNT(*) as count, 
             GROUP_CONCAT(name) as names,
             MAX(lastSynced) as latest_sync
      FROM players 
      WHERE externalId IS NOT NULL 
      GROUP BY externalId 
      HAVING count > 1 
      ORDER BY count DESC 
      LIMIT 10
    `
    
    console.log(`\n🔍 DUPLICATE ÖRNEKLER:`)
    duplicates.forEach((dup) => {
      console.log(`• ExternalId ${dup.externalId}: ${dup.count} kopya - ${dup.names}`)
    })
    
    // 5. Güncel veri koruma stratejisi
    console.log(`\n💡 VERİ KORUMA STRATEJİSİ:`)
    console.log(`1. En son lastSynced tarihi olan kayıtları koru`)
    console.log(`2. aynı externalId için en güncel updatedAt'li olanı seç`)
    console.log(`3. Photo URL'si olan kayıtlara öncelik ver`)
    console.log(`4. Duplicate'ları sil, unique olanları koru`)
    
    // 6. Star players kontrol
    const starPlayers = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: 'Messi' } },
          { name: { contains: 'Ronaldo' } },
          { name: { contains: 'Haaland' } },
          { name: { contains: 'Mbappe' } },
          { name: { contains: 'Neymar' } }
        ]
      },
      orderBy: { lastSynced: 'desc' },
      select: {
        name: true,
        externalId: true,
        nationality: true,
        position: true,
        photo: true,
        lastSynced: true
      }
    })
    
    console.log(`\n⭐ STAR PLAYERS (En güncel):`)
    starPlayers.forEach(p => {
      console.log(`• ${p.name} (${p.nationality}) - ${p.position} - Photo: ${p.photo ? '✅' : '❌'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeCurrentData()
