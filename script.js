// script.js
// Enhanced JS with GSAP for animations and Vanta for tech background

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Vanta.js background
    VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00ffcc, // Cyan
        backgroundColor: 0x0a0a0a,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00
    });

    // Smooth scrolling for navigation links with GSAP
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                gsap.to(window, { duration: 1, scrollTo: { y: targetElement, offsetY: 50 }, ease: "power2.inOut" });
            }
        });
    });

    // Section reveal on scroll with GSAP
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            paused: true,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
            }
        });
    });

    // Hover glitch effect on header h1
    const headerH1 = document.querySelector('header h1');
    headerH1.addEventListener('mouseenter', () => {
        gsap.to(headerH1, {
            duration: 0.1,
            x: 2,
            skewX: 2,
            ease: "power1.inOut",
            repeat: 3,
            yoyo: true,
            onComplete: () => gsap.set(headerH1, { x: 0, skewX: 0 })
        });
    });
});
