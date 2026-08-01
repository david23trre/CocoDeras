function initCoconuts() {
    const scene = document.querySelector(".scene");
    const hint = document.getElementById("gameHint");
    const modal = document.getElementById("messageModal");
    const messageText = document.getElementById("messageText");
    const messageClose = document.getElementById("messageClose");

    const shakeGoal = 11;
    const breakDuration = 3950;
    const coconutImages = [
        "./assets/cocos/coco1.png",
        "./assets/cocos/coco2.png",
        "./assets/cocos/coco3.png",
        "./assets/cocos/coco4.png"
    ];

    const breakingSound = new Audio("./sounds/Breaking-a-Wood.mp3");
    breakingSound.preload = "auto";
    breakingSound.loop = false;

    const openNoteSound = new Audio("./sounds/Paper.mp3");
    openNoteSound.preload = "auto";

    const buttonSound = new Audio("./sounds/Click.mp3");
    buttonSound.preload = "auto";

    let shakeCount = 0;
    let activeCoconut = null;
    let state = "waiting";
    let breakProgress = 0;
    let breakFrame = 0;
    let holdStartedAt = 0;
    let progressAtHoldStart = 0;
    let breakAnimation = null;
    let lastMessage = "";

    function setHint(text) {
        if (hint) {
            hint.textContent = text;
        }
    }

    function randomMessage() {
        const messages = Array.isArray(window.COCODERAS_MESSAGES) ? window.COCODERAS_MESSAGES : [];

        if (!messages.length) {
            return "Este coco venía con un mensaje bonito, pero todavia falta escribirlo.";
        }

        let message = messages[Math.floor(Math.random() * messages.length)];
        let attempts = 0;

        while (message === lastMessage && messages.length > 1 && attempts < 8) {
            message = messages[Math.floor(Math.random() * messages.length)];
            attempts++;
        }

        lastMessage = message;
        return message;
    }

    function updateBreakFrame() {
        const nextFrame = Math.min(3, Math.floor(breakProgress * 4));

        if (nextFrame !== breakFrame) {
            breakFrame = nextFrame;
            activeCoconut.querySelector("img").src = coconutImages[breakFrame];
            activeCoconut.classList.remove("crack-pop");
            void activeCoconut.offsetWidth;
            activeCoconut.classList.add("crack-pop");
        }

        activeCoconut.style.setProperty("--break-progress", (breakProgress * 100) + "%");
    }

    function finishBreaking() {
        state = "open-ready";
        breakProgress = 1;
        updateBreakFrame();

        breakingSound.pause();
        breakingSound.currentTime = 0;

        activeCoconut.querySelector("img").src = "./assets/cocos/coco-abierto.png";
        activeCoconut.classList.remove("breaking");
        activeCoconut.classList.add("is-open");
        setHint("Toca el coco abierto");
    }

    function tickBreaking(time) {
        if (state !== "breaking") {
            return;
        }

        breakProgress = Math.min(1, progressAtHoldStart + ((time - holdStartedAt) / breakDuration));
        updateBreakFrame();

        if (breakProgress >= 1) {
            finishBreaking();
            return;
        }

        breakAnimation = requestAnimationFrame(tickBreaking);
    }

    function stopBreaking() {
        if (breakAnimation) {
            cancelAnimationFrame(breakAnimation);
            breakAnimation = null;
        }

        breakingSound.pause();

        if (state === "breaking") {
            state = "ready";
            activeCoconut.classList.remove("breaking");
            setHint("Mantén presionado el coco");
        }
    }

    function startBreaking(event) {
        if (state !== "ready" || !activeCoconut) {
            return;
        }

        event.preventDefault();
        state = "breaking";
        holdStartedAt = performance.now();
        progressAtHoldStart = breakProgress;
        activeCoconut.setPointerCapture(event.pointerId);
        activeCoconut.classList.add("breaking");
        setHint("Sigue manteniendo...");

        breakingSound.play().catch(() => { });

        breakAnimation = requestAnimationFrame(tickBreaking);
    }

    function openNote(event) {
        if (state !== "open-ready" || !activeCoconut) {
            return;
        }

        event.preventDefault();
        state = "message";

        openNoteSound.currentTime = 0;
        openNoteSound.play().catch(() => { });

        activeCoconut.querySelector("img").src = "./assets/cocos/coco-nota.png";
        activeCoconut.classList.add("has-note");
        setHint("Abriste una nota");

        setTimeout(function () {
            messageText.textContent = randomMessage();
            modal.hidden = false;
        }, 360);
    }

    function createCoconut() {
        const coconut = document.createElement("button");
        coconut.className = "coconut falling";
        coconut.type = "button";
        coconut.setAttribute("aria-label", "Coco secreto");
        coconut.innerHTML = `
            <img src="./assets/cocos/coco1.png" alt="Coco" draggable="false">
            <span class="coconut-progress" aria-hidden="true"></span>
        `;

        coconut.addEventListener("animationend", function (event) {
            if (event.animationName !== "coconutFall") {
                return;
            }

            coconut.classList.remove("falling");
            coconut.classList.add("landed");
            state = "ready";
            setHint("Mantén presionado el coco");
        });

        coconut.addEventListener("pointerdown", function (event) {
            if (state === "open-ready") {
                openNote(event);
                return;
            }

            startBreaking(event);
        });

        coconut.addEventListener("pointerup", stopBreaking);
        coconut.addEventListener("pointercancel", stopBreaking);
        coconut.addEventListener("lostpointercapture", stopBreaking);

        scene.appendChild(coconut);
        activeCoconut = coconut;
        state = "falling";
        setHint("Cayó un coco");
    }

    function resetCoconut() {
        stopBreaking();

        if (activeCoconut) {
            activeCoconut.classList.add("leaving");
            setTimeout(function () {
                activeCoconut.remove();
                activeCoconut = null;
            }, 260);
        }

        breakingSound.pause();
        breakingSound.currentTime = 0;
        modal.hidden = true;
        shakeCount = 0;
        breakProgress = 0;
        breakFrame = 0;
        state = "waiting";
        setHint("Sacude la palmera");
    }

    window.addEventListener("palm:shake", function () {
        if (state !== "waiting") {
            return;
        }

        shakeCount++;

        if (shakeCount >= shakeGoal) {
            createCoconut();
            return;
        } 

        const remaining = shakeGoal - shakeCount;
        setHint(remaining === 1 ? "Una sacudida más" : remaining + " sacudidas más");
    });

    messageClose.addEventListener("click", () => {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(() => {});

    resetCoconut();
});

    setHint("Sacude la palmera");
}
