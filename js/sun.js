function initSun() {
    const sun = document.getElementById("sun");

    if (!sun) {
        return;
    }

    const frames = [
        "./assets/cielo/sol2.png",
        "./assets/cielo/sol3.png",
        "./assets/cielo/sol2.png",
        "./assets/cielo/sol3.png"
    ];

    let frameIndex = 0;

    setInterval(function () {
        frameIndex = (frameIndex + 1) % frames.length;
        sun.src = frames[frameIndex];
    }, 400);
}
