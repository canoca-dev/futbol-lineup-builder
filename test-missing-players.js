// SKIP parametresi ile API testleri
async function testSkipPagination() {
  console.log('🔍 SKIP parametresi ile API testini yapıyoruz...')
  
  // Test 1: Skip parametresi ile pagination
  console.log('\n📊 Test 1: Skip parametresi ile farklı sayfalar')
  
  const allPlayers = new Map()
  const skipValues = [0, 100, 200, 500, 1000, 1500, 2000, 3000]
  
  for (const skip of skipValues) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?skip=${skip}&limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        let newPlayers = 0
        
        for (const player of data.players) {
          if (!allPlayers.has(player.id)) {
            allPlayers.set(player.id, player)
            newPlayers++
          }
        }
        
        console.log(`Skip ${skip}: ${data.players.length} oyuncu, yeni: ${newPlayers}, toplam unique: ${allPlayers.size}`)
        console.log(`  İlk: ${data.players[0].knownName} (ID: ${data.players[0].id})`)
        console.log(`  Son: ${data.players[data.players.length-1].knownName} (ID: ${data.players[data.players.length-1].id})`)
        
        // Febas arama
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName} (${febas.club})`)
        }
        
        // Elche oyuncuları
        const elchePlayers = data.players.filter(p => 
          p.club && p.club.toLowerCase().includes('elche')
        )
        if (elchePlayers.length > 0) {
          console.log(`  🎯 ELCHE OYUNCULARI: ${elchePlayers.length}`)
          elchePlayers.forEach(ep => console.log(`    - ${ep.knownName}`))
        }
        
        // Düşük rating'li oyuncular (küçük takımlar)
        const lowRated = data.players.filter(p => p.rating && p.rating < 80)
        if (lowRated.length > 0) {
          console.log(`  📊 Düşük rating (<80): ${lowRated.length}`)
          lowRated.slice(0, 2).forEach(p => 
            console.log(`    - ${p.knownName} (${p.club}) ${p.rating}`)
          )
        }
        
      } else {
        console.log(`Skip ${skip}: Veri yok`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 400))
    } catch (error) {
      console.log(`Skip ${skip}: Error - ${error.message}`)
    }
  }
  
  
  console.log(`\n📊 SKIP TESTI SONUCU: ${allPlayers.size} unique oyuncu bulundu`)
  
  // Test 2: Büyük skip değerleri ile test
  console.log('\n📊 Test 2: Büyük skip değerleri ile daha fazla data arama')
  
  const bigSkips = [5000, 10000, 15000, 20000, 25000, 30000]
  
  for (const skip of bigSkips) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?skip=${skip}&limit=100`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`Skip ${skip}: ${data.players.length} oyuncu bulundu!`)
        console.log(`  İlk: ${data.players[0].knownName} (${data.players[0].club})`)
        
        // Febas var mı?
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName}`)
        }
        
        // Yeni kulüpler var mı?
        const clubs = new Set(data.players.map(p => p.club))
        console.log(`  Kulüpler: ${Array.from(clubs).slice(0, 3).join(', ')}...`)
        
      } else {
        console.log(`Skip ${skip}: Veri yok`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.log(`Skip ${skip}: Error`)
    }
  }
  
  // Test 3: Page parametresi de deneyelim
  console.log('\n📊 Test 3: Page parametresi ile test')
  
  const pages = [1, 2, 3, 5, 10, 20, 50]
  
  for (const page of pages) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?page=${page}&limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`Page ${page}: ${data.players.length} oyuncu`)
        console.log(`  İlk: ${data.players[0].knownName}`)
        
        // Bu sayfada Febas var mı?
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName}`)
        }
        
      } else {
        console.log(`Page ${page}: Veri yok`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.log(`Page ${page}: Error`)
    }
  }
}

testSkipPagination()
