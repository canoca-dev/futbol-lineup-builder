// API'nin gerçek yapısını keşfet
async function discoverRealAPI() {
  console.log('🕵️ API\'nin gerçek yapısını keşfediyoruz...')
  
  // Test 1: lineup-builder.co.uk sitesini inceleyerek gerçek API çağrılarını bul
  console.log('\n📊 Test 1: Farklı endpoint kombinasyonları')
  
  const endpoints = [
    // Farklı versiyonlar
    '/api/24/player',
    '/api/23/player', 
    '/api/26/player',
    '/api/2024/player',
    '/api/2025/player',
    
    // Farklı endpoint isimleri
    '/api/25/players',
    '/api/25/all-players',
    '/api/25/search',
    '/api/25/football-players',
    
    // Farklı API yapıları
    '/players/api/25',
    '/football/api/25/player',
    '/data/api/25/player'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk${endpoint}?limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`✅ ${endpoint}: ${data.players.length} oyuncu`)
        
        // Farklı oyuncular var mı kontrol et
        const firstPlayer = data.players[0]
        if (firstPlayer.knownName !== 'Erling Haaland') {
          console.log(`  🚨 FARKLI DATA: İlk oyuncu ${firstPlayer.knownName}`)
        }
        
        // Febas var mı kontrol et
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName}`)
        }
      } else {
        console.log(`❌ ${endpoint}: ${data.message || 'No data'}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 2: Parametre kombinasyonları
  console.log('\n📊 Test 2: Parametre kombinasyonları')
  
  const paramTests = [
    '?all=true',
    '?includeAll=true',
    '?season=2024',
    '?competition=laliga',
    '?league=spain',
    '?team=elche',
    '?division=segunda',
    '?category=all'
  ]
  
  for (const params of paramTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player${params}&limit=100`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`✅ ${params}: ${data.players.length} oyuncu`)
        
        // Farklı oyuncular var mı?
        const uniqueClubs = new Set(data.players.map(p => p.club))
        console.log(`  Clubs: ${Array.from(uniqueClubs).slice(0, 5).join(', ')}`)
        
        // Elche oyuncuları var mı?
        const elchePlayers = data.players.filter(p => 
          p.club && p.club.toLowerCase().includes('elche')
        )
        if (elchePlayers.length > 0) {
          console.log(`  🎯 ELCHE OYUNCULARI BULUNDU: ${elchePlayers.length}`)
          elchePlayers.forEach(p => console.log(`    - ${p.knownName}`))
        }
      } else {
        console.log(`❌ ${params}: No data`)
      }
    } catch (error) {
      console.log(`❌ ${params}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 3: ID range testi - belki pagination ID bazlı
  console.log('\n📊 Test 3: ID bazlı sorgu testleri')
  
  const idTests = [
    '?minId=280000&maxId=290000',  // Büyük ID'ler
    '?fromId=280000',
    '?startId=280000&endId=300000',
    '?id_gt=280000',
    '?id_range=280000-300000'
  ]
  
  for (const idParam of idTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player${idParam}`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`✅ ${idParam}: ${data.players.length} oyuncu`)
        console.log(`  ID aralığı: ${data.players[0].id} - ${data.players[data.players.length-1].id}`)
        
        // Febas ID'si büyük olabilir
        const febas = data.players.find(p => 
          p.knownName && p.knownName.toLowerCase().includes('febas')
        )
        if (febas) {
          console.log(`  🎯 FEBAS BULUNDU: ${febas.knownName} (ID: ${febas.id})`)
        }
      } else {
        console.log(`❌ ${idParam}: No data`)
      }
    } catch (error) {
      console.log(`❌ ${idParam}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log('\n🔍 Eğer hiçbir yöntem işe yaramazsa, API\'nin gerçek limitasyonları var demektir.')
}

discoverRealAPI()
