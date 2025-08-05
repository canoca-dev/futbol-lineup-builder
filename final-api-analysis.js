// SON TEST: Gerçekte API'de kaç oyuncu var?
console.log('🕵️ FINAL INVESTIGATION: APIde gerçekte kaç oyuncu var?')

async function finalTest() {
  // Test 1: Browser User-Agent ile dene
  console.log('\n📊 Test 1: Browser User-Agent simülasyonu')
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://lineup-builder.co.uk/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9'
  }
  
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=2000', { headers })
    const data = await response.json()
    console.log(`Browser headers ile: ${data.players?.length || 0} oyuncu`)
  } catch (error) {
    console.log('Browser test error')
  }
  
  // Test 2: Version 24'te gerçekten sadece 1 oyuncu var mı?
  console.log('\n📊 Test 2: Version 24 derinlemesine analiz')
  
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/24/player?limit=1000')
    const data = await response.json()
    console.log(`Version 24: ${data.players?.length || 0} oyuncu`)
    
    if (data.players && data.players.length > 0) {
      console.log('Version 24 oyuncuları:')
      data.players.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.knownName || 'N/A'} (ID: ${p.id})`)
      })
    }
  } catch (error) {
    console.log('Version 24 error')
  }
  
  // Test 3: SONUÇ ANALİZİ
  console.log('\n📊 Test 3: FINAL SONUÇ')
  
  try {
    // Version 25 ile tam test
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1000')
    const data = await response.json()
    
    if (data.players) {
      const uniqueIds = new Set(data.players.map(p => p.id))
      const uniqueNames = new Set(data.players.map(p => p.knownName))
      
      console.log(`✅ Version 25 KESIN SONUÇLAR:`)
      console.log(`   - Toplam dönen kayıt: ${data.players.length}`)
      console.log(`   - Unique ID sayısı: ${uniqueIds.size}`)
      console.log(`   - Unique isim sayısı: ${uniqueNames.size}`)
      console.log(`   - hasNext: ${data.hasNext}`)
      console.log(`   - Dublicate var mı: ${data.players.length !== uniqueIds.size ? 'EVET' : 'HAYIR'}`)
      
      // ID range
      const ids = Array.from(uniqueIds).sort((a, b) => a - b)
      console.log(`   - En küçük ID: ${ids[0]}`)
      console.log(`   - En büyük ID: ${ids[ids.length - 1]}`)
      console.log(`   - ID aralığı: ${ids[ids.length - 1] - ids[0]}`)
      
      // Star oyuncular var mı?
      const starPlayers = data.players.filter(p => 
        ['messi', 'ronaldo', 'haaland', 'mbappe', 'neymar'].some(star => 
          p.knownName.toLowerCase().includes(star)
        )
      )
      console.log(`   - Star oyuncu sayısı: ${starPlayers.length}`)
      starPlayers.forEach(p => console.log(`     * ${p.knownName}`))
      
      // Rating analizi
      const ratings = data.players.filter(p => p.rating).map(p => p.rating)
      if (ratings.length > 0) {
        const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        const maxRating = Math.max(...ratings)
        const minRating = Math.min(...ratings)
        console.log(`   - Rating aralığı: ${minRating}-${maxRating} (ortalama: ${avgRating})`)
      }
    }
  } catch (error) {
    console.log('Final test error')
  }
  
  console.log('\n🎯 SONUÇ: API analizi tamamlandı!')
}

finalTest()
