// Web sitesinin frontend'inin kullandığı API çağrılarını simüle et
async function simulateWebsiteApiCalls() {
  console.log('🌐 Web sitesinin kullandığı API çağrılarını simüle ediyoruz...')
  
  // Test 1: Web sitesinin muhtemel çağırdığı endpoint'ler
  console.log('\n📊 Test 1: Frontend API çağrıları')
  const frontendTests = [
    '/api/25/player?limit=20',         // Sayfa başına 20
    '/api/25/player?offset=0&limit=50', // İlk sayfa  
    '/api/25/player?search=&limit=100', // Arama sayfası
    '/api/25/player?search=messi',      // Oyuncu arama
    '/api/25/player?position=ST',       // Pozisyona göre
    '/api/25/player?club=manchester',   // Kulübe göre
    '/api/25/clubs',                    // Kulüp listesi
    '/api/25/leagues',                  // Lig listesi
    '/api/25/positions',                // Pozisyon listesi
    '/api/25/stats'                     // İstatistikler
  ]
  
  for (const endpoint of frontendTests) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk${endpoint}`)
      const data = await response.json()
      
      if (data.players) {
        console.log(`✅ ${endpoint}: ${data.players.length} oyuncu`)
        if (data.total) {
          console.log(`   📊 Total: ${data.total}`)
        }
        if (data.count) {
          console.log(`   📊 Count: ${data.count}`)
        }
        if (data.hasNext !== undefined) {
          console.log(`   📊 HasNext: ${data.hasNext}`)
        }
      } else if (data.length && Array.isArray(data)) {
        console.log(`✅ ${endpoint}: ${data.length} items`)
      } else if (data.total) {
        console.log(`✅ ${endpoint}: Total=${data.total}`)
      } else {
        console.log(`❌ ${endpoint}: ${Object.keys(data).join(', ')}`)
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint}: Error`)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Test 2: Pagination ile daha fazla data var mı?
  console.log('\n📊 Test 2: Derinlemesine pagination testi')
  let totalUnique = new Set()
  let page = 0
  let hasMore = true
  let sameDataCount = 0
  
  while (hasMore && page < 20) { // Max 20 sayfa test et
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${page * 50}&limit=50`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        let newPlayersFound = 0
        
        for (const player of data.players) {
          const key = `${player.id}-${player.knownName}`
          if (!totalUnique.has(key)) {
            totalUnique.add(key)
            newPlayersFound++
          }
        }
        
        console.log(`Sayfa ${page + 1}: ${data.players.length} oyuncu, yeni: ${newPlayersFound}, toplam unique: ${totalUnique.size}`)
        
        if (newPlayersFound === 0) {
          sameDataCount++
          if (sameDataCount >= 3) {
            console.log('📋 3 sayfa boyunca yeni oyuncu yok, durduruluyor')
            break
          }
        } else {
          sameDataCount = 0
        }
        
        hasMore = data.hasNext
        page++
      } else {
        hasMore = false
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.log(`Sayfa ${page + 1}: Error`)
      break
    }
  }
  
  console.log(`\n📊 Pagination sonucu: ${totalUnique.size} unique oyuncu bulundu`)
  
  // Test 3: Farklı search terimleri ile data keşfi
  console.log('\n📊 Test 3: Search terimleri ile data keşfi')
  const searchTerms = [
    '', 'a', 'b', 'c', 'd', 'e', // Harflerle başlayanlar
    'manchester', 'real', 'barcelona', 'liverpool', // Büyük kulüpler
    'premier', 'liga', 'bundesliga', 'serie', // Ligler
    'striker', 'midfielder', 'defender', 'goalkeeper' // Pozisyonlar
  ]
  
  let searchUniqueTotal = new Set()
  
  for (const term of searchTerms) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?search=${term}&limit=200`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        let newFound = 0
        for (const player of data.players) {
          const key = `${player.id}-${player.knownName}`
          if (!searchUniqueTotal.has(key)) {
            searchUniqueTotal.add(key)
            newFound++
          }
        }
        
        console.log(`"${term}": ${data.players.length} sonuç, yeni: ${newFound}`)
        
        if (newFound > 0 && term !== '') {
          console.log(`   🔍 Yeni bulunan: ${data.players.slice(0, 3).map(p => p.knownName).join(', ')}`)
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 250))
    } catch (error) {
      console.log(`"${term}": Error`)
    }
  }
  
  console.log(`\n🎯 SEARCH SONUÇLARI:`)
  console.log(`- Normal pagination: ${totalUnique.size} unique oyuncu`)
  console.log(`- Search ile bulunan: ${searchUniqueTotal.size} unique oyuncu`)
  console.log(`- Toplam unique oyuncu: ${Math.max(totalUnique.size, searchUniqueTotal.size)}`)
  
  // Eğer search ile daha fazla bulunmuşsa, o data set'ini incele
  if (searchUniqueTotal.size > totalUnique.size) {
    console.log(`\n🚨 SEARCH ile ${searchUniqueTotal.size - totalUnique.size} ek oyuncu bulundu!`)
    console.log('Bu demek oluyor ki APIde daha fazla data var ama pagination ile erişilemiyor.')
  }
}

simulateWebsiteApiCalls()
