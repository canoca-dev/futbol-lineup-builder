import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  try {
    console.log('Server-side search for:', query)
    
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response received:', !!data.player)

    if (!data.player) {
      return NextResponse.json({ players: [] })
    }

    const players = data.player.slice(0, 20).map((player: Record<string, string>, index: number) => {
      const photoUrl = player.strThumb || player.strCutout || null
      console.log(`Player: ${player.strPlayer}, Photo: ${photoUrl}`)
      
      return {
        id: Date.now() + index,
        name: player.strPlayer,
        firstName: player.strPlayer?.split(' ')[0] || '',
        lastName: player.strPlayer?.split(' ').slice(1).join(' ') || '',
        nationality: player.strNationality,
        position: mapPosition(player.strPosition),
        teamName: player.strTeam,
        leagueName: player.strLeague || 'Unknown',
        shirtNumber: parseInt(player.strNumber || '0') || undefined,
        photoUrl: photoUrl,
        isCustom: false
      }
    })

    return NextResponse.json({ players })
  } catch (error) {
    console.error('Server-side search error:', error)
    return NextResponse.json(
      { error: 'Failed to search players' }, 
      { status: 500 }
    )
  }
}

// Map API positions to our position format
function mapPosition(apiPosition: string): string {
  if (!apiPosition) return 'ST'
  
  const position = apiPosition.toLowerCase()
  if (position.includes('goalkeeper') || position.includes('keeper')) return 'GK'
  if (position.includes('defender') || position.includes('back')) return 'CB'
  if (position.includes('midfielder') || position.includes('midfield')) return 'CM'
  if (position.includes('forward') || position.includes('striker') || position.includes('winger')) return 'ST'
  if (position.includes('left') && position.includes('back')) return 'LB'
  if (position.includes('right') && position.includes('back')) return 'RB'
  if (position.includes('left') && position.includes('wing')) return 'LW'
  if (position.includes('right') && position.includes('wing')) return 'RW'
  
  return 'ST' // Default position
}
