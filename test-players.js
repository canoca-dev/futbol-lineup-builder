import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPlayers() {
  try {
    console.log('🔍 Database\'de Messi ve Ronaldo aranıyor...')
    
    const players = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: 'Messi' } },
          { name: { contains: 'Ronaldo' } }
        ]
      }
    })
    
    console.log(`📊 Bulunan oyuncu sayısı: ${players.length}`)
    
    if (players.length > 0) {
      console.log('\n🎯 Bulunan oyuncular:')
      players.forEach(player => {
        console.log(`- ${player.name} (${player.team}) - Foto: ${player.photoUrl ? '✅ VAR' : '❌ YOK'}`)
      })
    } else {
      console.log('❌ Hiç oyuncu bulunamadı')
    }
    
    // Toplam oyuncu sayısını da gösterelim
    const totalCount = await prisma.player.count()
    console.log(`\n📈 Toplam database\'de ${totalCount} oyuncu var`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPlayers()
