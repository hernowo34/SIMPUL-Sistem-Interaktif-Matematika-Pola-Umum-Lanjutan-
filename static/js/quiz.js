document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const currentLevelEl = document.getElementById('currentLevel');
    const questionCountEl = document.getElementById('questionCount');
    const form = document.getElementById('quizForm');
    const feedbackText = document.getElementById('feedbackText');
    const quizContainer = document.getElementById('quizContainer');
    const levelComplete = document.getElementById('levelComplete');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const nextLevelNumberEl = document.getElementById('nextLevelNumber');
    const resetLevelBtn = document.getElementById('resetLevelBtn');
    
    const materiToggle = document.getElementById('materiToggle');
    const materiPopup = document.getElementById('materiPopup');
    const closeMateri = document.getElementById('closeMateri');
    
    // State
    let level = parseInt(localStorage.getItem('um_math_quiz_level')) || 1;
    let questions = [];
    let currentQuestionIndex = 0;
    
    // Inisialisasi
    initQuiz();
    
    // Pop-up Logic
    if(materiToggle) {
        materiToggle.addEventListener('click', () => {
            materiPopup.classList.toggle('hidden');
        });
    }
    if(closeMateri) {
        closeMateri.addEventListener('click', () => {
            materiPopup.classList.add('hidden');
        });
    }
    
    async function initQuiz() {
        currentLevelEl.textContent = level;
        quizContainer.classList.remove('hidden');
        levelComplete.classList.add('hidden');
        feedbackText.className = 'feedback hidden';
        
        try {
            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level: level })
            });
            const data = await response.json();
            if (response.ok) {
                questions = data.questions;
                currentQuestionIndex = 0;
                showQuestion();
            } else {
                document.getElementById('sequenceContainer').innerHTML = "<p>Gagal memuat soal.</p>";
            }
        } catch (e) {
            console.error(e);
            document.getElementById('sequenceContainer').innerHTML = "<p>Terjadi kesalahan jaringan.</p>";
        }
    }
    
    function showQuestion() {
        const q = questions[currentQuestionIndex];
        questionCountEl.textContent = `Soal ${currentQuestionIndex + 1} dari 3`;
        
        const seqContainer = document.getElementById('sequenceContainer');
        const optContainer = document.getElementById('optionsContainer');
        seqContainer.innerHTML = '';
        optContainer.innerHTML = '';
        optContainer.classList.add('hidden');
        
        q.sequence.forEach((item) => {
            if (item === '?') {
                if (q.type === 'drag') {
                    seqContainer.innerHTML += `
                        <div class="seq-block seq-input-block drop-zone" id="answerDrop">?</div>
                    `;
                } else {
                    seqContainer.innerHTML += `
                        <div class="seq-block seq-input-block">
                            <input type="text" id="answerInput" placeholder="?" required autocomplete="off">
                        </div>
                    `;
                }
            } else {
                seqContainer.innerHTML += `<div class="seq-block">${item}</div>`;
            }
        });
        
        if (q.type === 'drag') {
            optContainer.classList.remove('hidden');
            q.options.forEach(opt => {
                const el = document.createElement('div');
                el.className = 'drag-option';
                el.draggable = true;
                el.textContent = opt;
                el.dataset.val = opt;
                optContainer.appendChild(el);
            });
            
            setupDragAndDrop();
        } else {
            const answerInput = document.getElementById('answerInput');
            if (answerInput) answerInput.focus();
        }
        
        feedbackText.className = 'feedback hidden';
    }
    
    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.drag-option');
        const dropZone = document.getElementById('answerDrop');
        
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });
            
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
            });
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const draggingEl = document.querySelector('.dragging');
            if (draggingEl) {
                dropZone.textContent = draggingEl.dataset.val;
                dropZone.classList.add('filled');
            }
        });
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const q = questions[currentQuestionIndex];
        let userAnswer = "";
        let errorTarget = null;
        
        if (q.type === 'drag') {
            const dropZone = document.getElementById('answerDrop');
            if (dropZone.textContent === '?') {
                // Belum diisi
                alert("Silakan seret (drag) salah satu jawaban ke area kotak kosong yang putus-putus!");
                return;
            }
            userAnswer = dropZone.textContent.trim().toLowerCase();
            errorTarget = dropZone;
        } else {
            const answerInput = document.getElementById('answerInput');
            if (!answerInput || !answerInput.value.trim()) return;
            userAnswer = answerInput.value.trim().toLowerCase();
            errorTarget = answerInput.parentElement;
            answerInput.disabled = true;
        }
        
        const correctAnswer = q.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            // Benar
            feedbackText.textContent = "Jawaban Benar!";
            feedbackText.className = 'feedback correct';
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < 3) {
                    showQuestion();
                } else {
                    // Level Selesai
                    quizContainer.classList.add('hidden');
                    levelComplete.classList.remove('hidden');
                    nextLevelNumberEl.textContent = level + 1;
                }
            }, 1000); // Jeda 1 detik
        } else {
            // Salah, langsung ganti soal (reset progres soal saat ini)
            feedbackText.textContent = "Jawaban Salah! Mengganti soal...";
            feedbackText.className = 'feedback wrong';
            errorTarget.classList.add('shake');
            
            setTimeout(() => {
                errorTarget.classList.remove('shake');
                initQuiz(); // Muat ulang soal baru dari server
            }, 1000);
        }
    });
    
    nextLevelBtn.addEventListener('click', () => {
        level++;
        localStorage.setItem('um_math_quiz_level', level);
        initQuiz();
    });
    
    if (resetLevelBtn) {
        resetLevelBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengulang progres kembali ke Level 1?')) {
                level = 1;
                localStorage.setItem('um_math_quiz_level', level);
                initQuiz();
            }
        });
    }
});
