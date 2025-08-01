'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Heart, Download, Share2, RotateCcw, Settings } from 'lucide-react'
import { useLineupStore, Player } from '@/store/lineup-store'
import { FORMATIONS } from '@/lib/formations'
import { PlayerCard } from './PlayerCard'
import { cn, debounce } from '@/lib/utils'

// Mock player data - In real app, this would come from API
const MOCK_PLAYERS = [
  {
    id: 1,
    name: "Lionel Messi",
    firstName: "Lionel",
    lastName: "Messi",
    nationality: "Argentina",
    position: "RW",
    teamName: "Inter Miami",
    leagueName: "MLS",
    shirtNumber: 10,
    isCustom: false
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    firstName: "Cristiano",
    lastName: "Ronaldo",
    nationality: "Portugal",
    position: "ST",
    teamName: "Al Nassr",
    leagueName: "Saudi Pro League",
    shirtNumber: 7,
    isCustom: false
  }
]

// Football API search function
async function searchPlayers(query: string): Promise<Player[]> {
  if (!query || query.length < 2) return []
  
  try {
    console.log('Searching for:', query)
    
    // Use our Next.js API route instead of direct API call
    const response = await fetch(`/api/search-players?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    console.log('Processed players:', data.players)
    return data.players || []
  } catch (error) {
    console.error('Error searching players:', error)
    throw error // Re-throw to be handled by the calling function
  }
}

export function ControlPanel() {
  const {
    title,
    subtitle,
    formation,
    selectedLeague,
    selectedPosition,
    selectedNationality,
    availablePlayers,
    favorites,
    isLoading,
    setTitle,
    setSubtitle,
    setFormation,
    setSearchTerm,
    setSelectedLeague,
    setSelectedPosition,
    setSelectedNationality,
    setAvailablePlayers,
    toggleFavorite,
    clearLineup,
    resetToFormation,
    getFilteredPlayers
  } = useLineupStore()

  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Initialize with empty array - players will come from search
  useEffect(() => {
    setAvailablePlayers([])
  }, [setAvailablePlayers])

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPlayerSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setAvailablePlayers(MOCK_PLAYERS.slice(0, 2)) // Show just 2 examples
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        console.log('Starting search for:', query)
        const players = await searchPlayers(query)
        console.log('Search completed, found:', players.length, 'players')
        setAvailablePlayers(players)
      } catch (error) {
        console.error('Search failed:', error)
        setAvailablePlayers([])
        // Show error message to user
        alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsSearching(false)
      }
    }, 500),
    [setAvailablePlayers]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setSearchTerm(query)
    debouncedPlayerSearch(query)
  }

  const filteredPlayers = getFilteredPlayers()
  const favoritePlayers = filteredPlayers.filter(player => favorites.includes(player.id))
  const displayPlayers = activeTab === 'favorites' ? favoritePlayers : filteredPlayers

  const leagues = [...new Set(availablePlayers.map(p => p.leagueName).filter(Boolean))]
  const positions = [...new Set(availablePlayers.map(p => p.position).filter(Boolean))]
  const nationalities = [...new Set(availablePlayers.map(p => p.nationality).filter(Boolean))]

  const handleExport = () => {
    // TODO: Implement image export using html2canvas
    console.log('Export lineup as image')
  }

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share lineup')
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl h-full max-h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Lineup Builder</h3>
        
        {/* Squad Info */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Squad title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Squad subtitle..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Formation Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Formation
        </label>
        <select
          value={formation.id}
          onChange={(e) => {
            const newFormation = FORMATIONS.find(f => f.id === e.target.value)
            if (newFormation) setFormation(newFormation)
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
        >
          {FORMATIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
        <button
          onClick={resetToFormation}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
        <button
          onClick={clearLineup}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Clear</span>
        </button>
      </div>

      {/* Player Search and Filters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search players (e.g. Messi, Ronaldo)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
              showFilters 
                ? "bg-emerald-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 mb-4"
            >
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Leagues</option>
                {leagues.map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
              
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Positions</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
              
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Countries</option>
                {nationalities.map(nationality => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Tabs */}
      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === 'all' 
              ? "bg-emerald-600 text-white" 
              : "text-gray-300 hover:text-white"
          )}
        >
          All Players ({filteredPlayers.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={cn(
            "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1",
            activeTab === 'favorites' 
              ? "bg-emerald-600 text-white" 
              : "text-gray-300 hover:text-white"
          )}
        >
          <Heart className="w-4 h-4" />
          Favorites ({favoritePlayers.length})
        </button>
      </div>

      {/* Player List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading || isSearching ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <span className="ml-2 text-gray-400">
              {isSearching ? 'Searching players...' : 'Loading...'}
            </span>
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-lg font-medium mb-2">Search for Players</p>
            <p className="text-sm">Type at least 2 characters to search for football players</p>
            <p className="text-xs mt-2 text-gray-500">Try: Messi, Ronaldo, Haaland, etc.</p>
            
            {/* Show sample players */}
            {displayPlayers.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Sample players:</p>
                <div className="grid grid-cols-2 gap-3">
                  {displayPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      size="sm"
                      isFavorite={favorites.includes(player.id)}
                      onToggleFavorite={() => toggleFavorite(player.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : displayPlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {displayPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                size="sm"
                isFavorite={favorites.includes(player.id)}
                onToggleFavorite={() => toggleFavorite(player.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No players found for &quot;{searchQuery}&quot;</p>
            {activeTab === 'favorites' ? (
              <p className="text-sm mt-2">Add players to favorites to see them here</p>
            ) : (
              <p className="text-sm mt-2">Try searching for different keywords</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
