// Comprehensive sync with SKIP parameter
import { PlayerSyncService } from './src/lib/player-sync.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function comprehensiveSync() {
  console.log('🚀 Starting COMPREHENSIVE SYNC with SKIP parameter...')
  
  const syncService = new PlayerSyncService()
  
  try {
    // Database'i temizle (opsiyonel)
    console.log('🧹 Cleaning existing data...')
    // await prisma.player.deleteMany({ where: { isCustom: false } })
    
    // Skip-based full sync
    await syncService.initialBulkDownload()
    
    console.log('✅ Comprehensive sync completed!')
    
  } catch (error) {
    console.error('❌ Comprehensive sync failed:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

comprehensiveSync()
