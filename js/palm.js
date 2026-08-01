function initPalm() {
    const palmWrapper = document.getElementById("palmWrapper");
    const palmera = document.getElementById("palmera");
    const shakeSound = new Audio("./sounds/Shaking.mp3");
    shakeSound.preload = "auto";

    const palmFrames = [
        "./assets/palmera/base1.png",
        "./assets/palmera/base2.png",
        "./assets/palmera/base3.png",
        "./assets/palmera/base4.png",
        "./assets/palmera/base5.png",
        "./assets/palmera/base6.png",
        "./assets/palmera/base5.png",
        "./assets/palmera/base4.png",
        "./assets/palmera/base3.png",
        "./assets/palmera/base2.png"
    ];

    let frameIndex = 0;
    let isShaking = false;
    let shakeTimer = null;

    setInterval(() => {
        if (isShaking) return;

        palmera.src = palmFrames[frameIndex];
        frameIndex = (frameIndex + 1) % palmFrames.length;
    }, 140);

    function shakePalm() {
        isShaking = true;
        window.dispatchEvent(new CustomEvent("palm:shake"));

        palmWrapper.classList.remove("shaking");
        void palmWrapper.offsetWidth;
        palmWrapper.classList.add("shaking");
        clearTimeout(shakeTimer);

        shakeSound.currentTime = 0;
        shakeSound.play().catch(() => {});

        shakeTimer = setTimeout(() => {
            palmWrapper.classList.remove("shaking");
            isShaking = false;
        }, 720);
    }

    palmWrapper.addEventListener("pointerdown", shakePalm);
}
