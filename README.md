# ⚽ Futbol Lineup Builder

Modern, görsel olarak etkileyici bir futbol takım kadrosu oluşturma uygulaması. Drag-and-drop işlevselliği ile profesyonel diziliş oluşturun, özelleştirin ve paylaşın.

![Futbol Lineup Builder](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Modern UI/UX**: Koyu tema ile profesyonel görünüm
- **Drag & Drop**: Sürükle-bırak ile oyuncu yerleştirme
- **Çoklu Formasyon**: 4-4-2, 4-3-3, 4-2-3-1, 3-5-2 ve daha fazlası
- **Gerçek Oyuncu Verileri**: API entegrasyonu ile güncel bilgiler
- **Gelişmiş Arama**: İsim, pozisyon, lig ve milli takım filtreleri
- **Favori Sistem**: Beğenilen oyuncuları kaydetme
- **Resim Export**: PNG/JPG formatında kaydetme

### ⚙️ Teknik Özellikler
- **Next.js 14**: App Router ile modern React
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animasyonlar
- **Zustand**: Hafif state management
- **SQLite + Prisma**: Yerel veri saklama
- **@dnd-kit**: Performanslı drag-and-drop

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adım 1: Projeyi klonlayın
```bash
git clone https://github.com/your-username/futbol-lineup-builder.git
cd futbol-lineup-builder
```

### Adım 2: Bağımlılıkları kurun
```bash
npm install
```

### Adım 3: Veritabanını hazırlayın
```bash
# Prisma generate
npm run db:generate

# Database oluştur
npm run db:push

# Seed data ekle
npm run db:seed
```

### Adım 4: Çevre değişkenlerini ayarlayın
`.env` dosyasını düzenleyin:
```env
DATABASE_URL="file:./dev.db"
FOOTBALL_API_KEY="your_api_key_here"
FOOTBALL_API_URL="https://api.football-data.org/v4"
```

### Adım 5: Geliştirme sunucusunu başlatın
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

## 🎮 Kullanım

### Lineup Oluşturma
1. Sol panelden formasyon seçin
2. Oyuncu arama ve filtreleme özelliklerini kullanın
3. Oyuncuları sürükleyip sahada istediğiniz pozisyona bırakın
4. Kaptan seçin (isteğe bağlı)
5. Squad title ve subtitle ekleyin

### Oyuncu Yönetimi
- **Arama**: İsme göre oyuncu arayın
- **Filtreleme**: Lig, pozisyon, milli takım filtreleri
- **Favoriler**: Kalp ikonu ile favori ekleyin/çıkarın
- **Pozisyon Değiştirme**: Sahada oyuncuları sürükleyip taşıyın

### Export ve Paylaşım
- **Resim Export**: PNG/JPG olarak kaydedin
- **Paylaşım**: Link ile paylaşın
- **Reset**: Formationa sıfırlayın
- **Temizle**: Tüm oyuncuları kaldırın

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Ana layout
│   ├── page.tsx           # Ana sayfa
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── SoccerField.tsx    # Futbol sahası
│   ├── ControlPanel.tsx   # Kontrol paneli
│   └── PlayerCard.tsx     # Oyuncu kartı
├── lib/                   # Utility fonksiyonlar
│   ├── formations.ts      # Formasyon verileri
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Yardımcı fonksiyonlar
├── store/                 # State management
│   └── lineup-store.ts    # Zustand store
prisma/                    # Veritabanı
├── schema.prisma          # Prisma schema
└── seed.ts               # Seed data
```

## 🛠️ Geliştirme

### Scripts
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint kontrolü
npm run db:generate  # Prisma client generate
npm run db:push      # Schema push
npm run db:seed      # Database seed
npm run db:studio    # Prisma Studio
```

### Database Schema
Uygulama aşağıdaki ana tabloları kullanır:
- `Users`: Kullanıcı yönetimi
- `Players`: Oyuncu verileri
- `Teams`: Takım bilgileri
- `Leagues`: Lig verileri
- `Formations`: Formasyon tanımları
- `Lineups`: Kaydedilen dizilişler

## 🎨 Customization

### Tema Değişiklikleri
`tailwind.config.ts` dosyasında renk paletini özelleştirin:
```typescript
theme: {
  extend: {
    colors: {
      emerald: {
        // Özel renkleriniz
      }
    }
  }
}
```

### Yeni Formasyonlar
`src/lib/formations.ts` dosyasında yeni formasyonlar ekleyin:
```typescript
export const FORMATIONS: FormationData[] = [
  {
    id: 'custom-formation',
    name: 'Custom Formation',
    // ...diğer özellikler
  }
]
```

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Prisma](https://prisma.io/) - Database toolkit
- [dnd kit](https://dndkit.com/) - Drag and drop library

## 📞 İletişim

Proje Sahibi - [@your-username](https://github.com/your-username)

Proje Linki: [https://github.com/your-username/futbol-lineup-builder](https://github.com/your-username/futbol-lineup-builder)
