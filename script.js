const modules = document.querySelectorAll('.module');

window.onload = () => {
    console.log("STATUS: CONCIERGE PROTOCOL INITIATED");
    
    // Staggered module entry
    modules.forEach((mod, index) => {
        setTimeout(() => {
            mod.style.opacity = "1";
            mod.style.transform = "translateY(0)";
            // Subtle "ping" sound simulation
            triggerVisualPing(mod);
        }, 300 * index);
    });
};

function triggerVisualPing(el) {
    el.style.boxShadow = "0 0 20px rgba(0, 71, 255, 0.2)";
    setTimeout(() => {
        el.style.boxShadow = "none";
    }, 500);
}

// Future Tech Cursor Interaction
document.addEventListener('mousemove', (e) => {
    const glass = document.querySelector('.glass-container');
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
    glass.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});
