document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Score Meter Animation
    const meterFill = document.querySelector('.meter-fill');
    if (meterFill) {
        const score = meterFill.dataset.score;
        setTimeout(() => {
            meterFill.style.width = score + '%';
        }, 500);
    }

    // Modal Logic for Additives
    const modal = document.getElementById('additiveModal');
    const closeBtn = document.querySelector('.close-modal');
    const infoButtons = document.querySelectorAll('.info-btn');

    infoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const category = btn.dataset.category;
            const risk = btn.dataset.risk;
            const explanation = btn.dataset.explanation;

            document.getElementById('modalTitle').textContent = name;
            document.getElementById('modalCategory').textContent = category;
            document.getElementById('modalRisk').textContent = risk;
            document.getElementById('modalExplanation').textContent = explanation;

            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Simple scroll reveal
    const cards = document.querySelectorAll('.sc-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
