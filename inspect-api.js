// API response yapısını incele
async function inspectApiResponse() {
  console.log('🔍 API response yapısını inceliyoruz...')
  
  try {
    const response = await fetch('https://api.lineup-builder.co.uk/api/25/player?offset=0&limit=3')
    const data = await response.json()
    
    console.log('\n📋 Ham API Response:')
    console.log(JSON.stringify(data, null, 2))
    
    if (data.players && data.players.length > 0) {
      console.log('\n🔍 İlk oyuncunun tüm field\'ları:')
      console.log(JSON.stringify(data.players[0], null, 2))
      
      console.log('\n📊 Player object keys:')
      console.log(Object.keys(data.players[0]))
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message)
  }
}

inspectApiResponse()
