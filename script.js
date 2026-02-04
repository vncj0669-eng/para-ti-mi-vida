document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Player Logic ---
    const audioPlayers = document.querySelectorAll('.audio-controls');
    let currentAudio = null; // Track currently playing audio to pause others

    audioPlayers.forEach(player => {
        const src = player.getAttribute('data-src');
        const playBtn = player.querySelector('.play-btn');
        const icon = playBtn.querySelector('i');
        const progressBar = player.querySelector('.progress');
        const progressContainer = player.querySelector('.progress-bar');
        const timeDisplay = player.querySelector('.time');

        // Create Audio Object
        const audio = new Audio(src);
        
        // Handle Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                // Pause any other currently playing audio
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                }
                
                audio.play()
                    .then(() => {
                        icon.classList.remove('fa-play');
                        icon.classList.add('fa-pause');
                        currentAudio = audio;
                    })
                    .catch(error => {
                        console.error("Error playing audio:", error);
                        alert("No se pudo reproducir el audio. Asegúrate de que los archivos 'perdon.mp3' y 'te_amo.mp3' estén en la carpeta assets/audio.");
                    });
            } else {
                audio.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });

        // Update Progress Bar & Time
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            
            // Update time display
            const current = formatTime(audio.currentTime);
            const total = formatTime(audio.duration || 0);
            timeDisplay.textContent = `${current}`;
        });

        // Reset when finished
        audio.addEventListener('ended', () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
            currentAudio = null;
        });
        
        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            
            if (duration) {
                audio.currentTime = (clickX / width) * duration;
            }
        });

        // Pause event listener (in case paused by other logic)
        audio.addEventListener('pause', () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
    });

    // Helper: Format seconds to MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // --- Interaction Component ---
    const forgiveBtn = document.getElementById('forgiveBtn');
    const overlay = document.getElementById('celebrationOverlay');
    const closeBtn = document.getElementById('closeOverlay');

    if (forgiveBtn) {
        forgiveBtn.addEventListener('click', () => {
            // Show overlay
            overlay.classList.add('active');
            
            // Optional: You could trigger confetti here if desired
            createConfetti();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }
    
    // Simple CSS Confetti Effect (Programmatic)
    function createConfetti() {
        const colors = ['#ebb1bd', '#92a8d1', '#ffeaa7', '#fab1a0'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            
            // Random properties
            const bg = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100 + 'vw';
            const animDuration = Math.random() * 3 + 2 + 's';
            
            confetti.style.position = 'fixed';
            confetti.style.top = '-10px';
            confetti.style.left = left;
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = bg;
            confetti.style.zIndex = '2000';
            confetti.style.animation = `fall ${animDuration} linear forwards`;
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});

// Add confetti animation style dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
