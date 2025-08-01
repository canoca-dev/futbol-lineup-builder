'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { SoccerField } from '@/components/SoccerField'
import { ControlPanel } from '@/components/ControlPanel'
import { PlayerCard } from '@/components/PlayerCard'
import { useLineupStore } from '@/store/lineup-store'
import { Player } from '@/store/lineup-store'

export default function Home() {
  const {
    draggedPlayer,
    setDraggedPlayer,
    addPlayerToPosition,
    movePlayer,
    getPositionPlayer
  } = useLineupStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current
    
    if (data?.type === 'player') {
      setDraggedPlayer(data.player)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setDraggedPlayer(null)
      return
    }

    const activeData = active.data.current
    const overData = over.data.current

    // Handle dropping player from sidebar to position
    if (activeData?.type === 'player' && overData?.type === 'position') {
      const player: Player = activeData.player
      const positionId: string = overData.positionId
      addPlayerToPosition(player, positionId)
    }

    // Handle moving player between positions
    if (activeData?.type === 'position-player' && overData?.type === 'position') {
      const fromPositionId: string = activeData.positionId
      const toPositionId: string = overData.positionId
      movePlayer(fromPositionId, toPositionId)
    }

    setDraggedPlayer(null)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
              Futbol Lineup Builder
            </h1>
            <p className="text-gray-400 text-lg">
              Create your dream team formation with professional tools
            </p>
          </motion.header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Control Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <ControlPanel />
            </motion.div>

            {/* Soccer Field */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <SoccerField />
            </motion.div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          <AnimatePresence>
            {draggedPlayer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="transform rotate-3"
              >
                <PlayerCard 
                  player={draggedPlayer} 
                  isDragging={true}
                  className="shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DragOverlay>
      </main>
    </DndContext>
  )
}
