'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { Heart } from 'lucide-react'
import { Player } from '@/store/lineup-store'
import { cn, getPositionColor, generatePlayerAvatar } from '@/lib/utils'

interface PlayerCardProps {
  player: Player
  isDragging?: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PlayerCard({ 
  player, 
  isDragging = false, 
  isFavorite = false,
  onToggleFavorite,
  className,
  size = 'md'
}: PlayerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: `player-${player.id}`,
    data: {
      type: 'player',
      player,
    },
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const sizeStyles = {
    sm: 'w-16 h-20',
    md: 'w-20 h-24',
    lg: 'w-24 h-28'
  }

  const avatarSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (isDragging) {
    return (
      <div className={cn(
        sizeStyles[size],
        "bg-gray-800 rounded-lg border-2 border-emerald-500 p-2 shadow-lg",
        className
      )}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className={cn(
            avatarSizes[size],
            "rounded-full bg-gray-700 border-2 border-emerald-400 mb-1 flex items-center justify-center overflow-hidden"
          )}>
            {player.photo ? (
              <Image 
                src={player.photo} 
                alt={player.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image 
                src={generatePlayerAvatar(player.name)} 
                alt={player.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className={cn(textSizes[size], "font-medium text-emerald-300 text-center leading-tight")}>
            {player.name.split(' ').pop()}
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        sizeStyles[size],
        "bg-gray-800 rounded-lg border border-gray-600 hover:border-emerald-500 p-2 cursor-grab active:cursor-grabbing transition-all duration-200 group",
        isBeingDragged && "opacity-50 scale-95",
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="flex flex-col items-center justify-between h-full relative">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center hover:border-red-500 transition-colors"
          >
            <Heart 
              className={cn(
                "w-3 h-3",
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
              )}
            />
          </button>
        )}

        {/* Player Avatar */}
        <div className={cn(
          avatarSizes[size],
          "rounded-full border-2 border-gray-600 group-hover:border-emerald-400 transition-colors mb-1 flex items-center justify-center overflow-hidden relative"
        )}>
          {player.photo ? (
            <Image 
              src={player.photo} 
              alt={player.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image 
              src={generatePlayerAvatar(player.name)} 
              alt={player.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Position Badge */}
          {player.position && (
            <div className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center",
              getPositionColor(player.position)
            )}>
              {player.position}
            </div>
          )}
        </div>

        {/* Player Name */}
        <div className="text-center">
          <span className={cn(textSizes[size], "font-medium text-white block leading-tight")}>
            {player.name.split(' ').pop()}
          </span>
          {player.nationality && (
            <span className="text-xs text-gray-400">
              {player.nationality}
            </span>
          )}
        </div>

        {/* Team Info */}
        {player.teamName && (
          <span className="text-xs text-gray-500 text-center leading-tight">
            {player.teamName}
          </span>
        )}
      </div>
    </motion.div>
  )
}
