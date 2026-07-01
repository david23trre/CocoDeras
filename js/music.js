function initMusic() {
    const tracks = [
        "./music/C418 - Sweden.mp3",
        "./music/C418 - Danny.mp3",
        "./music/C418 - Haggstrom.mp3",
        "./music/C418 - Living Mice.mp3",
        "./music/C418 - Mice on Venus.mp3",
        "./music/C418 - Minecraft.mp3",
        "./music/C418 - Moog City.mp3",
        "./music/C418 - Subwoofer Lullaby.mp3",
        "./music/C418 - Wet Hands.mp3",
        "./music/C418 - Équinoxe.mp3"
    ];

    const audio = new Audio();
    audio.volume = 0.5;
    audio.preload = "none";

    let started = false;
    let lastTrack = "";

    function randomTrack() {
        let track = tracks[Math.floor(Math.random() * tracks.length)];
        let attempts = 0;

        while (track === lastTrack && tracks.length > 1 && attempts < 8) {
            track = tracks[Math.floor(Math.random() * tracks.length)];
            attempts++;
        }

        lastTrack = track;
        return track;
    }

    function playNextTrack() {
        audio.src = randomTrack();
        audio.play().catch(function () {
            started = false;
        });
    }

    function startMusic() {
        if (started) {
            return;
        }

        started = true;
        playNextTrack();
    }

    audio.addEventListener("ended", playNextTrack);
    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });

    document.addEventListener("visibilitychange", function () {
        if (!started) {
            return;
        }

        if (document.hidden) {
            audio.pause();
        } else {
            audio.play().catch(function () {});
        }
    });
}
