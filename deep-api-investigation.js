// API'nin gerçek durumunu derinlemesine araştır
async function deepApiInvestigation() {
  console.log('🕵️ APIning gerçek durumunu derinlemesine araştırıyoruz...')
  
  // Test 1: Farklı API versiyonları var mı?
  console.log('\n📊 Test 1: Farklı API versiyonları')
  const versions = [24, 25, 26, 23, 22]
  for (const version of versions) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/${version}/player?limit=50`)
      const data = await response.json()
      console.log(`Version ${version}: ${data.players?.length || 0} oyuncu ${data.hasNext ? '(hasNext: true)' : '(hasNext: false)'}`)
      
      if (data.players && data.players.length > 0) {
        console.log(`  İlk oyuncu: ${data.players[0].knownName}`)
      }
    } catch (error) {
      console.log(`Version ${version}: Error - ${error.message}`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 2: Farklı endpoint'ler var mı?
  console.log('\n📊 Test 2: Alternatif endpointler')
  const endpoints = [
    'player',
    'players', 
    'all-players',
    'search',
    'list'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/${endpoint}`)
      const data = await response.json()
      console.log(`/${endpoint}: Success - ${JSON.stringify(data).substring(0, 100)}...`)
    } catch (error) {
      console.log(`/${endpoint}: Error - ${error.message}`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 3: Parametre kombinasyonları
  console.log('\n📊 Test 3: Farklı parametre kombinasyonları')
  const paramTests = [
    '?limit=999',
    '?limit=1001', 
    '?limit=1500',
    '?limit=2000',
    '?limit=5000',
    '?offset=0&limit=2000',
    '?page=1&limit=1000',
    '?all=true',
    '?count=true'
  ]
  
  for (const params of paramTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player${params}`)
      const data = await response.json()
      const count = data.players?.length || 0
      console.log(`${params}: ${count} oyuncu, hasNext: ${data.hasNext}`)
      
      if (count > 1000) {
        console.log(`🚨 1000'den fazla bulundu: ${count}`)
        
        // İlk ve son 5'i göster
        if (data.players) {
          console.log('  İlk 5:')
          data.players.slice(0, 5).forEach((p, i) => 
            console.log(`    ${i+1}. ${p.knownName}`)
          )
          console.log('  Son 5:')
          data.players.slice(-5).forEach((p, i) => 
            console.log(`    ${count-4+i}. ${p.knownName}`)
          )
        }
      }
    } catch (error) {
      console.log(`${params}: Error - ${error.message}`)
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  // Test 4: Response header'larını incele
  console.log('\n📊 Test 4: Response headers analizi')
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1000')
    
    console.log('Response Headers:')
    for (const [key, value] of response.headers) {
      console.log(`  ${key}: ${value}`)
    }
    
    const data = await response.json()
    console.log(`\nResponse body keys: ${Object.keys(data)}`)
    console.log(`Total players: ${data.players?.length}`)
    console.log(`Has next: ${data.hasNext}`)
    console.log(`Has total: ${data.total}`)
    console.log(`Has count: ${data.count}`)
    console.log(`Has pagination: ${data.pagination}`)
    
  } catch (error) {
    console.log(`Headers test error: ${error.message}`)
  }
  
  // Test 5: ID range analizi
  console.log('\n📊 Test 5: ID range analizi')
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1000')
    const data = await response.json()
    
    if (data.players) {
      const ids = data.players.map(p => p.id).sort((a, b) => a - b)
      const minId = Math.min(...ids)
      const maxId = Math.max(...ids)
      const range = maxId - minId
      const gaps = []
      
      console.log(`ID Range: ${minId} - ${maxId} (range: ${range})`)
      console.log(`Toplam ID sayısı: ${ids.length}`)
      
      // Büyük ID boşluklarını bul
      for (let i = 1; i < ids.length; i++) {
        const gap = ids[i] - ids[i-1]
        if (gap > 1000) {
          gaps.push({ from: ids[i-1], to: ids[i], gap })
        }
      }
      
      console.log(`Büyük ID boşlukları (>1000):`)
      gaps.forEach(g => 
        console.log(`  ${g.from} -> ${g.to} (boşluk: ${g.gap})`)
      )
      
      // ID dağılımına bak
      const coverage = (ids.length / range * 100).toFixed(2)
      console.log(`ID coverage: ${coverage}%`)
      
      if (coverage < 10) {
        console.log('🚨 ID coverage çok düşük! Büyük boşluklar var, belki daha fazla data var?')
      }
    }
  } catch (error) {
    console.log(`ID range analizi error: ${error.message}`)
  }
}

deepApiInvestigation()
