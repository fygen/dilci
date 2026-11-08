/**
 * js/app.js - İnteraktif İngilizce Öğrenme Platformu Ana Motoru
 * Sekme yönetimi, Akıllı Tablo, 3D Flashcard, Quiz, Sesli Telaffuz ve Spaced Repetition
 */

(function () {
  'use strict';

  // LocalStorage Anahtarları
  const STORAGE_KEYS = {
    CUSTOM_WORDS: 'vocab_custom_words_v2',
    ANSWERS: 'vocab_user_answers_v2',
    STATS: 'vocab_word_stats_v2',
    SETTINGS: 'vocab_settings_v2'
  };

  // Uygulama Durumu (State)
  const state = {
    words: [],
    answers: {},
    stats: {}, // { [no]: { status: 'new' | 'learning' | 'mastered', correctCount: 0, wrongCount: 0 } }
    activeTab: 'table',
    isMeaningsVisible: false,
    isExamplesVisible: false,
    
    // Flashcard Durumu
    flashcard: {
      currentIndex: 0,
      filter: 'all', // 'all' | 'new' | 'learning' | 'mastered'
      activeDeck: [],
      isFlipped: false
    },

    // Quiz Durumu
    quiz: {
      questions: [],
      currentIndex: 0,
      score: 0,
      total: 10,
      answered: false
    }
  };

  // ==========================================================================
  // BAŞLATMA (INIT)
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    loadStoredData();
    setupNavigation();
    setupTableListeners();
    setupKeyboardShortcuts();
    
    // Tabloyu ilk kez çiz
    renderTable();
    updateGlobalStats();
  }

  // Verileri LocalStorage ve words.js'ten yükleme
  function loadStoredData() {
    const initial = (typeof window.INITIAL_WORDS !== 'undefined') ? window.INITIAL_WORDS : [];
    
    // Kullanıcının sonradan eklediği kelimeler
    try {
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      const customWords = savedCustom ? JSON.parse(savedCustom) : [];
      state.words = [...initial, ...customWords];
    } catch (e) {
      state.words = [...initial];
    }

    // Kullanıcının yazdığı cevaplar
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      state.answers = savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch (e) {
      state.answers = {};
    }

    // Kelime öğrenme durumları (Spaced Repetition)
    try {
      const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      state.stats = savedStats ? JSON.parse(savedStats) : {};
    } catch (e) {
      state.stats = {};
    }

    // Başlangıç gizlilik durumunu HTML'deki başlıklardan oku
    const thMeaning = document.getElementById('thMeaning');
    const thExample = document.getElementById('thExample');
    if (thMeaning) state.isMeaningsVisible = !thMeaning.classList.contains('hidden');
    if (thExample) state.isExamplesVisible = !thExample.classList.contains('hidden');
    updateColumnToggleButtons();
  }

  // ==========================================================================
  // SESLİ TELAFFUZ (WEB SPEECH API)
  // ==========================================================================
  function speakWord(word, lang = 'en-US') {
    if (!('speechSynthesis' in window)) {
      showToast('Tarayıcınız sesli telaffuzu desteklemiyor.');
      return;
    }
    window.speechSynthesis.cancel(); // Önceki sesi durdur
    const cleanWord = word.replace(/\(.*?\)/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = lang;
    utterance.rate = 0.9; // Biraz daha anlaşılır, hafif yavaş okuma
    window.speechSynthesis.speak(utterance);
  }

  // ==========================================================================
  // SEKME NAVİGASYONU
  // ==========================================================================
  function setupNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabName) {
    state.activeTab = tabName;

    // Buton aktifliği
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // İçerik aktifliği
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    // Sekmeye özel başlatmalar
    if (tabName === 'table') {
      renderTable();
    } else if (tabName === 'flashcard') {
      initFlashcards();
    } else if (tabName === 'quiz') {
      startQuiz(10);
    } else if (tabName === 'stats') {
      renderStatsTab();
    }
    updateGlobalStats();
  }

  // ==========================================================================
  // SEKME 1: AKILLI TABLO
  // ==========================================================================
  function setupTableListeners() {
    // Arama
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderTable(searchInput.value);
      });
    }
  }

  function renderTable(filterQuery = '') {
    const tbody = document.getElementById('vocabTableBody');
    if (!tbody) return;

    const query = (filterQuery || '').toLowerCase().trim();
    const meaningHiddenClass = state.isMeaningsVisible ? '' : 'hidden';
    const exampleHiddenClass = state.isExamplesVisible ? '' : 'hidden';

    let rowsHtml = '';
    let matchCount = 0;

    state.words.forEach(item => {
      const wordMatch = item.word && item.word.toLowerCase().includes(query);
      const meaningMatch = item.meaning && item.meaning.toLowerCase().includes(query);
      const ans = state.answers[item.no] || '';
      const ansMatch = ans && ans.toLowerCase().includes(query);

      if (query && !wordMatch && !meaningMatch && !ansMatch) {
        return;
      }
      matchCount++;

      // Öğrenme durumu noktası
      const itemStat = state.stats[item.no] || { status: 'new' };
      const dotClass = `dot-${itemStat.status}`;

      // Anlamsal benzerlik değerlendirmesi
      let simClass = '';
      let scoreBadge = '';
      if (ans.trim().length > 0 && typeof window.SemanticSimilarity !== 'undefined') {
        const sim = window.SemanticSimilarity.evaluate(ans, item.meaning);
        if (sim.level !== 'none') {
          simClass = sim.colorClass;
          scoreBadge = `<span class="sim-score-badge ${sim.colorClass} show">%${sim.score}</span>`;
        }
      }

      rowsHtml += `
        <tr data-no="${item.no}">
          <td class="col-no">${item.no}</td>
          <td class="col-status-dot">
            <span class="status-dot ${dotClass}" title="Durum: ${getStatusLabel(itemStat.status)}"></span>
          </td>
          <td class="col-word">
            <div class="word-cell">
              <strong>${escapeHtml(item.word)}</strong>
              <button type="button" class="btn-audio" title="Dinle" onclick="window.app.speakWord('${escapeJsString(item.word)}')">🔊</button>
            </div>
          </td>
          <td class="col-input">
            <div class="input-wrapper">
              <input 
                type="text" 
                class="student-input ${simClass}" 
                data-no="${item.no}" 
                value="${escapeHtml(ans)}"
                placeholder="Türkçe anlamını yazın..." 
                oninput="window.app.onTableInput(this, ${item.no})"
                onkeydown="window.app.onInputKeydown(event, ${item.no})"
              >
              ${scoreBadge}
            </div>
          </td>
          <td class="col-meaning ${meaningHiddenClass}" data-cell="meaning">
            ${escapeHtml(item.meaning)}
          </td>
          <td class="col-example ${exampleHiddenClass}" data-cell="example">
            ${escapeHtml(item.example)}
          </td>
          <td class="col-actions">
            <button type="button" class="btn btn-icon" title="Sadece bu kelimenin anlamını göster/gizle" onclick="window.app.toggleRowPeek(${item.no})">
              👁️
            </button>
          </td>
        </tr>
      `;
    });

    if (matchCount === 0) {
      rowsHtml = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: #94a3b8;">Aradığınız kriterlere uygun kelime bulunamadı.</td></tr>`;
    }

    tbody.innerHTML = rowsHtml;
  }

  // Tablo Input girişi yapıldığında
  function onTableInput(inputElem, no) {
    const val = inputElem.value;
    state.answers[no] = val;
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(state.answers));

    const item = state.words.find(w => w.no === no);
    if (!item) return;

    // Wrapper ve badge referansı
    const wrapper = inputElem.parentElement;
    let badge = wrapper.querySelector('.sim-score-badge');

    // Benzerlik motoru ile kontrol
    if (val.trim().length > 0 && typeof window.SemanticSimilarity !== 'undefined') {
      const sim = window.SemanticSimilarity.evaluate(val, item.meaning);
      
      // Önceki sınıfları temizle
      inputElem.classList.remove('sim-perfect', 'sim-good', 'sim-partial', 'sim-low');
      if (sim.colorClass) {
        inputElem.classList.add(sim.colorClass);
      }

      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sim-score-badge';
        wrapper.appendChild(badge);
      }
      badge.className = `sim-score-badge ${sim.colorClass} show`;
      badge.textContent = `%${sim.score}`;

      // Eğer %80 ve üzeriyse kelimeyi 'mastered' (ezberlendi) yap
      if (sim.score >= 80) {
        updateWordStatus(no, 'mastered');
      } else if (sim.score >= 40) {
        updateWordStatus(no, 'learning');
      }
    } else {
      inputElem.classList.remove('sim-perfect', 'sim-good', 'sim-partial', 'sim-low');
      if (badge) badge.classList.remove('show');
    }

    updateGlobalStats();
  }

  // Enter tuşuna basıldığında bir sonraki satıra geçiş
  function onInputKeydown(event, currentNo) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const allInputs = Array.from(document.querySelectorAll('.student-input'));
      const currentIndex = allInputs.indexOf(event.target);
      if (currentIndex !== -1 && currentIndex + 1 < allInputs.length) {
        allInputs[currentIndex + 1].focus();
      }
    }
  }

  // Satır bazlı ipucu aç/kapa
  function toggleRowPeek(no) {
    const tr = document.querySelector(`tr[data-no="${no}"]`);
    if (!tr) return;
    const meaningTd = tr.querySelector('td[data-cell="meaning"]');
    const exampleTd = tr.querySelector('td[data-cell="example"]');
    if (meaningTd) meaningTd.classList.toggle('hidden');
    if (exampleTd) exampleTd.classList.toggle('hidden');
  }

  // Kolon gizlilik butonları
  function toggleAllMeanings() {
    state.isMeaningsVisible = !state.isMeaningsVisible;
    const thMeaning = document.getElementById('thMeaning');
    if (thMeaning) thMeaning.classList.toggle('hidden', !state.isMeaningsVisible);
    document.querySelectorAll('#vocabTableBody td[data-cell="meaning"]').forEach(td => {
      td.classList.toggle('hidden', !state.isMeaningsVisible);
    });
    updateColumnToggleButtons();
  }

  function toggleAllExamples() {
    state.isExamplesVisible = !state.isExamplesVisible;
    const thExample = document.getElementById('thExample');
    if (thExample) thExample.classList.toggle('hidden', !state.isExamplesVisible);
    document.querySelectorAll('#vocabTableBody td[data-cell="example"]').forEach(td => {
      td.classList.toggle('hidden', !state.isExamplesVisible);
    });
    updateColumnToggleButtons();
  }

  function updateColumnToggleButtons() {
    const txtMeaning = document.getElementById('txtMeaningToggle');
    const txtExample = document.getElementById('txtExampleToggle');
    if (txtMeaning) txtMeaning.textContent = state.isMeaningsVisible ? 'Anlamları Gizle' : 'Anlamları Göster';
    if (txtExample) txtExample.textContent = state.isExamplesVisible ? 'Örnekleri Gizle' : 'Örnekleri Göster';
  }

  // ==========================================================================
  // SEKME 2: 3D FLASHCARD MODU
  // ==========================================================================
  function initFlashcards(filter = 'all') {
    state.flashcard.filter = filter;
    
    // Desteyi filtreye göre oluştur
    if (filter === 'all') {
      state.flashcard.activeDeck = [...state.words];
    } else {
      state.flashcard.activeDeck = state.words.filter(w => {
        const st = state.stats[w.no] || { status: 'new' };
        return st.status === filter;
      });
    }

    state.flashcard.currentIndex = 0;
    state.flashcard.isFlipped = false;
    renderCurrentFlashcard();
  }

  function renderCurrentFlashcard() {
    const deck = state.flashcard.activeDeck;
    const scene = document.getElementById('fcScene');
    const emptyMsg = document.getElementById('fcEmptyMsg');
    const counterElem = document.getElementById('fcCounter');

    if (!deck || deck.length === 0) {
      if (scene) scene.style.display = 'none';
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (counterElem) counterElem.textContent = '0 / 0';
      return;
    }

    if (scene) scene.style.display = 'block';
    if (emptyMsg) emptyMsg.style.display = 'none';

    const idx = state.flashcard.currentIndex;
    const item = deck[idx];
    if (counterElem) counterElem.textContent = `${idx + 1} / ${deck.length}`;

    // Kart elemanları
    document.getElementById('fcCard').classList.remove('is-flipped');
    state.flashcard.isFlipped = false;

    document.getElementById('fcWord').textContent = item.word;
    document.getElementById('fcMeaning').textContent = item.meaning;
    document.getElementById('fcExample').textContent = item.example ? `"${item.example}"` : '';

    const itemStat = state.stats[item.no] || { status: 'new' };
    const badgeElem = document.getElementById('fcStatusBadge');
    if (badgeElem) {
      badgeElem.className = `badge-pill badge-${itemStat.status}`;
      badgeElem.textContent = getStatusLabel(itemStat.status);
    }
  }

  function flipFlashcard() {
    const card = document.getElementById('fcCard');
    if (!card) return;
    state.flashcard.isFlipped = !state.flashcard.isFlipped;
    card.classList.toggle('is-flipped', state.flashcard.isFlipped);
  }

  function nextFlashcard() {
    if (state.flashcard.activeDeck.length === 0) return;
    state.flashcard.currentIndex = (state.flashcard.currentIndex + 1) % state.flashcard.activeDeck.length;
    renderCurrentFlashcard();
  }

  function prevFlashcard() {
    if (state.flashcard.activeDeck.length === 0) return;
    const len = state.flashcard.activeDeck.length;
    state.flashcard.currentIndex = (state.flashcard.currentIndex - 1 + len) % len;
    renderCurrentFlashcard();
  }

  function answerFlashcard(isCorrect) {
    const item = state.flashcard.activeDeck[state.flashcard.currentIndex];
    if (!item) return;

    if (isCorrect) {
      updateWordStatus(item.no, 'mastered');
      showToast(`'${item.word}' ezberlenenlere eklendi! ✨`);
    } else {
      updateWordStatus(item.no, 'learning');
      showToast(`'${item.word}' tekrar listesine alındı.`);
    }

    nextFlashcard();
    updateGlobalStats();
  }

  // ==========================================================================
  // SEKME 3: QUIZ / TEST MODU
  // ==========================================================================
  function startQuiz(count = 10) {
    if (state.words.length === 0) return;

    // Rastgele kelimeler seç
    const shuffled = [...state.words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    state.quiz = {
      questions: selected.map(item => generateQuizQuestion(item)),
      currentIndex: 0,
      score: 0,
      total: selected.length,
      answered: false
    };

    document.getElementById('quizPlayingView').style.display = 'block';
    document.getElementById('quizResultView').style.display = 'none';
    renderQuizQuestion();
  }

  function generateQuizQuestion(targetItem) {
    // 3 adet yanlış seçenek seç
    const otherWords = state.words.filter(w => w.no !== targetItem.no);
    const shuffledOthers = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Doğru cevabı temizle (parantezleri kaldırıp sadece ana kısmı al)
    const cleanMeaning = (m) => m.replace(/\(.*?\)/g, '').split(',')[0].trim();

    const options = [
      { text: cleanMeaning(targetItem.meaning), isCorrect: true },
      ...shuffledOthers.map(o => ({ text: cleanMeaning(o.meaning), isCorrect: false }))
    ].sort(() => 0.5 - Math.random());

    return {
      item: targetItem,
      options: options
    };
  }

  function renderQuizQuestion() {
    const q = state.quiz.questions[state.quiz.currentIndex];
    state.quiz.answered = false;

    document.getElementById('quizCounter').textContent = `Soru ${state.quiz.currentIndex + 1} / ${state.quiz.total}`;
    document.getElementById('quizScore').textContent = `Skor: ${state.quiz.score}`;
    document.getElementById('quizTargetWord').textContent = q.item.word;
    document.getElementById('quizFeedback').innerHTML = '';

    const optsContainer = document.getElementById('quizOptions');
    optsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)})</strong> ${escapeHtml(opt.text)}`;
      btn.onclick = () => onSelectQuizOption(btn, opt);
      optsContainer.appendChild(btn);
    });
  }

  function onSelectQuizOption(btnElement, option) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;

    const q = state.quiz.questions[state.quiz.currentIndex];
    const allBtns = document.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    const feedbackElem = document.getElementById('quizFeedback');

    if (option.isCorrect) {
      btnElement.classList.add('correct');
      state.quiz.score++;
      updateWordStatus(q.item.no, 'mastered');
      feedbackElem.innerHTML = '<span style="color: #10b981;">✅ Harika! Doğru cevap.</span>';
    } else {
      btnElement.classList.add('wrong');
      // Doğru butonu da yeşil yak
      allBtns.forEach(b => {
        if (b.innerText.includes(q.options.find(o => o.isCorrect).text)) {
          b.classList.add('correct');
        }
      });
      updateWordStatus(q.item.no, 'learning');
      feedbackElem.innerHTML = `<span style="color: #ef4444;">❌ Yanlış! Doğru anlamı: ${q.item.meaning}</span>`;
    }

    document.getElementById('quizScore').textContent = `Skor: ${state.quiz.score}`;

    // 1.4 saniye sonra sonraki soruya geç
    setTimeout(() => {
      if (state.quiz.currentIndex + 1 < state.quiz.total) {
        state.quiz.currentIndex++;
        renderQuizQuestion();
      } else {
        finishQuiz();
      }
    }, 1400);
  }

  function finishQuiz() {
    document.getElementById('quizPlayingView').style.display = 'none';
    const resultView = document.getElementById('quizResultView');
    resultView.style.display = 'block';

    const percent = Math.round((state.quiz.score / state.quiz.total) * 100);
    document.getElementById('quizFinalScore').textContent = `%${percent}`;
    document.getElementById('quizFinalDetail').textContent = `${state.quiz.total} sorudan ${state.quiz.score} tanesini doğru bildiniz.`;
    updateGlobalStats();
  }

  // ==========================================================================
  // SEKME 4: İSTATİSTİKLER VE DESTE YÖNETİMİ
  // ==========================================================================
  function renderStatsTab() {
    let mastered = 0;
    let learning = 0;
    let newCount = 0;

    state.words.forEach(w => {
      const st = state.stats[w.no] || { status: 'new' };
      if (st.status === 'mastered') mastered++;
      else if (st.status === 'learning') learning++;
      else newCount++;
    });

    document.getElementById('statTotalWords').textContent = state.words.length;
    document.getElementById('statMastered').textContent = mastered;
    document.getElementById('statLearning').textContent = learning;
    document.getElementById('statNew').textContent = newCount;
  }

  // Kelime öğrenme durumunu güncelle
  function updateWordStatus(no, newStatus) {
    if (!state.stats[no]) {
      state.stats[no] = { status: newStatus, correctCount: 0, wrongCount: 0 };
    }
    state.stats[no].status = newStatus;
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(state.stats));
  }

  // Genel ilerleme ve sayaçları güncelleme
  function updateGlobalStats() {
    let mastered = 0;
    let learning = 0;
    let newCount = 0;

    state.words.forEach(w => {
      const st = state.stats[w.no] || { status: 'new' };
      if (st.status === 'mastered') mastered++;
      else if (st.status === 'learning') learning++;
      else newCount++;
    });

    const badgeMastered = document.getElementById('globalMasteredCount');
    const badgeLearning = document.getElementById('globalLearningCount');
    const badgeNew = document.getElementById('globalNewCount');

    if (badgeMastered) badgeMastered.textContent = `${mastered} Ezberlendi`;
    if (badgeLearning) badgeLearning.textContent = `${learning} Tekrar`;
    if (badgeNew) badgeNew.textContent = `${newCount} Yeni`;

    // İlerleme çubuğu
    const total = state.words.length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    const fill = document.getElementById('progressFill');
    const txt = document.getElementById('progressText');
    if (fill) fill.style.width = `${percent}%`;
    if (txt) txt.textContent = `%${percent} (${mastered}/${total})`;
  }

  // ==========================================================================
  // TOPLU VERİ İÇE / DIŞA AKTARMA
  // ==========================================================================
  function openBulkModal() {
    const modal = document.getElementById('bulkModal');
    if (modal) {
      modal.classList.add('active');
      document.getElementById('bulkInput').focus();
    }
  }

  function closeBulkModal() {
    const modal = document.getElementById('bulkModal');
    if (modal) modal.classList.remove('active');
  }

  function saveBulkData() {
    const raw = document.getElementById('bulkInput').value.trim();
    if (!raw) {
      alert('Lütfen eklenecek verileri girin.');
      return;
    }

    let newEntries = [];

    // JSON formatı kontrolü
    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          newEntries = parsed.map(item => ({
            word: item.word || item.kelime || '',
            meaning: item.meaning || item.anlam || item.cevirisi || '',
            example: item.example || item.ornek || ''
          }));
        }
      } catch (err) {}
    }

    // Satır satır okuma (Tab, Pipe |, Noktalı virgül ;)
    if (newEntries.length === 0) {
      const lines = raw.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let parts = [];
        if (trimmed.includes('\t')) parts = trimmed.split('\t');
        else if (trimmed.includes('|')) parts = trimmed.split('|');
        else if (trimmed.includes(';')) parts = trimmed.split(';');
        else if (trimmed.includes(',')) parts = trimmed.split(',');
        else parts = [trimmed];

        const word = (parts[0] || '').trim();
        const meaning = (parts[1] || '').trim();
        const example = (parts[2] || '').trim();

        if (word) {
          newEntries.push({ word, meaning, example });
        }
      });
    }

    if (newEntries.length === 0) {
      alert('Hiçbir kelime ayrıştırılamadı. Lütfen biçimi kontrol edin.');
      return;
    }

    // Mevcut en yüksek No'yu bul
    let maxNo = 0;
    state.words.forEach(w => {
      const n = parseInt(w.no, 10);
      if (!isNaN(n) && n > maxNo) maxNo = n;
    });

    const formatted = newEntries.map((e, idx) => ({
      no: maxNo + idx + 1,
      word: e.word,
      meaning: e.meaning,
      example: e.example
    }));

    // LocalStorage'a ekle
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      let list = saved ? JSON.parse(saved) : [];
      list = [...list, ...formatted];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(list));
    } catch (e) {}

    state.words = [...state.words, ...formatted];
    document.getElementById('bulkInput').value = '';
    closeBulkModal();
    renderTable();
    updateGlobalStats();
    showToast(`${formatted.length} yeni kelime başarıyla eklendi! 🎉`);
  }

  // JSON Dışa Aktarma
  function exportDataJson() {
    const jsonText = JSON.stringify(state.words, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonText).then(() => {
        showToast('Tüm kelime listesi panoya JSON olarak kopyalandı! 📋');
      }).catch(() => {
        prompt('Kelime listesini kopyalayabilirsiniz:', jsonText);
      });
    } else {
      prompt('Kelime listesini kopyalayabilirsiniz:', jsonText);
    }
  }

  // Tüm cevapları sıfırlama
  function clearAllAnswers() {
    if (confirm('Yazdığınız tüm cevapları sıfırlamak istediğinize emin misiniz?')) {
      state.answers = {};
      localStorage.removeItem(STORAGE_KEYS.ANSWERS);
      renderTable();
      updateGlobalStats();
      showToast('Tüm cevaplar temizlendi.');
    }
  }

  // Klavye Kısayolları (Flashcard için)
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (state.activeTab === 'flashcard') {
        // Eğer bir inputta yazmıyorsa
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          flipFlashcard();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextFlashcard();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevFlashcard();
        } else if (e.key.toLowerCase() === 'z') {
          answerFlashcard(false); // Zor
        } else if (e.key.toLowerCase() === 'k') {
          answerFlashcard(true); // Kolay
        }
      }
    });
  }

  // Yardımcı Fonksiyonlar
  function getStatusLabel(status) {
    if (status === 'mastered') return 'Ezberlendi';
    if (status === 'learning') return 'Tekrar Edilecek';
    return 'Yeni';
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeJsString(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Global namespace
  window.app = {
    speakWord,
    switchTab,
    onTableInput,
    onInputKeydown,
    toggleRowPeek,
    toggleAllMeanings,
    toggleAllExamples,
    openBulkModal,
    closeBulkModal,
    saveBulkData,
    exportDataJson,
    clearAllAnswers,
    flipFlashcard,
    nextFlashcard,
    prevFlashcard,
    answerFlashcard,
    initFlashcards,
    startQuiz
  };

})();
