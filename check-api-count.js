// API'deki toplam oyuncu sayısını bul
async function checkApiTotalCount() {
  console.log('🔍 API toplam oyuncu sayısını kontrol ediyoruz...')
  
  try {
    // Method 1: Binary search ile maximum ID bul
    console.log('\n📊 Method 1: Binary search ile maximum bulma')
    let maxFound = await findMaxPlayers()
    console.log(`✅ Binary search result: ~${maxFound.toLocaleString()} players`)
    
    // Method 2: Çok büyük offset ile test
    console.log('\n📊 Method 2: Büyük offset testleri')
    const testOffsets = [100000, 200000, 300000, 400000, 500000, 1000000]
    
    for (const offset of testOffsets) {
      try {
        const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=1`)
        const data = await response.json()
        const count = data.players?.length || 0
        console.log(`Offset ${offset.toLocaleString()}: ${count} players ${count > 0 ? '✅' : '❌'}`)
        
        if (count === 0) {
          console.log(`🎯 Total players approximately: ${offset.toLocaleString()}`)
          break
        }
      } catch (error) {
        console.log(`Offset ${offset.toLocaleString()}: Error - ${error.message}`)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Method 3: Mevcut sync progress'imizle karşılaştır
    console.log('\n📊 Method 3: Current sync progress')
    console.log('Şu anda sync edilen: ~91,000 players')
    console.log('API hala veri döndürüyor, demek ki daha çok var')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function findMaxPlayers() {
  let low = 0
  let high = 1000000
  let maxFound = 0
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${mid}&limit=1`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        maxFound = mid
        low = mid + 1
        console.log(`✅ Found players at offset ${mid.toLocaleString()}`)
      } else {
        high = mid - 1
        console.log(`❌ No players at offset ${mid.toLocaleString()}`)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 50))
      
    } catch (error) {
      console.log(`⚠️ Error at offset ${mid.toLocaleString()}: ${error.message}`)
      high = mid - 1
    }
  }
  
  return maxFound
}

checkApiTotalCount()
