import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  try {
    console.log('🔍 Offline search for:', query)
    
    // 🚀 OFFLINE-FIRST: Local database'den ara
    const players = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { firstName: { contains: query } },
          { lastName: { contains: query } }
        ],
        isCustom: false // Sadece gerçek oyuncular
      },
      take: 20,
      orderBy: [
        { name: 'asc' }
      ]
    })

    console.log(`✅ Found ${players.length} players in local database`)

    const formattedPlayers = players.map(player => ({
      id: player.id,
      name: player.name,
      firstName: player.firstName || '',
      lastName: player.lastName || '',
      nationality: player.nationality,
      position: player.position || 'ST',
      teamName: 'Unknown', // TODO: Join team table
      leagueName: 'Unknown', // TODO: Join league table
      shirtNumber: player.shirtNumber,
      photoUrl: player.photo, // Yüksek kaliteli cached headshots!
      isCustom: false
    }))

    return NextResponse.json({ players: formattedPlayers })
    
  } catch (error) {
    console.error('❌ Offline search error:', error)
    
    // Fallback: Online API (backup)
    console.log('🌐 Falling back to online API...')
    return await fallbackToOnlineAPI(query)
  }
}

// Fallback function - SKIP parametresi ile arama
async function fallbackToOnlineAPI(query: string) {
  try {
    console.log('🌐 Using online API with SKIP method for comprehensive search...')
    
    // İlk olarak normal arama dene
    let response = await fetch(
      `https://api.lineup-builder.co.uk/api/25/player?search=${encodeURIComponent(query)}&limit=20`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    let data = await response.json()
    
    // Eğer normal arama sonuç vermezse, skip ile daha geniş arama yap
    if (!data.players || data.players.length === 0) {
      console.log('🔍 No results with search, trying skip-based search...')
      
      const allFoundPlayers = []
      const skipSteps = [0, 1000, 5000, 10000, 15000] // Farklı skip değerleri
      
      for (const skip of skipSteps) {
        try {
          const skipResponse = await fetch(
            `https://api.lineup-builder.co.uk/api/25/player?skip=${skip}&limit=500`
          )
          
          if (skipResponse.ok) {
            const skipData = await skipResponse.json()
            if (skipData.players) {
              // Query ile eşleşen oyuncuları filtrele
              const matchingPlayers = skipData.players.filter((player: any) => {
                const playerName = (player.knownName || player.shortName || '').toLowerCase()
                const clubName = (player.club || '').toLowerCase()
                const searchTerm = query.toLowerCase()
                
                return playerName.includes(searchTerm) || 
                       clubName.includes(searchTerm) ||
                       playerName.startsWith(searchTerm)
              })
              
              allFoundPlayers.push(...matchingPlayers)
              console.log(`📍 Skip ${skip}: Found ${matchingPlayers.length} matching players`)
              
              if (allFoundPlayers.length >= 20) break // Yeterli sonuç buldu
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 100)) // Rate limiting
        } catch (error) {
          console.log(`Skip ${skip} failed:`, error)
        }
      }
      
      // Duplicate'ları temizle
      const uniquePlayers = Array.from(
        new Map(allFoundPlayers.map((p: any) => [p.id, p])).values()
      )
      
      data = { players: uniquePlayers.slice(0, 20) }
    }
    
    if (!data.players || data.players.length === 0) {
      return NextResponse.json({ players: [] })
    }

    const players = data.players.map((player: any) => ({
      id: player.id,
      name: player.shortName || player.knownName,
      firstName: player.shortName?.split(' ')[0] || '',
      lastName: player.shortName?.split(' ').slice(1).join(' ') || '',
      nationality: player.nationality,
      position: mapLineupBuilderPosition(player.positions?.[0]),
      teamName: player.club || 'Unknown',
      leagueName: 'Unknown',
      shirtNumber: player.kitNumber || undefined,
      photoUrl: player.imgSrc,
      isCustom: false
    }))

    return NextResponse.json({ players })
    
  } catch (error) {
    console.error('❌ Fallback API also failed:', error)
    return NextResponse.json(
      { error: 'Search temporarily unavailable' }, 
      { status: 503 }
    )
  }
}

// Position mapping helper
function mapLineupBuilderPosition(apiPosition: string): string {
  if (!apiPosition) return 'ST'
  
  const position = apiPosition.toUpperCase()
  if (position === 'GK') return 'GK'
  if (position === 'CB' || position === 'LB' || position === 'RB') return position
  if (position === 'CDM' || position === 'CM' || position === 'CAM') return 'CM'
  if (position === 'LW' || position === 'RW') return position
  if (position === 'ST' || position === 'CF') return 'ST'
  
  return 'ST'
}
