// Offset pagination testi
async function testOffsetPagination() {
  console.log('🔍 Offset pagination detaylı testi...')
  
  const allPlayers = new Map()
  const offsets = [0, 100, 200, 300, 400, 500]
  
  for (const offset of offsets) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        let newPlayers = 0
        
        console.log(`\nOffset ${offset}:`)
        for (const player of data.players) {
          if (!allPlayers.has(player.id)) {
            allPlayers.set(player.id, player)
            newPlayers++
          }
        }
        
        console.log(`  - Dönen: ${data.players.length}, Yeni: ${newPlayers}, Toplam unique: ${allPlayers.size}`)
        console.log(`  - İlk oyuncu: ${data.players[0].knownName} (ID: ${data.players[0].id})`)
        console.log(`  - Son oyuncu: ${data.players[data.players.length-1].knownName} (ID: ${data.players[data.players.length-1].id})`)
        
        // Febas arama
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName}`)
        }
        
        // Düşük rating'li oyuncular (küçük takım oyuncuları)
        const lowRated = data.players.filter(p => p.rating && p.rating < 78)
        if (lowRated.length > 0) {
          console.log(`  📊 Düşük rating (< 78): ${lowRated.length} oyuncu`)
          lowRated.slice(0, 3).forEach(p => 
            console.log(`    - ${p.knownName} (${p.club}) Rating: ${p.rating}`)
          )
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.log(`Offset ${offset}: Error`)
    }
  }
  
  console.log(`\nTOPLAM UNIQUE OYUNCU: ${allPlayers.size}`)
  
  // En düşük rating'li oyuncuları göster
  const allPlayersArray = Array.from(allPlayers.values())
  const sortedByRating = allPlayersArray
    .filter(p => p.rating)
    .sort((a, b) => a.rating - b.rating)
  
  console.log('\nEN DÜŞÜK RATİNGLİ OYUNCULAR (küçük takımlar):')
  sortedByRating.slice(0, 10).forEach(p => 
    console.log(`  ${p.knownName} (${p.club}) - Rating: ${p.rating}`)
  )
}

testOffsetPagination()
