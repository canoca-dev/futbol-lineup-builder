// Basit search testi
async function testSearch() {
  console.log('🔍 Search ile daha fazla oyuncu var mı test...')
  
  const searches = ['messi', 'ronaldo', 'neymar', 'mbappe', 'benzema']
  let allFound = new Set()
  
  for (const search of searches) {
    try {
      const response = await fetch(`https://api.lineup-builder.co.uk/api/25/player?search=${search}&limit=100`)
      const data = await response.json()
      
      if (data.players) {
        console.log(`${search}: ${data.players.length} sonuç`)
        
        data.players.forEach(p => {
          allFound.add(`${p.id}-${p.knownName}`)
        })
        
        // İlk 3'ü göster
        data.players.slice(0, 3).forEach(p => {
          console.log(`  - ${p.knownName} (${p.club})`)
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log(`${search}: Error`)
    }
  }
  
  console.log(`\nToplam unique oyuncu: ${allFound.size}`)
  
  // Şimdi limit=1000 ile karşılaştır
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1000')
    const data = await response.json()
    
    console.log(`\nLimit=1000 sonucu: ${data.players?.length || 0} oyuncu`)
    console.log(`Search ile bulunan: ${allFound.size} oyuncu`)
    
    if (allFound.size > (data.players?.length || 0)) {
      console.log('🚨 Search ile daha fazla oyuncu bulundu!')
    } else {
      console.log('✅ Search ve limit=1000 aynı sonucu veriyor')
    }
  } catch (error) {
    console.log('Limit testi error')
  }
}

testSearch()
