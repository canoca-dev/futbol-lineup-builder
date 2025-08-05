// Doğru field mapping ile offset testi
async function testOffsetWithCorrectMapping() {
  console.log('🔍 Doğru field mapping ile offset testi...')
  
  const testOffsets = [0, 10, 20]
  
  for (const offset of testOffsets) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=5`)
      const data = await response.json()
      
      console.log(`\n📊 Offset ${offset}:`)
      if (data.players) {
        data.players.forEach((player, index) => {
          console.log(`  ${index + 1}. ID: ${player.id} - ${player.knownName} (${player.club})`)
        })
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log(`Offset ${offset}: Error - ${error.message}`)
    }
  }
  
  // Dublicate kontrolü
  console.log('\n🔍 Dublicate analizi (doğru field mapping ile):')
  const allPlayers = new Set()
  let duplicateFound = false
  
  for (const offset of [0, 5, 10]) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=5`)
      const data = await response.json()
      
      console.log(`\nOffset ${offset}:`)
      if (data.players) {
        data.players.forEach(player => {
          const key = `${player.id}-${player.knownName}`
          if (allPlayers.has(key)) {
            console.log(`🚨 DUBLICATE: ${player.knownName} (ID: ${player.id})`)
            duplicateFound = true
          } else {
            allPlayers.add(key)
            console.log(`  ✅ ${player.id}: ${player.knownName}`)
          }
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log(`Error at offset ${offset}: ${error.message}`)
    }
  }
  
  console.log(`\n📋 SONUÇ: Dublicate bulundu mu? ${duplicateFound ? 'EVET' : 'HAYIR'}`)
}

testOffsetWithCorrectMapping()
