// SATCORP Operational Script
document.addEventListener('DOMContentLoaded', () => {
    console.log("SATCORP // System Initialized");

    // Scroll reveal logic
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
});

function scrollToDeck() {
    document.getElementById('deck').scrollIntoView({ behavior: 'smooth' });
}

// Hover audio effect simulation (visual only)
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        // Here you would trigger a low-frequency hum or click sound
        console.log("Tactical Input Hovered");
    });
});
