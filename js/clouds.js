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

    const maxClouds = 555;
    const spawnDelay = 2500;

    function getActiveClouds() {
        return clouds.querySelectorAll(".cloud").length;
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

        const size = 65 + Math.random() * 105;
        const top = Math.random() * 48;
        const opacity = .58 + Math.random() * .3;
        const rotation = (Math.random() * 10) - 5;
        const duration = 22 + (size / 170) * 15 + Math.random() * 7;

        cloud.className = "cloud";
        cloud.src = randomCloudImage();
        cloud.alt = "Nube";
        cloud.draggable = false;

        cloud.style.width = size + "px";
        cloud.style.top = top + "%";
        cloud.style.left = initial ? `${initialLeft}%` : "100%";
        cloud.style.opacity = opacity;
        cloud.style.animationDuration = duration + "s";
        cloud.style.animationDelay = "0s";
        cloud.style.setProperty("--cloud-rotation", rotation + "deg");

        clouds.appendChild(cloud);

        cloud.addEventListener("animationend", () => {
            cloud.remove();
        });
    }

    function tickClouds() {
        if (!document.hidden && getActiveClouds() < maxClouds) {
            spawnCloud(false);
        }
    }

    function startCloudSpawner() {
        if (cloudTimer) return;
        cloudTimer = setInterval(tickClouds, spawnDelay);
    }

    function stopCloudSpawner() {
        clearInterval(cloudTimer);
        cloudTimer = null;
    }

    [8, 38, 70].forEach(position => {
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