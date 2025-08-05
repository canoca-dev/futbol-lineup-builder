// API'den gelen dublicate'leri analiz et
async function analyzeDuplicates() {
  console.log('🔍 API dublicate analizi başlıyor...')
  
  // Test 1: Aynı offset'i birden fazla kez çağır
  console.log('\n📊 Test 1: Aynı offseti tekrar çağırma')
  const testOffset = 1000
  const results = []
  
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${testOffset}&limit=5`)
      const data = await response.json()
      results.push({
        call: i + 1,
        players: data.players?.map(p => ({ id: p.id, name: p.name })) || []
      })
      console.log(`Call ${i + 1}: ${data.players?.length || 0} players`)
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.log(`Call ${i + 1}: Error - ${error.message}`)
    }
  }
  
  // Results karşılaştır
  console.log('\n🔍 Aynı offset sonuçları:')
  for (let i = 0; i < results.length; i++) {
    console.log(`\nCall ${i + 1}:`)
    results[i].players.forEach(p => console.log(`  - ${p.id}: ${p.name}`))
  }
  
  // Test 2: Farklı offset'lerde aynı oyuncular var mı?
  console.log('\n📊 Test 2: Farklı offsetlerde dublicate kontrolü')
  const offsetTests = [0, 100, 200, 500, 1000]
  const allPlayers = new Map()
  
  for (const offset of offsetTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=10`)
      const data = await response.json()
      
      console.log(`\nOffset ${offset}:`)
      if (data.players) {
        data.players.forEach(player => {
          const key = `${player.id}-${player.name}`
          if (allPlayers.has(key)) {
            console.log(`🚨 DUBLICATE BULUNDU: ${player.name} (ID: ${player.id})`)
            console.log(`   İlk görüldüğü offset: ${allPlayers.get(key)}`)
            console.log(`   Şimdi görüldüğü offset: ${offset}`)
          } else {
            allPlayers.set(key, offset)
            console.log(`  ✅ ${player.id}: ${player.name}`)
          }
        })
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log(`Offset ${offset}: Error - ${error.message}`)
    }
  }
  
  // Test 3: ID pattern analizi
  console.log('\n📊 Test 3: ID pattern analizi')
  try {
    const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=0&limit=50`)
    const data = await response.json()
    
    if (data.players) {
      const ids = data.players.map(p => p.id).sort((a, b) => a - b)
      console.log('İlk 50 oyuncunun IDleri (sıralı):')
      console.log(ids.join(', '))
      
      // ID'lerde boşluk var mı?
      const gaps = []
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] - ids[i-1] > 1) {
          gaps.push(`${ids[i-1]} -> ${ids[i]} (gap: ${ids[i] - ids[i-1] - 1})`)
        }
      }
      
      if (gaps.length > 0) {
        console.log('\n🔍 ID boşlukları bulundu:')
        gaps.forEach(gap => console.log(`  ${gap}`))
      } else {
        console.log('\n✅ IDler ardışık')
      }
    }
  } catch (error) {
    console.log('ID pattern analizi hatası:', error.message)
  }
  
  // Test 4: Pagination mantığı testi
  console.log('\n📊 Test 4: Pagination mantığı')
  const paginationTest = [
    { offset: 0, limit: 5 },
    { offset: 5, limit: 5 },
    { offset: 10, limit: 5 }
  ]
  
  const paginationResults = []
  
  for (const test of paginationTest) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${test.offset}&limit=${test.limit}`)
      const data = await response.json()
      
      paginationResults.push({
        ...test,
        players: data.players?.map(p => ({ id: p.id, name: p.name })) || []
      })
      
      console.log(`Offset ${test.offset}, Limit ${test.limit}: ${data.players?.length || 0} players`)
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.log(`Pagination test error: ${error.message}`)
    }
  }
  
  // Pagination overlap kontrolü
  console.log('\n🔍 Pagination overlap kontrolü:')
  const allPaginationPlayers = new Set()
  let overlapFound = false
  
  paginationResults.forEach((result, index) => {
    console.log(`\nOffset ${result.offset}:`)
    result.players.forEach(player => {
      const key = `${player.id}-${player.name}`
      if (allPaginationPlayers.has(key)) {
        console.log(`🚨 OVERLAP: ${player.name} (ID: ${player.id})`)
        overlapFound = true
      } else {
        allPaginationPlayers.add(key)
        console.log(`  ✅ ${player.id}: ${player.name}`)
      }
    })
  })
  
  if (!overlapFound) {
    console.log('\n✅ Paginationda overlap yok - Sayfalama düzgün çalışıyor')
  }
  
  console.log('\n📋 ÖZET RAPOR:')
  console.log(`- Toplam test edilen unique oyuncu: ${allPlayers.size}`)
  console.log(`- Pagination test edilen unique oyuncu: ${allPaginationPlayers.size}`)
  console.log(`- Overlap bulundu mu: ${overlapFound ? 'EVET' : 'HAYIR'}`)
}

analyzeDuplicates()
