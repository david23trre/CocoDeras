function initGround() {
    const suelo = document.getElementById("suelo");

    const groundFrames = [
        "./assets/suelo/base1.png",
        "./assets/suelo/base2.png",
        "./assets/suelo/base3.png",
        "./assets/suelo/base4.png",
        "./assets/suelo/base5.png",
        "./assets/suelo/base4.png",
        "./assets/suelo/base3.png",
        "./assets/suelo/base2.png"
    ];

    let frameIndex = 0;

    setInterval(() => {
        suelo.src = groundFrames[frameIndex];
        frameIndex = (frameIndex + 1) % groundFrames.length;
    }, 320);
}