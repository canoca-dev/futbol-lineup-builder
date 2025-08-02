'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { Heart } from 'lucide-react'
import { Player } from '@/store/lineup-store'
import { cn, getPositionColor } from '@/lib/utils'
import Image from 'next/image'

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

  const avatarSizeClasses = {
    sm: 'w-14 h-14', // 56px 
    md: 'w-16 h-16', // 64px
    lg: 'w-20 h-20'  // 80px
  }

  const initialsFontSize = {
    sm: 'text-sm',
    md: 'text-lg', 
    lg: 'text-xl'
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
        "bg-gray-800 rounded-lg border-2 border-emerald-500 p-1 shadow-lg",
        className
      )}>
        <div className="flex flex-col items-center justify-center h-full">
          <div 
            className={cn("rounded-full border-2 border-emerald-400 mb-2 overflow-hidden", avatarSizeClasses[size])}
          >
            {player.photoUrl ? (
              <Image 
                src={player.photoUrl}
                alt={player.name}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to CSS avatar if image fails to load
                  e.currentTarget.style.display = 'none'
                  const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallbackDiv) fallbackDiv.style.display = 'flex'
                }}
              />
            ) : null}
            
            {/* Fallback CSS Avatar */}
            <div 
              className={cn(
                "w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center rounded-full",
                player.photoUrl ? "hidden" : "flex"
              )}
            >
              <span className={cn("text-white font-bold", initialsFontSize[size])}>
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
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
        "bg-gray-800 rounded-lg border border-gray-600 hover:border-emerald-500 p-1 cursor-grab active:cursor-grabbing transition-all duration-200 group",
        isBeingDragged && "opacity-50 scale-95",
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="flex flex-col items-center h-full relative">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Favorite button clicked for player:', player.name, 'ID:', player.id)
              console.log('onToggleFavorite function:', onToggleFavorite)
              console.log('Current isFavorite state:', isFavorite)
              if (onToggleFavorite) {
                onToggleFavorite()
              } else {
                console.log('No onToggleFavorite function provided!')
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            className="absolute -top-1 -right-1 z-[60] w-6 h-6 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center hover:border-red-500 transition-colors cursor-pointer"
          >
            <Heart 
              className={cn(
                "w-4 h-4 pointer-events-none",
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
              )}
            />
          </button>
        )}

        {/* Player Avatar - Büyütülmüş */}
        <div 
          className={cn("rounded-full border-2 border-gray-600 group-hover:border-emerald-400 transition-colors overflow-hidden relative", avatarSizeClasses[size])}
        >
          {player.photoUrl ? (
            <Image 
              src={player.photoUrl}
              alt={player.name}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback to CSS avatar if image fails to load
                console.log('Image failed to load for:', player.name)
                e.currentTarget.style.display = 'none'
                const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement
                if (fallbackDiv) fallbackDiv.style.display = 'flex'
              }}
            />
          ) : null}
          
          {/* Fallback CSS Avatar */}
          <div 
            className={cn(
              "w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center rounded-full",
              player.photoUrl ? "hidden" : "flex"
            )}
          >
            <span className={cn("text-white font-bold", initialsFontSize[size])}>
              {player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          
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

        {/* Player Name - Altta */}
        <div className="text-center mt-1">
          <span className={cn(textSizes[size], "font-medium text-white block leading-tight")}>
            {player.name.split(' ').pop()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
