import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export class PlayerSyncService {
  private readonly API_BASE = 'https://api.lineup-builder.co.uk/api/25'
  private readonly BATCH_SIZE = 1000
  private readonly DELAY_MS = 100 // Rate limiting

  /**
   * 🚀 İlk kurulum: Tüm oyuncuları toplu indir (SKIP parametresi ile)
   */
  async initialBulkDownload(): Promise<void> {
    const syncLog = await this.createSyncLog('bulk_download')
    
    try {
      console.log('🏁 Starting initial bulk download with SKIP parameter...')
      
      let totalPlayers = 0
      let currentSkip = 0
      let hasMore = true
      const SKIP_BATCH_SIZE = 500 // Daha küçük batch size ile daha stabil

      while (hasMore) {
        console.log(`📥 Downloading batch: skip=${currentSkip}`)
        
        const response = await fetch(
          `${this.API_BASE}/player?skip=${currentSkip}&limit=${SKIP_BATCH_SIZE}`
        )
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        const players = data.players || []
        
        if (players.length === 0) {
          console.log(`📭 No more players at skip=${currentSkip}. Ending sync.`)
          hasMore = false
          break
        }

        // Batch insert/update
        await this.savePlayers(players)
        
        totalPlayers += players.length
        currentSkip += SKIP_BATCH_SIZE
        
        await this.updateSyncLog(syncLog.id, { 
          processedItems: totalPlayers 
        })
        
        console.log(`✅ Processed ${totalPlayers} players`)
        
        // Rate limiting
        await this.delay(this.DELAY_MS)
      }

      await this.completeSyncLog(syncLog.id, 'completed', totalPlayers)
      console.log(`🎉 Bulk download completed! Total: ${totalPlayers} players`)
      
    } catch (error: any) {
      console.error('❌ Bulk download failed:', error)
      await this.completeSyncLog(syncLog.id, 'failed', 0, error?.message || 'Unknown error')
      throw error
    }
  }

  /**
   * 📅 Günlük sync: Yeni oyuncular + foto güncellemeleri
   */
  async dailySync(): Promise<void> {
    const syncLog = await this.createSyncLog('daily_sync')
    
    try {
      console.log('📅 Starting daily sync...')
      
      const lastSync = await this.getLastSuccessfulSync()
      const cutoffDate = lastSync || new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 saat önce
      
      // 1. Yeni oyuncuları bul
      const newPlayers = await this.findNewPlayers(cutoffDate)
      console.log(`🆕 Found ${newPlayers.length} new players`)
      
      // 2. Foto güncellemelerini kontrol et
      const photoUpdates = await this.checkPhotoUpdates()
      console.log(`📷 Found ${photoUpdates.length} photo updates`)
      
      const totalItems = newPlayers.length + photoUpdates.length
      
      // 3. Yeni oyuncuları kaydet
      if (newPlayers.length > 0) {
        await this.savePlayers(newPlayers)
      }
      
      // 4. Fotoğrafları güncelle
      if (photoUpdates.length > 0) {
        await this.updatePhotos(photoUpdates)
      }
      
      await this.completeSyncLog(syncLog.id, 'completed', totalItems)
      console.log(`✅ Daily sync completed! ${totalItems} items processed`)
      
    } catch (error: any) {
      console.error('❌ Daily sync failed:', error)
      await this.completeSyncLog(syncLog.id, 'failed', 0, error?.message || 'Unknown error')
      throw error
    }
  }

  /**
   * 📷 Haftalık foto kontrolü: Tüm oyuncuların fotoğraflarını kontrol et
   */
  async weeklyPhotoCheck(): Promise<void> {
    const syncLog = await this.createSyncLog('photo_update')
    
    try {
      console.log('📷 Starting weekly photo check...')
      
      // Tüm oyuncuları batch'ler halinde kontrol et
      let offset = 0
      let totalUpdated = 0
      
      while (true) {
        const players = await prisma.player.findMany({
          where: { 
            isCustom: false,
            externalId: { not: null }
          },
          skip: offset,
          take: 100,
          orderBy: { lastSynced: 'asc' } // En eski sync'lenenler önce
        })
        
        if (players.length === 0) break
        
        for (const player of players) {
          const updated = await this.checkAndUpdatePlayerPhoto(player)
          if (updated) totalUpdated++
          
          // Rate limiting
          await this.delay(50)
        }
        
        offset += 100
        console.log(`📷 Checked ${offset} players, updated ${totalUpdated}`)
      }
      
      await this.completeSyncLog(syncLog.id, 'completed', totalUpdated)
      console.log(`✅ Photo check completed! ${totalUpdated} photos updated`)
      
    } catch (error: any) {
      console.error('❌ Photo check failed:', error)
      await this.completeSyncLog(syncLog.id, 'failed', 0, error?.message || 'Unknown error')
      throw error
    }
  }

  // Helper methods
  private async savePlayers(apiPlayers: any[]): Promise<void> {
    for (const apiPlayer of apiPlayers) {
      const photoHash = this.generatePhotoHash(apiPlayer.imgSrc)
      
      await prisma.player.upsert({
        where: { externalId: apiPlayer.id.toString() },
        update: {
          name: apiPlayer.shortName || apiPlayer.knownName,
          firstName: apiPlayer.shortName?.split(' ')[0] || '',
          lastName: apiPlayer.shortName?.split(' ').slice(1).join(' ') || '',
          nationality: apiPlayer.nationality,
          position: this.mapPosition(apiPlayer.positions?.[0]),
          shirtNumber: apiPlayer.kitNumber,
          photo: apiPlayer.imgSrc,
          photoHash,
          lastSynced: new Date(),
          updatedAt: new Date()
        },
        create: {
          externalId: apiPlayer.id.toString(),
          name: apiPlayer.shortName || apiPlayer.knownName,
          firstName: apiPlayer.shortName?.split(' ')[0] || '',
          lastName: apiPlayer.shortName?.split(' ').slice(1).join(' ') || '',
          nationality: apiPlayer.nationality,
          position: this.mapPosition(apiPlayer.positions?.[0]),
          shirtNumber: apiPlayer.kitNumber,
          photo: apiPlayer.imgSrc,
          photoHash,
          lastSynced: new Date(),
          isCustom: false
        }
      })
    }
  }

  private async findNewPlayers(since: Date): Promise<any[]> {
    // Skip parametresi ile son veriyi al ve yeni oyuncuları tespit et
    console.log('🔍 Checking for new players with SKIP method...')
    
    // Mevcut en büyük skip değerini bul
    const totalPlayers = await prisma.player.count({ where: { isCustom: false } })
    let searchSkip = Math.max(0, totalPlayers - 100) // Son 100'den başla
    
    let newPlayers = []
    let attempts = 0
    const maxAttempts = 10
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(
          `${this.API_BASE}/player?skip=${searchSkip}&limit=200`
        )
        
        if (!response.ok) break
        
        const data = await response.json()
        const apiPlayers = data.players || []
        
        if (apiPlayers.length === 0) break
        
        // Mevcut oyuncuları kontrol et
        const existingIds = await prisma.player.findMany({
          where: { 
            externalId: { 
              in: apiPlayers.map((p: any) => p.id.toString()) 
            }
          },
          select: { externalId: true }
        })
        
        const existingIdSet = new Set(existingIds.map(p => p.externalId))
        
        const newFound = apiPlayers.filter((player: any) => 
          !existingIdSet.has(player.id.toString())
        )
        
        newPlayers.push(...newFound)
        console.log(`📍 Skip ${searchSkip}: Found ${newFound.length} new players`)
        
        searchSkip += 200
        attempts++
        await this.delay(100)
        
      } catch (error) {
        console.error('Error in findNewPlayers:', error)
        break
      }
    }
    
    return newPlayers
  }

  private async checkPhotoUpdates(): Promise<any[]> {
    // Son 24 saatte güncellenmemiş oyuncuları kontrol et
    const players = await prisma.player.findMany({
      where: {
        isCustom: false,
        externalId: { not: null },
        lastSynced: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      take: 100, // Günde 100 oyuncu foto kontrolü
      orderBy: { lastSynced: 'asc' }
    })
    
    const updates = []
    
    for (const player of players) {
      try {
        const response = await fetch(
          `${this.API_BASE}/player?id=${player.externalId}`
        )
        const data = await response.json()
        const apiPlayer = data.players?.[0]
        
        if (apiPlayer && apiPlayer.imgSrc !== player.photo) {
          updates.push({
            playerId: player.id,
            newPhoto: apiPlayer.imgSrc,
            newPhotoHash: this.generatePhotoHash(apiPlayer.imgSrc)
          })
        }
        
        await this.delay(50) // Rate limiting
      } catch (error) {
        console.warn(`Failed to check photo for player ${player.id}:`, error)
      }
    }
    
    return updates
  }

  private async updatePhotos(updates: any[]): Promise<void> {
    for (const update of updates) {
      await prisma.player.update({
        where: { id: update.playerId },
        data: {
          photo: update.newPhoto,
          photoHash: update.newPhotoHash,
          lastSynced: new Date(),
          updatedAt: new Date()
        }
      })
    }
  }

  private async checkAndUpdatePlayerPhoto(player: any): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.API_BASE}/player?id=${player.externalId}`
      )
      const data = await response.json()
      const apiPlayer = data.players?.[0]
      
      if (apiPlayer) {
        const newPhotoHash = this.generatePhotoHash(apiPlayer.imgSrc)
        
        if (newPhotoHash !== player.photoHash) {
          await prisma.player.update({
            where: { id: player.id },
            data: {
              photo: apiPlayer.imgSrc,
              photoHash: newPhotoHash,
              lastSynced: new Date(),
              updatedAt: new Date()
            }
          })
          return true
        }
      }
      
      // Update lastSynced even if no photo change
      await prisma.player.update({
        where: { id: player.id },
        data: { lastSynced: new Date() }
      })
      
      return false
    } catch (error) {
      console.warn(`Failed to check photo for player ${player.id}:`, error)
      return false
    }
  }

  // Utility methods
  private generatePhotoHash(photoUrl: string): string {
    return crypto.createHash('md5').update(photoUrl || '').digest('hex')
  }

  private mapPosition(apiPosition: string): string {
    if (!apiPosition) return 'ST'
    const position = apiPosition.toUpperCase()
    if (position === 'GK') return 'GK'
    if (['CB', 'LB', 'RB'].includes(position)) return position
    if (['CDM', 'CM', 'CAM'].includes(position)) return 'CM'
    if (['LW', 'RW'].includes(position)) return position
    if (['ST', 'CF'].includes(position)) return 'ST'
    return 'ST'
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Sync log methods
  private async createSyncLog(operation: string): Promise<any> {
    return await prisma.syncLog.create({
      data: { operation, status: 'running' }
    })
  }

  private async updateSyncLog(id: number, data: any): Promise<void> {
    await prisma.syncLog.update({
      where: { id },
      data
    })
  }

  private async completeSyncLog(
    id: number, 
    status: string, 
    totalItems: number, 
    errorMessage?: string
  ): Promise<void> {
    await prisma.syncLog.update({
      where: { id },
      data: {
        status,
        totalItems,
        processedItems: totalItems,
        completedAt: new Date(),
        errorMessage
      }
    })
  }

  private async getLastSuccessfulSync(): Promise<Date | null> {
    const lastSync = await prisma.syncLog.findFirst({
      where: { 
        status: 'completed',
        operation: { in: ['daily_sync', 'bulk_download'] }
      },
      orderBy: { completedAt: 'desc' }
    })
    
    return lastSync?.completedAt || null
  }
}

export const playerSync = new PlayerSyncService()
