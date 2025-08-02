import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FormationData, DEFAULT_FORMATION } from '@/lib/formations'

export interface Player {
  id: number
  name: string
  firstName?: string
  lastName?: string
  nationality?: string
  position?: string
  teamName?: string
  leagueName?: string
  shirtNumber?: number
  photoUrl?: string
  isCustom: boolean
}

export interface LineupPlayer extends Player {
  positionId: string
  x: number
  y: number
  isCaptain: boolean
  isBench: boolean
}

export interface LineupState {
  // Current lineup data
  title: string
  subtitle: string
  formation: FormationData
  players: LineupPlayer[]
  captain: number | null
  
  // UI state
  searchTerm: string
  selectedLeague: string
  selectedPosition: string
  selectedNationality: string
  draggedPlayer: Player | null
  showBench: boolean
  
  // Player data
  availablePlayers: Player[]
  favorites: number[]
  isLoading: boolean
  
  // Actions
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setFormation: (formation: FormationData) => void
  addPlayerToPosition: (player: Player, positionId: string) => void
  removePlayerFromPosition: (positionId: string) => void
  movePlayer: (fromPositionId: string, toPositionId: string) => void
  setCaptain: (playerId: number | null) => void
  toggleBench: (playerId: number) => void
  
  // Search and filters
  setSearchTerm: (term: string) => void
  setSelectedLeague: (league: string) => void
  setSelectedPosition: (position: string) => void
  setSelectedNationality: (nationality: string) => void
  
  // Drag and drop
  setDraggedPlayer: (player: Player | null) => void
  
  // Player management
  setAvailablePlayers: (players: Player[]) => void
  addToFavorites: (playerId: number) => void
  removeFromFavorites: (playerId: number) => void
  toggleFavorite: (playerId: number) => void
  
  // UI state
  setShowBench: (show: boolean) => void
  setIsLoading: (loading: boolean) => void
  
  // Lineup management
  clearLineup: () => void
  resetToFormation: () => void
  
  // Computed getters
  getFilteredPlayers: () => Player[]
  getPositionPlayer: (positionId: string) => LineupPlayer | null
  getAvailablePositions: () => string[]
}

