'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Heart, Download, Share2, RotateCcw, Settings } from 'lucide-react'
import { useLineupStore } from '@/store/lineup-store'
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
    photo: "https://img.a.transfermarkt.technology/portrait/header/28003-1671435885.jpg",
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
    photo: "https://img.a.transfermarkt.technology/portrait/header/8198-1694609670.jpg",
    teamName: "Al Nassr",
    leagueName: "Saudi Pro League",
    shirtNumber: 7,
    isCustom: false
  },
  {
    id: 3,
    name: "Kylian Mbappé",
    firstName: "Kylian",
    lastName: "Mbappé",
    nationality: "France",
    position: "LW",
    photo: "https://img.a.transfermarkt.technology/portrait/header/342229-1671435885.jpg",
    teamName: "Real Madrid",
    leagueName: "La Liga",
    shirtNumber: 9,
    isCustom: false
  },
  {
    id: 4,
    name: "Erling Haaland",
    firstName: "Erling",
    lastName: "Haaland",
    nationality: "Norway",
    position: "ST",
    photo: "https://img.a.transfermarkt.technology/portrait/header/418560-1671435885.jpg",
    teamName: "Manchester City",
    leagueName: "Premier League",
    shirtNumber: 9,
    isCustom: false
  },
  {
    id: 5,
    name: "Kevin De Bruyne",
    firstName: "Kevin",
    lastName: "De Bruyne",
    nationality: "Belgium",
    position: "CAM",
    photo: "https://img.a.transfermarkt.technology/portrait/header/88755-1671435885.jpg",
    teamName: "Manchester City",
    leagueName: "Premier League",
    shirtNumber: 17,
    isCustom: false
  },
  {
    id: 6,
    name: "Virgil van Dijk",
    firstName: "Virgil",
    lastName: "van Dijk",
    nationality: "Netherlands",
    position: "CB",
    photo: "https://img.a.transfermarkt.technology/portrait/header/139208-1671435885.jpg",
    teamName: "Liverpool",
    leagueName: "Premier League",
    shirtNumber: 4,
    isCustom: false
  }
]

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

  // Initialize with mock data
  useEffect(() => {
    setAvailablePlayers(MOCK_PLAYERS)
  }, [setAvailablePlayers])

  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term)
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
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
              placeholder="Search players..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
            />
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
            <p>No players found</p>
            {activeTab === 'favorites' && (
              <p className="text-sm mt-2">Add players to favorites to see them here</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
