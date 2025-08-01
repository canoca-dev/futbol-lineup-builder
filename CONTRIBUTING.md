# Katkıda Bulunma Rehberi

Futbol Lineup Builder projesine katkıda bulunmak istediğiniz için teşekkürler! 🎉

## 📋 İçindekiler

- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [Proje Yapısı](#proje-yapısı)
- [Kodlama Standartları](#kodlama-standartları)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Issue Raporlama](#issue-raporlama)

## 🛠️ Geliştirme Ortamı Kurulumu

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Git

### Kurulum Adımları

1. **Repository'yi fork edin**
   ```bash
   # GitHub'da fork butonu ile fork edin
   ```

2. **Local'e klonlayın**
   ```bash
   git clone https://github.com/[username]/futbol-lineup-builder.git
   cd futbol-lineup-builder
   ```

3. **Bağımlılıkları kurun**
   ```bash
   npm install
   ```

4. **Database'i hazırlayın**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Development server'ı başlatın**
   ```bash
   npm run dev
   ```

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
├── components/            # React bileşenleri
├── lib/                   # Utility fonksiyonlar
├── store/                 # State management
prisma/                    # Database schema
```

## 📝 Kodlama Standartları

### TypeScript
- Strict mode kullanın
- Interface ve type tanımlarını export edin
- JSDoc yorumları ekleyin

### React
- Functional components kullanın
- Custom hooks yazın
- Props için interface tanımlayın

### Styling
- Tailwind CSS utility classes kullanın
- Component-specific stiller için CSS modules
- Responsive design principles

### State Management
- Zustand store pattern'ı takip edin
- Actions ve selectors ayrı tanımlayın

## 📝 Commit Mesajları

Conventional Commits standardını kullanıyoruz:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı değişikliği
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzeltme
- `chore`: Build süreç değişiklikleri

### Örnekler
```
feat(formations): add 5-4-1 formation support
fix(drag-drop): resolve position overlap issue
docs(readme): update installation instructions
```

## 🔄 Pull Request Süreci

1. **Feature branch oluşturun**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Değişikliklerinizi commit edin**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

3. **Branch'i push edin**
   ```bash
   git push origin feature/amazing-feature
   ```

4. **Pull Request açın**
   - Açıklayıcı başlık yazın
   - Değişiklikleri detaylandırın
   - Screenshot/GIF ekleyin (UI değişiklikleri için)
   - İlgili issue'ları link edin

### PR Checklist
- [ ] Kod lint kontrolünden geçiyor
- [ ] Tests yazıldı/güncellendi
- [ ] Documentation güncellendi
- [ ] CHANGELOG.md güncellendi
- [ ] Breaking changes belirtildi

## 🐛 Issue Raporlama

### Bug Reports
- Açık ve tanımlayıcı başlık
- Beklenen davranış
- Gerçek davranış
- Reproduction steps
- Environment bilgileri
- Screenshot/video (varsa)

### Feature Requests
- Özellik açıklaması
- Use case senaryoları
- Varsa mockup/tasarım
- Alternatif çözümler

## 🎨 UI/UX Katkıları

- Modern, minimalist tasarım prensiplerine uyun
- Accessibility standartlarını takip edin
- Mobile-first yaklaşım kullanın
- Dark theme uyumluluğu sağlayın

## 🔧 Teknik Katkılar

### Performance
- Bundle size optimizasyonu
- Image optimization
- Code splitting
- Lazy loading

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

## 📞 İletişim

- GitHub Issues: Teknik konular
- GitHub Discussions: Genel tartışmalar
- Email: [email@example.com]

## 🙏 Teşekkürler

Tüm katkıda bulunanlar [CONTRIBUTORS.md](CONTRIBUTORS.md) dosyasında listelenecektir.

Katkılarınız için şimdiden teşekkürler! 🚀
