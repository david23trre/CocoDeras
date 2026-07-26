function initWind() {
    const windParticles = document.getElementById("windParticles");
    const sceneWidth = windParticles.clientWidth || window.innerWidth;

    for (let i = 0; i < 18; i++) {
        const wind = document.createElement("div");

        wind.className = "wind";

        wind.style.left = 100 + Math.random() * 45 + "%";
        wind.style.top = 8 + Math.random() * 68 + "%";
        wind.style.width = 25 + Math.random() * 65 + "px";
        wind.style.animationDuration = 3.8 + Math.random() * .8 + "s";
        wind.style.animationDelay = Math.random() * 6 + "s";
        wind.style.setProperty("--wind-travel", "-" + (sceneWidth + 180) + "px");

        windParticles.appendChild(wind);
    }
}
