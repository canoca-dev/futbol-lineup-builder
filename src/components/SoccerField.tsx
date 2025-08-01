'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { Crown, X } from 'lucide-react'
import { useLineupStore } from '@/store/lineup-store'
import { PlayerCard } from './PlayerCard'
import { cn } from '@/lib/utils'

interface PositionSlotProps {
  positionId: string
  x: number
  y: number
  role: string
}

function PositionSlot({ positionId, x, y, role }: PositionSlotProps) {
  const { getPositionPlayer, removePlayerFromPosition, setCaptain, captain } = useLineupStore()
  const player = getPositionPlayer(positionId)

  const { setNodeRef, isOver } = useDroppable({
    id: `position-${positionId}`,
    data: {
      type: 'position',
      positionId,
    },
  })

  const handleRemovePlayer = () => {
    if (player) {
      removePlayerFromPosition(positionId)
      if (captain === player.id) {
        setCaptain(null)
      }
    }
  }

  const handleSetCaptain = () => {
    if (player) {
      setCaptain(player.id === captain ? null : player.id)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 + (y / 100) * 0.5 }}
    >
      <div className={cn(
        "relative group",
        isOver && "scale-110"
      )}>
        {player ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
          >
            <PlayerCard 
              player={player} 
              size="md"
              className={cn(
                "shadow-lg",
                player.isCaptain && "ring-2 ring-yellow-500 ring-offset-2 ring-offset-transparent"
              )}
            />
            
            {/* Captain Crown */}
            {player.isCaptain && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-yellow-900" />
              </div>
            )}

            {/* Player Controls */}
            <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={handleSetCaptain}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  player.isCaptain 
                    ? "bg-yellow-500 text-yellow-900" 
                    : "bg-gray-600 text-white hover:bg-yellow-500 hover:text-yellow-900"
                )}
                title={player.isCaptain ? "Remove Captain" : "Make Captain"}
              >
                <Crown className="w-3 h-3" />
              </button>
              <button
                onClick={handleRemovePlayer}
                className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                title="Remove Player"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={cn(
              "w-20 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200",
              isOver 
                ? "border-emerald-400 bg-emerald-400/10 scale-110" 
                : "border-gray-500 hover:border-gray-400"
            )}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-xs font-medium text-gray-400 mb-1">
                {role}
              </div>
              <div className="text-xs text-gray-500">
                Drop player
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export function SoccerField() {
  const { formation, title, subtitle } = useLineupStore()

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {title || 'My Lineup'}
        </h2>
        <p className="text-gray-400">
          {subtitle || `Formation: ${formation.name}`}
        </p>
      </div>

      {/* Soccer Field */}
      <div className="relative mx-auto" style={{ aspectRatio: '3/4', maxWidth: '600px', height: '800px' }}>
        {/* Field Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 rounded-lg overflow-hidden">
          {/* Field Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400">
            {/* Outer boundary */}
            <rect 
              x="10" y="10" 
              width="280" height="380" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Center line */}
            <line 
              x1="10" y1="200" 
              x2="290" y2="200" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Center circle */}
            <circle 
              cx="150" cy="200" 
              r="30" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Center spot */}
            <circle cx="150" cy="200" r="2" fill="white" />
            
            {/* Penalty areas */}
            <rect 
              x="70" y="10" 
              width="160" height="60" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            <rect 
              x="70" y="330" 
              width="160" height="60" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Goal areas */}
            <rect 
              x="110" y="10" 
              width="80" height="25" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            <rect 
              x="110" y="365" 
              width="80" height="25" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Penalty spots */}
            <circle cx="150" cy="50" r="2" fill="white" />
            <circle cx="150" cy="350" r="2" fill="white" />
            
            {/* Corner arcs */}
            <path d="M 10 20 A 10 10 0 0 1 20 10" fill="none" stroke="white" strokeWidth="2" />
            <path d="M 280 10 A 10 10 0 0 1 290 20" fill="none" stroke="white" strokeWidth="2" />
            <path d="M 290 380 A 10 10 0 0 1 280 390" fill="none" stroke="white" strokeWidth="2" />
            <path d="M 20 390 A 10 10 0 0 1 10 380" fill="none" stroke="white" strokeWidth="2" />
          </svg>

          {/* Grass Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 49.9%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 50.1%, transparent 50.2%),
                linear-gradient(0deg, transparent 49.9%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 50.1%, transparent 50.2%)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* Player Positions */}
        <AnimatePresence>
          {formation.positions.map((position) => (
            <PositionSlot
              key={position.id}
              positionId={position.id}
              x={position.x}
              y={position.y}
              role={position.role}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Formation Info */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400">
          {formation.description}
        </div>
      </div>
    </div>
  )
}
