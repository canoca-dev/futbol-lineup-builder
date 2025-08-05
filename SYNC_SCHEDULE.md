# 🔄 Sync Schedule Guide

## 📅 Önerilen Çalışma Programı:

### 1️⃣ **İlk Kurulum** (1x çalıştır)
```bash
npm run sync:initial
```
- **Ne yapar**: Tüm oyuncuları toplu indirir (~50K+ oyuncu)
- **Süre**: 30-60 dakika
- **Frequency**: Sadece 1 kez

### 2️⃣ **Günlük Sync** (Her gün)
```bash
npm run sync:daily
```
- **Ne yapar**: 
  - Yeni oyuncuları bulur ve ekler
  - Son 24 saatte güncellenmemiş 100 oyuncunun fotoğrafını kontrol eder
- **Süre**: 5-10 dakika
- **Frequency**: Günde 1 kez (gece 2:00'da ideal)

### 3️⃣ **Haftalık Foto Kontrolü** (Haftada 1)
```bash
npm run sync:photos
```
- **Ne yapar**: Tüm oyuncuların fotoğraflarını kontrol eder
- **Süre**: 2-3 saat (rate limiting ile)
- **Frequency**: Haftada 1 kez (Pazar gecesi ideal)

## ⏰ **Cron Job Örnekleri:**

### Windows Task Scheduler:
```
Günlük Sync:    02:00 - Günlük
Foto Kontrolü:  03:00 - Pazar günleri
```

### Linux Cron:
```bash
# Günlük sync - Her gece 2:00
0 2 * * * cd /path/to/project && npm run sync:daily

# Haftalık foto kontrolü - Pazar 3:00
0 3 * * 0 cd /path/to/project && npm run sync:photos
```

## 📊 **Rate Limiting:**

- **API Calls**: 100ms delay between requests
- **Batch Size**: 1000 players per request
- **Daily Photo Check**: Max 100 players/day
- **Weekly Photo Check**: 50ms delay between players

## 🎯 **Performans Beklentileri:**

| Operation | Duration | Frequency | API Calls |
|-----------|----------|-----------|-----------|
| Initial Download | 30-60 min | 1x | ~50-100 |
| Daily Sync | 5-10 min | Daily | ~5-10 |
| Weekly Photo Check | 2-3 hours | Weekly | ~1000-5000 |

## 💾 **Storage:**

- **Database Size**: ~50-100MB (50K players)
- **Image Cache**: CDN URLs (no local storage)
- **Logs**: ~1MB/month

## 🚨 **Monitoring:**

```sql
-- Son sync durumları
SELECT * FROM sync_logs 
ORDER BY startedAt DESC 
LIMIT 10;

-- Günlük istatistikler
SELECT 
  operation,
  AVG(totalItems) as avg_items,
  COUNT(*) as runs
FROM sync_logs 
WHERE completedAt > datetime('now', '-7 days')
GROUP BY operation;
```