export const useLineupStore = create<LineupState>()(
  devtools(
    (set, get) => ({
      // Initial state
      title: '',
      subtitle: '',
      formation: DEFAULT_FORMATION,
      players: [],
      captain: null,
      
      searchTerm: '',
      selectedLeague: '',
      selectedPosition: '',
      selectedNationality: '',
      draggedPlayer: null,
      showBench: false,
      
      availablePlayers: [],
      favorites: [],
      isLoading: false,
      
      // Actions
      setTitle: (title) => set({ title }),
      setSubtitle: (subtitle) => set({ subtitle }),
      
      setFormation: (formation) => {
        const currentPlayers = get().players
        // Keep players that can fit in new formation
        const newPlayers = currentPlayers.filter(player => 
          formation.positions.some(pos => pos.id === player.positionId)
        )
        set({ formation, players: newPlayers })
      },
      
      addPlayerToPosition: (player, positionId) => {
        const state = get()
        const position = state.formation.positions.find(p => p.id === positionId)
        if (!position) return
        
        // Remove player from any existing position
        const filteredPlayers = state.players.filter(p => p.id !== player.id)
        
        // Remove any player already in this position
        const playersWithoutPosition = filteredPlayers.filter(p => p.positionId !== positionId)
        
        const newLineupPlayer: LineupPlayer = {
          ...player,
          positionId,
          x: position.x,
          y: position.y,
          isCaptain: state.captain === player.id,
          isBench: false
        }
        
        set({ players: [...playersWithoutPosition, newLineupPlayer] })
      },
      
      removePlayerFromPosition: (positionId) => {
        const state = get()
        const newPlayers = state.players.filter(p => p.positionId !== positionId)
        set({ players: newPlayers })
      },
      
      movePlayer: (fromPositionId, toPositionId) => {
        const state = get()
        const playerToMove = state.players.find(p => p.positionId === fromPositionId)
        const targetPosition = state.formation.positions.find(p => p.id === toPositionId)
        
        if (!playerToMove || !targetPosition) return
        
        // Remove players from both positions
        const otherPlayers = state.players.filter(p => 
          p.positionId !== fromPositionId && p.positionId !== toPositionId
        )
        
        // Add moved player to new position
        const movedPlayer: LineupPlayer = {
          ...playerToMove,
          positionId: toPositionId,
          x: targetPosition.x,
          y: targetPosition.y
        }
        
        set({ players: [...otherPlayers, movedPlayer] })
      },
      
      setCaptain: (playerId) => {
        const state = get()
        const newPlayers = state.players.map(player => ({
          ...player,
          isCaptain: player.id === playerId
        }))
        set({ captain: playerId, players: newPlayers })
      },
      
      toggleBench: (playerId) => {
        const state = get()
        const newPlayers = state.players.map(player => 
          player.id === playerId 
            ? { ...player, isBench: !player.isBench }
            : player
        )
        set({ players: newPlayers })
      },
      
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedLeague: (selectedLeague) => set({ selectedLeague }),
      setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
      setSelectedNationality: (selectedNationality) => set({ selectedNationality }),
      
      setDraggedPlayer: (draggedPlayer) => set({ draggedPlayer }),
      
      setAvailablePlayers: (availablePlayers) => set({ availablePlayers }),
      
      addToFavorites: (playerId) => {
        const state = get()
        if (!state.favorites.includes(playerId)) {
          set({ favorites: [...state.favorites, playerId] })
        }
      },
      
      removeFromFavorites: (playerId) => {
        const state = get()
        set({ favorites: state.favorites.filter(id => id !== playerId) })
      },
      
      toggleFavorite: (playerId) => {
        console.log('toggleFavorite called with playerId:', playerId)
        const state = get()
        console.log('Current favorites:', state.favorites)
        if (state.favorites.includes(playerId)) {
          console.log('Removing from favorites')
          state.removeFromFavorites(playerId)
        } else {
          console.log('Adding to favorites')
          state.addToFavorites(playerId)
        }
        console.log('New favorites:', get().favorites)
      },
      
      setShowBench: (showBench) => set({ showBench }),
      setIsLoading: (isLoading) => set({ isLoading }),
      
      clearLineup: () => set({ 
        players: [], 
        captain: null, 
        title: '', 
        subtitle: '' 
      }),
      
      resetToFormation: () => {
        const state = get()
        set({ 
          players: [], 
          captain: null,
          formation: state.formation 
        })
      },
      
      // Computed getters
      getFilteredPlayers: () => {
        const state = get()
        let filtered = state.availablePlayers
        
        if (state.searchTerm) {
          const term = state.searchTerm.toLowerCase()
          filtered = filtered.filter(player => 
            player.name.toLowerCase().includes(term) ||
            player.firstName?.toLowerCase().includes(term) ||
            player.lastName?.toLowerCase().includes(term)
          )
        }
        
        if (state.selectedLeague) {
          filtered = filtered.filter(player => 
            player.leagueName === state.selectedLeague
          )
        }
        
        if (state.selectedPosition) {
          filtered = filtered.filter(player => 
            player.position === state.selectedPosition
          )
        }
        
        if (state.selectedNationality) {
          filtered = filtered.filter(player => 
            player.nationality === state.selectedNationality
          )
        }
        
        return filtered
      },
      
      getPositionPlayer: (positionId) => {
        const state = get()
        return state.players.find(p => p.positionId === positionId) || null
      },
      
      getAvailablePositions: () => {
        const state = get()
        const occupiedPositions = state.players.map(p => p.positionId)
        return state.formation.positions
          .map(p => p.id)
          .filter(id => !occupiedPositions.includes(id))
      }
    }),
    {
      name: 'lineup-store'
    }
  )
)
