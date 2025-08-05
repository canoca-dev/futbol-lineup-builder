// API'deki oyuncuların kalitesini ve çeşitliliğini kontrol et
async function analyzePlayerQuality() {
  console.log('🔍 API oyuncularının kalitesini analiz ediyoruz...')
  
  try {
    // Farklı offset'lerden sample alarak çeşitliliği kontrol et
    const sampleOffsets = [0, 50000, 100000, 200000, 500000, 800000, 999000]
    
    console.log('\n📊 Farklı offsetlerden örnekler:')
    
    for (const offset of sampleOffsets) {
      try {
        const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?offset=${offset}&limit=10`)
        const data = await response.json()
        const players = data.players || []
        
        console.log(`\n🎯 Offset ${offset.toLocaleString()} - ${players.length} oyuncu:`)
        
        // Analiz et
        const analysis = analyzePlayerSample(players)
        console.log(`  ⚽ Positions: ${analysis.positions.join(', ')}`)
        console.log(`  🏟️ Clubs: ${analysis.clubs.slice(0, 3).join(', ')}${analysis.clubs.length > 3 ? '...' : ''}`)
        console.log(`  🌍 Countries: ${analysis.countries.slice(0, 3).join(', ')}${analysis.countries.length > 3 ? '...' : ''}`)
        console.log(`  📷 Photo rate: ${analysis.photoRate}%`)
        console.log(`  📝 Sample names: ${analysis.sampleNames.slice(0, 3).join(', ')}`)
        
        // Kalite göstergeleri
        if (analysis.suspiciousNames > 0) {
          console.log(`  ⚠️ Suspicious names: ${analysis.suspiciousNames}`)
        }
        
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.log(`❌ Error at offset ${offset}: ${error.message}`)
      }
    }
    
    // Sonuçları değerlendir
    console.log('\n🎯 SONUÇ DEĞERLENDİRMESİ:')
    console.log('1 milyon oyuncu şunları içerebilir:')
    console.log('• Aktif profesyonel futbolcular (~50K)')
    console.log('• Emekli futbolcular (~100K)')
    console.log('• Alt lig oyuncuları (~300K)')
    console.log('• Amatör / Yerel lig oyuncuları (~400K)')
    console.log('• Gençlik/Akademi oyuncuları (~150K)')
    console.log('• Test/Sahte veriler')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

function analyzePlayerSample(players) {
  const positions = [...new Set(players.map(p => p.positions?.[0]).filter(Boolean))]
  const clubs = [...new Set(players.map(p => p.club).filter(Boolean))]
  const countries = [...new Set(players.map(p => p.nationality).filter(Boolean))]
  const withPhotos = players.filter(p => p.imgSrc).length
  const photoRate = Math.round((withPhotos / players.length) * 100)
  const sampleNames = players.map(p => p.shortName || p.knownName).filter(Boolean)
  
  // Şüpheli isim patternları (test data, lorem ipsum vs.)
  const suspiciousPatterns = [
    /test/i, /lorem/i, /ipsum/i, /dummy/i, /fake/i, 
    /player\d+/i, /user\d+/i, /sample/i
  ]
  
  const suspiciousNames = players.filter(p => {
    const name = (p.shortName || p.knownName || '').toLowerCase()
    return suspiciousPatterns.some(pattern => pattern.test(name))
  }).length
  
  return {
    positions,
    clubs,
    countries,
    photoRate,
    sampleNames,
    suspiciousNames
  }
}

analyzePlayerQuality()
