function initMusic() {
    const tracks = [
        "./music/Sweden.mp3",
        "./music/Danny.mp3",
        "./music/Haggstrom.mp3",
        "./music/Living-Mice.mp3",
        "./music/Mice-on-Venus.mp3",
        "./music/Minecraft.mp3",
        "./music/Moog-City.mp3",
        "./music/Subwoofer-Lullaby.mp3",
        "./music/Wet-Hands.mp3",
        "./music/Equinoxe.mp3"
    ];

    const audio = new Audio();
    audio.volume = 1;
    audio.preload = "auto";

    let started = false;
    let lastTrack = "";

    function randomTrack() {
        if (tracks.length === 1) return tracks[0];

        let track;

        do {
            track = tracks[Math.floor(Math.random() * tracks.length)];
        } while (track === lastTrack);

        lastTrack = track;
        return track;
    }

    function playTrack(track) {
        audio.pause();
        audio.src = track;
        audio.load();

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("No se pudo reproducir:", err);
                started = false;
            });
        }
    }

    function playNextTrack() {
        playTrack(randomTrack());
    }

    function startMusic() {
        if (started) return;

        started = true;
        playNextTrack();
    }

    audio.addEventListener("ended", playNextTrack);

    audio.addEventListener("error", () => {
        console.warn("Error cargando:", audio.src);
        playNextTrack();
    });

    document.addEventListener("visibilitychange", () => {
        if (!started) return;

        if (document.hidden) {
            audio.pause();
        } else {
            audio.play().catch(() => {});
        }
    });

    ["pointerdown", "touchstart", "keydown"].forEach(event => {
        window.addEventListener(event, startMusic, { once: true, passive: true });
    });
}