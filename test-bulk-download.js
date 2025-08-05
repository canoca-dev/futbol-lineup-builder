// Test: Lineup-Builder API'den bulk data çekme
async function testBulkDownload() {
  console.log('🔍 Testing bulk download capabilities...')
  
  try {
    // Test 1: Yüksek limit ile test
    console.log('\n📊 Test 1: High limit test')
    const response1 = await fetch('https://api.lineup-builder.co.uk/api/25/player?limit=1000')
    const data1 = await response1.json()
    console.log(`✅ Limit 1000: ${data1.players?.length || 0} players`)
    
    // Test 2: Pagination test
    console.log('\n📄 Test 2: Pagination test')
    const response2 = await fetch('https://api.lineup-builder.co.uk/api/25/player?offset=100&limit=100')
    const data2 = await response2.json()
    console.log(`✅ Offset 100: ${data2.players?.length || 0} players`)
    
    // Test 3: All players endpoint test
    console.log('\n🌍 Test 3: All players endpoint test')
    const response3 = await fetch('https://api.lineup-builder.co.uk/api/25/players')
    const data3 = await response3.json()
    console.log(`✅ All players: ${data3.players?.length || 0} players`)
    
    // Test 4: Teams endpoint test
    console.log('\n⚽ Test 4: Teams endpoint test')
    const response4 = await fetch('https://api.lineup-builder.co.uk/api/25/teams')
    const data4 = await response4.json()
    console.log(`✅ Teams: ${data4.teams?.length || 0} teams`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testBulkDownload()
