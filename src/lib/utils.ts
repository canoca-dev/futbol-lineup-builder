import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPosition(position: string): string {
  const positionMap: Record<string, string> = {
    'GK': 'Goalkeeper',
    'RB': 'Right Back',
    'CB': 'Centre Back',
    'LB': 'Left Back',
    'CDM': 'Defensive Midfielder',
    'CM': 'Central Midfielder',
    'CAM': 'Attacking Midfielder',
    'RM': 'Right Midfielder',
    'LM': 'Left Midfielder',
    'RW': 'Right Winger',
    'LW': 'Left Winger',
    'CF': 'Centre Forward',
    'ST': 'Striker',
  }
  
  return positionMap[position] || position
}

export function getPositionColor(position: string): string {
  const colorMap: Record<string, string> = {
    'GK': 'bg-yellow-500',
    'RB': 'bg-blue-500',
    'CB': 'bg-blue-500',
    'LB': 'bg-blue-500',
    'CDM': 'bg-green-500',
    'CM': 'bg-green-500',
    'CAM': 'bg-green-500',
    'RM': 'bg-green-500',
    'LM': 'bg-green-500',
    'RW': 'bg-purple-500',
    'LW': 'bg-purple-500',
    'CF': 'bg-red-500',
    'ST': 'bg-red-500',
  }
  
  return colorMap[position] || 'bg-gray-500'
}

export function generatePlayerAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return `https://ui-avatars.com/api/?name=${initials}&background=1f2937&color=ffffff&size=100`
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
