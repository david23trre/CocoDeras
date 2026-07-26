function initClouds() {
    const clouds = document.getElementById("clouds");

    const cloudFrames = [
        { src: "./assets/cielo/nube.png", weight: 3 },
        { src: "./assets/cielo/nube1.png", weight: 3 },
        { src: "./assets/cielo/nube2.png", weight: 1 },
        { src: "./assets/cielo/nube3.png", weight: 3 },
        { src: "./assets/cielo/nube4.png", weight: 2 },
        { src: "./assets/cielo/nube5.png", weight: 1 },
        { src: "./assets/cielo/nube6.png", weight: 1 },
        { src: "./assets/cielo/nube7.png", weight: 1 },
        { src: "./assets/cielo/nube8.png", weight: 1 },
        { src: "./assets/cielo/nube9.png", weight: 2 },
    ];

    let lastCloudSrc = null;
    let cloudTimer = null;
    let activeCloudCount = 0;

    const targetClouds = 4;
    const maxClouds = 6;
    const minSpawnDelay = 2400;
    const normalSpawnDelay = 5200;
    const maxSpawnDelay = 7600;

    function getActiveClouds() {
        return activeCloudCount;
    }

    function randomCloudImage() {
        const pool = [];

        cloudFrames.forEach(cloud => {
            for (let i = 0; i < cloud.weight; i++) {
                pool.push(cloud.src);
            }
        });

        let selected = pool[Math.floor(Math.random() * pool.length)];
        let tries = 0;

        while (selected === lastCloudSrc && tries < 6) {
            selected = pool[Math.floor(Math.random() * pool.length)];
            tries++;
        }

        lastCloudSrc = selected;
        return selected;
    }

    function spawnCloud(initial = false, initialLeft = null) {
        if (document.hidden) return;
        if (getActiveClouds() >= maxClouds) return;

        const cloud = document.createElement("img");

        const size = 58 + Math.random() * 92;
        const sceneWidth = clouds.clientWidth || window.innerWidth;
        const top = 4 + Math.random() * 46;
        const opacity = .52 + Math.random() * .26;
        const rotation = (Math.random() * 10) - 5;
        const travelDistance = sceneWidth + size * 2.4;
        const pixelsPerSecond = 30 + Math.random() * 10;
        const duration = travelDistance / pixelsPerSecond;

        cloud.className = "cloud";
        cloud.src = randomCloudImage();
        cloud.alt = "Nube";
        cloud.draggable = false;
        cloud.decoding = "async";

        cloud.style.width = size + "px";
        cloud.style.top = top + "%";
        cloud.style.left = initial ? `${initialLeft}%` : "100%";
        cloud.style.opacity = opacity;
        cloud.style.animationDuration = duration + "s";
        cloud.style.animationDelay = "0s";
        cloud.style.setProperty("--cloud-rotation", rotation + "deg");
        cloud.style.setProperty("--cloud-travel", "-" + travelDistance + "px");

        clouds.appendChild(cloud);
        activeCloudCount++;

        cloud.addEventListener("animationend", () => {
            cloud.remove();
            activeCloudCount = Math.max(0, activeCloudCount - 1);
        });
    }

    function randomSpawnDelay() {
        const activeClouds = getActiveClouds();

        if (activeClouds < targetClouds) {
            return minSpawnDelay + Math.random() * 1200;
        }

        return normalSpawnDelay + Math.random() * (maxSpawnDelay - normalSpawnDelay);
    }

    function scheduleNextCloud() {
        clearTimeout(cloudTimer);

        cloudTimer = setTimeout(() => {
            tickClouds();
            scheduleNextCloud();
        }, randomSpawnDelay());
    }

    function tickClouds() {
        const activeClouds = getActiveClouds();

        if (!document.hidden && activeClouds < maxClouds) {
            spawnCloud(false);
        }
    }

    function startCloudSpawner() {
        if (cloudTimer) return;
        scheduleNextCloud();
    }

    function stopCloudSpawner() {
        clearTimeout(cloudTimer);
        cloudTimer = null;
    }

    [10, 42, 74].forEach(position => {
        spawnCloud(true, position);
    });

    startCloudSpawner();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopCloudSpawner();
        } else {
            startCloudSpawner();
        }
    });
}
