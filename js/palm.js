function initPalm() {
    const palmWrapper = document.getElementById("palmWrapper");
    const palmera = document.getElementById("palmera");

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

    setInterval(() => {
        if (isShaking) return;

        palmera.src = palmFrames[frameIndex];
        frameIndex = (frameIndex + 1) % palmFrames.length;
    }, 140);

    function shakePalm() {
        if (isShaking) return;

        isShaking = true;

        palmWrapper.classList.remove("shaking");
        void palmWrapper.offsetWidth;
        palmWrapper.classList.add("shaking");

        setTimeout(() => {
            palmWrapper.classList.remove("shaking");
            isShaking = false;
        }, 720);
    }

    palmWrapper.addEventListener("pointerdown", shakePalm);
}