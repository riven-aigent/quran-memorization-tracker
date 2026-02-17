// Quran Memorization Tracker - Vanilla JavaScript
class QuranTracker {
    constructor() {
        this.surahs = JSON.parse(localStorage.getItem('quranTrackerSurahs')) || [
            { id: 1, name: "Al-Fatiha", verses: 7, memorized: 0 },
            { id: 2, name: "Al-Baqarah", verses: 286, memorized: 0 },
            { id: 3, name: "Ali 'Imran", verses: 200, memorized: 0 },
            { id: 4, name: "An-Nisa", verses: 176, memorized: 0 },
            { id: 5, name: "Al-Ma'idah", verses: 120, memorized: 0 },
            { id: 6, name: "Al-An'am", verses: 165, memorized: 0 },
            { id: 7, name: "Al-A'raf", verses: 206, memorized: 0 },
            { id: 8, name: "Al-Anfal", verses: 75, memorized: 0 },
            { id: 9, name: "At-Tawbah", verses: 129, memorized: 0 },
            { id: 10, name: "Yunus", verses: 109, memorized: 0 }
        ];
        this.init();
    }

    init() {
        this.renderSurahList();
        this.updateStats();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('add-surah-btn').addEventListener('click', () => this.addSurah());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetProgress());
    }

    renderSurahList() {
        const surahList = document.getElementById('surah-list');
        surahList.innerHTML = '';

        this.surahs.forEach(surah => {
            const card = document.createElement('div');
            card.className = 'surah-card';
            card.innerHTML = `
                <h3>${surah.name} (${surah.id})</h3>
                <div class="surah-info">
                    <span class="verses-info">${surah.memorized}/${surah.verses} verses</span>
                    <div class="input-group">
                        <label for="memorized-${surah.id}">Memorized:</label>
                        <input type="number" 
                               id="memorized-${surah.id}" 
                               min="0" 
                               max="${surah.verses}" 
                               value="${surah.memorized}">
                        <button class="delete-btn" data-id="${surah.id}">Delete</button>
                    </div>
                </div>
                <div class="surah-progress">
                    <div class="surah-progress-fill" style="width: ${(surah.memorized / surah.verses) * 100}%"></div>
                </div>
            `;
            surahList.appendChild(card);

            // Bind input event
            const input = card.querySelector(`#memorized-${surah.id}`);
            input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) || 0;
                this.updateMemorized(surah.id, Math.min(value, surah.verses));
            });

            // Bind delete button
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteSurah(surah.id));
        });
    }

    updateMemorized(surahId, verses) {
        const surah = this.surahs.find(s => s.id === surahId);
        if (surah) {
            surah.memorized = Math.max(0, Math.min(verses, surah.verses));
            this.saveData();
            this.renderSurahList();
            this.updateStats();
        }
    }

    addSurah() {
        const surahName = prompt("Enter Surah name:");
        const verses = parseInt(prompt("Enter total number of verses:"));
        
        if (surahName && !isNaN(verses) && verses > 0) {
            const newId = Math.max(...this.surahs.map(s => s.id), 0) + 1;
            this.surahs.push({
                id: newId,
                name: surahName.trim(),
                verses: verses,
                memorized: 0
            });
            this.saveData();
            this.renderSurahList();
            this.updateStats();
        }
    }

    deleteSurah(surahId) {
        if (confirm("Are you sure you want to delete this Surah?")) {
            this.surahs = this.surahs.filter(s => s.id !== surahId);
            this.saveData();
            this.renderSurahList();
            this.updateStats();
        }
    }

    resetProgress() {
        if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            this.surahs.forEach(surah => {
                surah.memorized = 0;
            });
            this.saveData();
            this.renderSurahList();
            this.updateStats();
        }
    }

    updateStats() {
        const totalVerses = this.surahs.reduce((sum, surah) => sum + surah.verses, 0);
        const memorizedVerses = this.surahs.reduce((sum, surah) => sum + surah.memorized, 0);
        const completedSurahs = this.surahs.filter(surah => surah.memorized === surah.verses).length;
        const progressPercentage = totalVerses > 0 ? Math.round((memorizedVerses / totalVerses) * 100) : 0;

        document.getElementById('total-verses').textContent = totalVerses.toLocaleString();
        document.getElementById('memorized-verses').textContent = memorizedVerses.toLocaleString();
        document.getElementById('surahs-completed').textContent = completedSurahs;
        document.getElementById('progress-text').textContent = `${progressPercentage}% Complete`;
        document.getElementById('overall-progress').style.width = `${progressPercentage}%`;
    }

    saveData() {
        localStorage.setItem('quranTrackerSurahs', JSON.stringify(this.surahs));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuranTracker();
});