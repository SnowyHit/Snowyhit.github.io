# Gamblezard — Changelog

## 2026-07-21 · Günlük Sistemler + Savaş Derinliği Güncellemesi

Bu güncelleme üç büyük eksiği kapatıyor: oyuncuyu her gün geri getirecek bir sebep yoktu, büyü seçiminin taktiksel bir anlamı yoktu (hangi büyüyü atarsan at aynıydı) ve düşman saldırılarından kaçınmanın hiçbir yolu yoktu. Tüm değişiklikler `index.html` içinde (tek dosya, framework yok). Eski save'ler otomatik migrate ediliyor, kimsenin ilerlemesi bozulmaz.

### 📅 Günlük Retention

**Login Streak (giriş zinciri)**
- Açılış ekranında "🔥 Daily Reward — Day N" satırı, tek tıkla claim.
- 7 günlük ödül döngüsü: 30🪙 → 60🪙 → 80🪙+1🔷 → 120🪙 → 2🔷 → 200🪙 → 3🔷 + **relic token**.
- Dün claim ettiysen zincir büyür; gün kaçırırsan 1'e döner.
- 7. günün relic token'ı: bir sonraki Relic Shrine 3 yerine **4 seçenek** sunar.
- Altın ödülleri geç oyunda boss sayısıyla ölçeklenir (`×(1 + boss×0.3)`).

**Günlük Görevler**
- Tower'da yeni **📅 Daily** sekmesi.
- Her gün 3 görev — tarihten seed'lenir, yani sayfa yenilemek görevleri değiştirmez.
- Havuz: canavar öldür, elite/boss kes, kritik vur, ×3+ hasar bas, oda ilerle, altın topla, dodge yap, zayıflık sömür, blackjack'te 21 yap, jackpot vur (11 görev tipi).
- Progress barlı, tamamlanınca sekmeden CLAIM. Günlük toplam ~4-6🔷 + ~200-300🪙 (ekonomiyi bozmayacak şekilde 1 boss'luk shard'a denk).

**Günün Zindanı**
- Günde **tek deneme** (kazan ya da kaybet — hak girişte düşer, refresh iade etmez).
- Her gün seed'li 1 avantaj + 1 dezavantaj kombinasyonu, örn. "💰 Gold Rush — altın ×2" + "🛡️ Stalwart — düşmanlar +%25 HP".
- İlk boss'u kesince: **5🔷 + 200🪙** (ölçekli). Aktif modifierlar savaşta relic tepsisinde 🌀/😈 chip'leri olarak görünür.

### ⚔️ Büyü–Yaratık Dengesi (artık sadece zar atmak yok)

**Zayıflık / Direnç sistemi**
- Her düşman tipinin zayıf olduğu (×1.5) ve dirençli olduğu (×0.6) büyüler var.
- Düşman kartında rozet olarak görünür: `Weak 🎰🎲` / `Resist ✨`. Hasar yazısında **WEAK!** / **RESIST** çıkar.
- Her tip en az bir başlangıç büyüsüne (✨🎰🎲) zayıf — yeni oyuncu da ilk odadan itibaren büyü seçimi yapar.

| Düşman | Zayıf (×1.5) | Dirençli (×0.6) |
|---|---|---|
| 👺 Goblin Gambler | 🎲 Chaos, 🃏 Necrojack | ✨ Spark |
| 🪞 Arcane Mimic | ✨ Spark, 🎁 Crate | 🎡 Roulette |
| ⚡ Shock Elemental | 🎰 Fireball, 🎲 Chaos | ✨ Spark, 📈 Overload |
| 🗡️ Cursed Knight | ✨ Spark, 🃏 Necrojack | 🎰 Fireball |
| 🟢 Slime Croupier | 🎰 Fireball, 📈 Overload | 🎲 Chaos |
| 🦇 Bat Swarm | ✨ Spark, 🎡 Roulette | 🎁 Crate |

- **Bosslarda sabit zayıflık yok**: her 2 büyüde bir rastgele bir büyün "🎯 Exposed" olur — boss savaşı sürekli büyü değiştirmeye zorlar.

**Trait'ler artık gerçek mekanik** (eskiden sadece isimdi):
- 👺 **Greedy** — her vuruşunda altın çalar; öldürünce çaldığının **+%50 fazlasını** geri bırakır.
- 🪞 **Mimic** — her 3. tur senin son büyü sonucunu kopyalayıp sana vurur (×3 cap). Son büyün fizzle olduysa o da boşa vurur → bilerek fizzle yedirme taktiği!
- ⚡ **Shock** — vuruşları %25 şansla bir büyünü 1 el kilitler (asla tek büyün kalmışken değil; kilitli büyü barda ⚡ ile gri görünür).
- 🗡️ **Curse** — %15 fazla vurur (eskisi gibi) + %30 şansla üstüne curse stack'i basar (stack başına +%8 alınan hasar, max 3; oda temizlenince geçer).

### 🌫️ Dodge / Evasion

**Pasif dodge**
- Yeni kalıcı mod: **Mistward** (+%3 dodge/seviye, shard ile alınır).
- 2 yeni relic: **Mist Cloak** (+%10 dodge), **Zephyr Boots** (+%6 dodge & +%10 hasar).
- Toplam **%35 cap**. Backfire'lar (snake eyes, bust) asla dodge edilemez.
- Stats sekmesine "Dodge Chance" satırı eklendi.

**Aktif dodge (timing minigame)**
- Bazı saldırılarda "⚠️ HEAVY ATTACK" uyarısı + ~1 saniyelik timing barı çıkar (boss her 3. saldırıda, elite %40, normal %20).
- Yeşil bölgede bas → hasarı tamamen savuştur. **Tam ortada** bas → savuştur + **karşı saldırı** (PWR ×1.5).
- Kaçırırsan / süre dolarsa tam hasar — akış asla kilitlenmez. Space/Enter ile de basılır.

### 🔧 Teknik notlar

- Günlük state save'e eklendi (`daily` alanı); eski save'ler default-merge ile sorunsuz yüklenir, save key aynı (`gamblerWizardSave_v1`).
- Tüm günlük roll'lar lokal takvim gününden seed'lenir (mulberry32) — refresh/reroll exploit'i yok.
- Gece yarısı geçişi güvenli: kule her açıldığında tarih kontrol edilir, bayat görevler sayılmaz.
- Headless Chrome ile 32 otomatik fonksiyonel test yazıldı ve geçti (streak, görevler, matchup çarpanları, 4 trait, dodge cap & timing, günlük zindan hakkı, eski save migration'ı).
