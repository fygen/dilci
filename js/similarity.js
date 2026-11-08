/**
 * similarity.js - Türkçe Anlamsal ve Kök Benzerlik Motoru
 * Harf harf değil, Türkçe anlam öbeklerine, ek toleransına ve
 * kavramsal yakınlığa göre %0 - 100 arasında benzerlik hesaplar.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SemanticSimilarity = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Türkçe karakter duyarlı küçük harfe dönüştürme
  function toLowerTr(text) {
    if (!text) return '';
    return String(text)
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .toLowerCase()
      .trim();
  }

  // Noktalama ve fazla boşlukları temizleme
  function cleanPunctuation(text) {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Türkçe mastar ve yaygın ekleri temizleme (-mak, -mek, vb.)
  function normalizeVerbStem(word) {
    word = word.trim();
    if (word.length > 4) {
      if (word.endsWith('mak') || word.endsWith('mek')) {
        return word.slice(0, -3);
      }
    }
    return word;
  }

  // Levenshtein Mesafesi (Yazım hatası toleransı)
  function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // değiştirme
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // silme veya ekleme
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // İki kelime arasındaki benzerlik oranı (0.0 - 1.0)
  function wordSimilarity(w1, w2) {
    if (w1 === w2) return 1.0;
    
    // Kök karşılaştırması (-mak/-mek ayıklanmış)
    const stem1 = normalizeVerbStem(w1);
    const stem2 = normalizeVerbStem(w2);
    if (stem1 === stem2 && stem1.length >= 2) return 0.95;

    // Eğer biri diğerini içeriyorsa (örn: "sahip" vs "sahip olmak")
    if (w1.includes(w2) || w2.includes(w1)) {
      const minLen = Math.min(w1.length, w2.length);
      const maxLen = Math.max(w1.length, w2.length);
      return Math.max(0.75, minLen / maxLen);
    }

    const maxLen = Math.max(w1.length, w2.length);
    if (maxLen === 0) return 1.0;
    const distance = levenshteinDistance(w1, w2);
    
    // 1-2 harf hatasına tolerans
    if (distance === 1 && maxLen >= 4) return 0.85;
    if (distance === 2 && maxLen >= 6) return 0.70;

    return Math.max(0, 1.0 - (distance / maxLen));
  }

  /**
   * Hedef metindeki parantez içi açıklamaları ve kalıp ifadeleri temizleyip
   * bağımsız anlam adaylarını liste haline getirir.
   * Örnek: "Ol(mak), var olmak, bulunmak (ayrıca başka...)"
   * Sonuç: ["olmak", "ol", "var olmak", "bulunmak"]
   */
  function extractMeaningCandidates(rawText) {
    if (!rawText) return [];

    let text = toLowerTr(rawText);

    // Parantez içi türevleri yakalama: "ol(mak)" -> "olmak" ve "ol"
    const parenAlternatives = [];
    const parenRegex = /([a-zçğıöşü]+)\(([a-zçğıöşü]+)\)/g;
    let match;
    while ((match = parenRegex.exec(text)) !== null) {
      parenAlternatives.push(match[1]); // örn: ol
      parenAlternatives.push(match[1] + match[2]); // örn: olmak
    }

    // Parantez içindeki açıklamaları temizle: (...), [...]
    text = text.replace(/\(.*?\)/g, ' ').replace(/\[.*?\]/g, ' ');

    // Kalıp ve dolgu açıklamaları temizle
    const stopPhrases = [
      'ayrıca başka bir çok anlamı bulunuyor',
      'başka bir çok anlamı bulunuyor',
      'cümle içinde kullanımına göre',
      'kullanımına göre başka anlamları bulunuyor',
      'anlamları bulunuyor',
      'olarak kullanılıyor',
      'şeklinde kısaltması olarak kullanılıyor',
      'mesafe belirtiyor',
      'uzaktaki kavramlar için kullanılıyor',
      'belirli bir tür veya nitelikteki',
      'tanım belirtiyor'
    ];
    stopPhrases.forEach(phrase => {
      text = text.replace(new RegExp(phrase, 'g'), ' ');
    });

    // Virgül, noktalı virgül, eğik çizgi veya 'veya' ile böl
    const parts = text.split(/[,;\/\n]|\bveya\b/);
    const candidates = new Set(parenAlternatives);

    parts.forEach(part => {
      const clean = cleanPunctuation(part).trim();
      if (clean && clean.length > 1) {
        candidates.add(clean);
        // Eğer birden fazla kelime varsa tek tek kelimeleri de (bağlaçlar hariç) aday havuzuna ekle
        const tokens = clean.split(' ').filter(t => t.length > 2 && !['bir', 'için', 'gibi', 'olan', 'olarak'].includes(t));
        if (tokens.length > 1) {
          tokens.forEach(t => candidates.add(t));
        }
      }
    });

    return Array.from(candidates);
  }

  /**
   * Kullanıcı girdisini hedef anlam ile karşılaştırıp benzerlik skorunu döner.
   * @param {string} userInput - Öğrencinin yazdığı cevap (örn: "var olmak", "istemek")
   * @param {string} targetMeaning - Sözlükteki tam Türkçe karşılık
   * @returns {Object} { score: 0-100, level: string, matchedCandidate: string, colorClass: string }
   */
  function evaluateSimilarity(userInput, targetMeaning) {
    if (!userInput || !userInput.trim()) {
      return { score: 0, level: 'none', matchedCandidate: '', colorClass: '' };
    }

    const cleanInput = cleanPunctuation(toLowerTr(userInput));
    if (!cleanInput) {
      return { score: 0, level: 'none', matchedCandidate: '', colorClass: '' };
    }

    const candidates = extractMeaningCandidates(targetMeaning);
    if (candidates.length === 0) {
      return { score: 0, level: 'none', matchedCandidate: '', colorClass: '' };
    }

    let maxScore = 0;
    let bestCandidate = '';

    for (const candidate of candidates) {
      const cleanCandidate = cleanPunctuation(candidate);
      
      // 1. Birebir tam eşleşme
      if (cleanInput === cleanCandidate) {
        maxScore = 1.0;
        bestCandidate = candidate;
        break;
      }

      // 2. Fiil / İsim kökü eşleşmesi (örn: "iste" vs "istemek")
      const inputStem = normalizeVerbStem(cleanInput);
      const candStem = normalizeVerbStem(cleanCandidate);
      if (inputStem === candStem && inputStem.length >= 2) {
        if (0.95 > maxScore) {
          maxScore = 0.95;
          bestCandidate = candidate;
        }
      }

      // 3. Çok kelimeli tam kapsama (Örn: "sahip olmak" hedefinde "sahip" yazılması)
      if (cleanCandidate.split(' ').includes(cleanInput)) {
        if (0.85 > maxScore) {
          maxScore = 0.85;
          bestCandidate = candidate;
        }
      }
      if (cleanInput.split(' ').includes(cleanCandidate)) {
        if (0.85 > maxScore) {
          maxScore = 0.85;
          bestCandidate = candidate;
        }
      }

      // 4. Kelime bazlı benzerlik (Levenshtein + tolerans)
      const score = wordSimilarity(cleanInput, cleanCandidate);
      if (score > maxScore) {
        maxScore = score;
        bestCandidate = candidate;
      }
    }

    const percentage = Math.round(maxScore * 100);

    // Renk ve seviye sınıflandırması
    let level = 'low';
    let colorClass = 'sim-low';

    if (percentage >= 85) {
      level = 'perfect';
      colorClass = 'sim-perfect'; // Canlı Yeşil
    } else if (percentage >= 60) {
      level = 'good';
      colorClass = 'sim-good'; // Açık / Sarı-Yeşil
    } else if (percentage >= 35) {
      level = 'partial';
      colorClass = 'sim-partial'; // Sarı / Turuncu
    } else if (percentage > 0) {
      level = 'low';
      colorClass = 'sim-low'; // Açık Kırmızı / Nötr
    }

    return {
      score: percentage,
      level: level,
      matchedCandidate: bestCandidate,
      colorClass: colorClass
    };
  }

  return {
    evaluate: evaluateSimilarity,
    extractCandidates: extractMeaningCandidates,
    toLowerTr: toLowerTr
  };
}));
