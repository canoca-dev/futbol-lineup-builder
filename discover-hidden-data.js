// Gizli endpoint'leri ve parametreleri keşfet
async function discoverHiddenData() {
  console.log('🔍 Gizli endpoint ve parametreleri araştırıyoruz...')
  
  // Test 1: Farklı lig/sezon parametreleri
  console.log('\n📊 Test 1: Liga/Sezon parametreleri')
  const leagueTests = [
    '?league=premier-league',
    '?league=la-liga', 
    '?league=bundesliga',
    '?league=serie-a',
    '?league=ligue-1',
    '?season=2024',
    '?season=2025',
    '?year=2024',
    '?competition=1',
    '?tournament=1'
  ]
  
  for (const param of leagueTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player${param}&limit=100`)
      const data = await response.json()
      const count = data.players?.length || 0
      if (count > 0) {
        console.log(`✅ ${param}: ${count} oyuncu bulundu`)
        console.log(`   İlk oyuncu: ${data.players[0]?.knownName}`)
      } else {
        console.log(`❌ ${param}: Oyuncu bulunamadı`)
      }
    } catch (error) {
      console.log(`❌ ${param}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 2: Farklı endpoint kombinasyonları  
  console.log('\n📊 Test 2: Endpoint kombinasyonları')
  const endpoints = [
    '/api/25/players/all',
    '/api/25/database/players',
    '/api/25/search/players',
    '/api/25/football/players',
    '/api/25/soccer/players',
    '/api/v25/player',
    '/api/v2/player',
    '/api/latest/player',
    '/v1/player',
    '/player/all'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk${endpoint}?limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`✅ ${endpoint}: ${data.players.length} oyuncu`)
        console.log(`   İlk: ${data.players[0]?.knownName}`)
      } else if (data.error || data.message) {
        console.log(`❌ ${endpoint}: ${data.message || data.error}`)
      } else {
        console.log(`❌ ${endpoint}: Bilinmeyen format`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Network error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 3: Query parametreleri ile arama
  console.log('\n📊 Test 3: Query/Search parametreleri')
  const queryTests = [
    '?q=messi',
    '?search=ronaldo',
    '?name=haaland',
    '?query=all',
    '?filter=all',
    '?include=all',
    '?expand=true',
    '?full=true',
    '?complete=true'
  ]
  
  for (const query of queryTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player${query}`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`✅ ${query}: ${data.players.length} sonuç`)
        if (data.players.length !== 10) { // Default 10'dan farklıysa ilginç
          console.log(`   🚨 Farklı sonuç sayısı: ${data.players.length}`)
        }
      } else {
        console.log(`❌ ${query}: Sonuç yok`)
      }
    } catch (error) {
      console.log(`❌ ${query}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 4: ID range'lerdeki boşlukları tarayalım
  console.log('\n📊 Test 4: ID boşluklarında data arama')
  const gapTests = [
    { start: 25000, end: 30000 },   // İlk büyük boşluk
    { start: 80000, end: 85000 },   // Ortadaki boşluk
    { start: 280000, end: 285000 }  // Sonraki range
  ]
  
  for (const gap of gapTests) {
    try {
      // Bu ID range'de data var mı kontrol et
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?minId=${gap.start}&maxId=${gap.end}`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        console.log(`🚨 ID ${gap.start}-${gap.end} arasında ${data.players.length} gizli oyuncu bulundu!`)
        data.players.slice(0, 3).forEach(p => 
          console.log(`   - ${p.knownName} (ID: ${p.id})`)
        )
      } else {
        console.log(`❌ ID ${gap.start}-${gap.end}: Boş`)
      }
    } catch (error) {
      console.log(`❌ ID ${gap.start}-${gap.end}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  // Test 5: Authentication header'ları dene
  console.log('\n📊 Test 5: Auth header testleri')
  const authTests = [
    { 'X-API-Key': 'lineup-builder' },
    { 'Authorization': 'Bearer token' },
    { 'X-Client': 'web' },
    { 'User-Agent': 'lineup-builder-app' }
  ]
  
  for (const headers of authTests) {
    try {
      const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1100', {
        headers
      })
      const data = await response.json()
      
      if (data.players && data.players.length > 1000) {
        console.log(`🚨 Header ${JSON.stringify(headers)} ile ${data.players.length} oyuncu bulundu!`)
      } else {
        console.log(`❌ Header testi: ${data.players?.length || 0} oyuncu`)
      }
    } catch (error) {
      console.log(`❌ Header testi: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

discoverHiddenData()
