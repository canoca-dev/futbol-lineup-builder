#!/usr/bin/env node

/**
 * 🎯 Player Sync CLI Tool
 * 
 * Kullanım:
 * npm run sync:initial    - İlk toplu indirme
 * npm run sync:daily      - Günlük sync
 * npm run sync:photos     - Haftalık foto kontrolü
 */

import { playerSync } from '../src/lib/player-sync.ts'

const command = process.argv[2]

async function main() {
  try {
    switch (command) {
      case 'initial':
        console.log('🚀 Starting initial bulk download...')
        await playerSync.initialBulkDownload()
        break
        
      case 'daily':
        console.log('📅 Starting daily sync...')
        await playerSync.dailySync()
        break
        
      case 'photos':
        console.log('📷 Starting weekly photo check...')
        await playerSync.weeklyPhotoCheck()
        break
        
      case 'status':
        console.log('📊 Sync status coming soon...')
        break
        
      default:
        console.log(`
🎯 Player Sync CLI

Commands:
  initial  - İlk toplu oyuncu indirme (1x çalıştır)
  daily    - Günlük sync (cron job için)
  photos   - Haftalık foto kontrolü (cron job için)
  status   - Sync durumu

Örnek:
  node scripts/sync.js initial
  node scripts/sync.js daily
        `)
    }
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

main()
