// Tek seferde bütün oyuncuları çekmeyi dene
async function testFullDownload() {
  console.log('🔍 Tek seferde bütün oyuncuları çekmeyi test ediyoruz...')
  
  // Test 1: Limit olmadan
  console.log('\n📊 Test 1: Limit olmadan')
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player')
    const data = await response.json()
    console.log(`✅ Response alındı: ${data.players?.length || 0} oyuncu`)
    
    if (data.players && data.players.length > 0) {
      console.log(`İlk oyuncu: ${data.players[0].knownName}`)
      console.log(`Son oyuncu: ${data.players[data.players.length - 1].knownName}`)
      console.log(`hasNext: ${data.hasNext}`)
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }
  
  // Test 2: Çok büyük limit
  console.log('\n📊 Test 2: Çok büyük limit (10000)')
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=10000')
    const data = await response.json()
    console.log(`✅ Response alındı: ${data.players?.length || 0} oyuncu`)
    
    if (data.players && data.players.length > 0) {
      console.log(`İlk oyuncu: ${data.players[0].knownName}`)
      console.log(`Son oyuncu: ${data.players[data.players.length - 1].knownName}`)
      console.log(`hasNext: ${data.hasNext}`)
      
      // Unique kontrolü
      const uniqueIds = new Set(data.players.map(p => p.id))
      console.log(`Unique oyuncu sayısı: ${uniqueIds.size}`)
      console.log(`Dublicate var mı: ${data.players.length !== uniqueIds.size ? 'EVET' : 'HAYIR'}`)
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }
  
  // Test 3: Farklı limit değerleri
  console.log('\n📊 Test 3: Farklı limit değerleri')
  const limits = [100, 500, 1000, 2000, 5000]
  
  for (const limit of limits) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?limit=${limit}`)
      const data = await response.json()
      const count = data.players?.length || 0
      const hasNext = data.hasNext
      
      console.log(`Limit ${limit}: ${count} oyuncu, hasNext: ${hasNext}`)
      
      if (count > 0) {
        const uniqueIds = new Set(data.players.map(p => p.id))
        const hasDuplicates = count !== uniqueIds.size
        console.log(`  - Unique: ${uniqueIds.size}, Dublicate: ${hasDuplicates ? 'VAR' : 'YOK'}`)
        
        if (!hasNext) {
          console.log(`🎯 BÜTÜN OYUNCULAR BU LIMITTE ALINDI: ${count} oyuncu`)
          
          // İlk 10 ve son 10 oyuncuyu göster
          console.log('\n🔍 İlk 10 oyuncu:')
          data.players.slice(0, 10).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.knownName} (${p.club})`)
          })
          
          console.log('\n🔍 Son 10 oyuncu:')
          data.players.slice(-10).forEach((p, i) => {
            console.log(`  ${count - 9 + i}. ${p.knownName} (${p.club})`)
          })
          
          return // Test tamamlandı
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.log(`Limit ${limit}: Error - ${error.message}`)
    }
  }
  
  console.log('\n📊 Test 4: hasNext false olan minimum limit bulma')
  // Binary search ile tam sayıyı bul
  let low = 1000
  let high = 10000
  let totalFound = 0
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?limit=${mid}`)
      const data = await response.json()
      
      if (data.players && data.players.length > 0) {
        const count = data.players.length
        const hasNext = data.hasNext
        
        console.log(`Limit ${mid}: ${count} oyuncu, hasNext: ${hasNext}`)
        
        if (!hasNext) {
          // Bu limit'te tüm oyuncular geldi
          totalFound = count
          high = mid - 1
          console.log(`✅ Toplam oyuncu sayısı: ${count}`)
        } else {
          // Daha fazla oyuncu var
          low = mid + 1
        }
      } else {
        high = mid - 1
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.log(`⚠️ Error at limit ${mid}: ${error.message}`)
      high = mid - 1
    }
  }
  
  console.log(`\n🎯 SONUÇ: API'de toplam ${totalFound} oyuncu var`)
}

testFullDownload()
