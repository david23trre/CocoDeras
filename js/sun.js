function initSun() {
    const sun = document.getElementById("sun");
    const moon = document.getElementById("moon");
    const moonMask = document.getElementById("moonMask");
    const stars = document.getElementById("stars");

    if (!sun || !moon || !moonMask || !stars) {
        return;
    }

    const sunFrames = [
        "./assets/cielo/sol2.png",
        "./assets/cielo/sol3.png",
        "./assets/cielo/sol2.png",
        "./assets/cielo/sol3.png"
    ];

    const moonPhases = [
        "./assets/cielo/luna0.png",
        "./assets/cielo/luna1.png",
        "./assets/cielo/luna2.png",
        "./assets/cielo/luna3.png",
        "./assets/cielo/luna4.png",
        "./assets/cielo/luna5.png",
        "./assets/cielo/luna6.png",
        "./assets/cielo/luna7.png"
    ];

    const dayStart = 5;
    const sunriseEnd = 6.25;
    const sunsetStart = 17.5;
    const nightStart = 18;
    const dayEnd = 18;
    const nightEnd = 5;

    let frameIndex = 0;

    createStars(stars);
    updateSkyCycle();

    setInterval(function () {
        frameIndex = (frameIndex + 1) % sunFrames.length;
        sun.src = sunFrames[frameIndex];
    }, 400);

    setInterval(updateSkyCycle, 30000);

    function updateSkyCycle() {
        const now = getSanSalvadorDate();
        const hour = now.getUTCHours() + (now.getUTCMinutes() / 60) + (now.getUTCSeconds() / 3600);
        const isDay = hour >= dayStart && hour < dayEnd;

        sun.hidden = !isDay;
        moon.hidden = isDay;
        moonMask.hidden = isDay;

        if (isDay) {
            positionBody(sun, progressBetween(hour, dayStart, dayEnd));
        } else {
            positionBody(moon, progressNight(hour, dayEnd, nightEnd));
            positionBody(moonMask, progressNight(hour, dayEnd, nightEnd));
            moon.src = moonPhases[getMoonPhaseIndex(now)];
        }

        applySkyState(getSkyState(hour));
    }

    function positionBody(element, progress) {
        const eased = smoothstep(clamp(progress, 0, 1));
        const x = -10 + eased * 120;
        const y = 44 - Math.sin(eased * Math.PI) * 31;

        element.style.setProperty("--celestial-left", x + "%");
        element.style.setProperty("--celestial-top", y + "%");
    }

    function getSkyState(hour) {
        const night = {
            top: "#020711",
            bottom: "#0b1024",
            brightness: .42,
            saturation: .68,
            cloudBrightness: .36,
            cloudSaturation: .62,
            hintOpacity: .72,
            windOpacity: .42,
            stars: 1
        };

        const dawn = {
            top: "#ff8b6f",
            bottom: "#ffd69a",
            brightness: .84,
            saturation: .98,
            cloudBrightness: .82,
            cloudSaturation: .9,
            hintOpacity: .88,
            windOpacity: .68,
            stars: .18
        };

        const day = {
            top: "#1fa5ff",
            bottom: "#d8f5ff",
            brightness: 1,
            saturation: 1,
            cloudBrightness: 1,
            cloudSaturation: 1,
            hintOpacity: 1,
            windOpacity: 1,
            stars: 0
        };

        const dusk = {
            top: "#f06a63",
            bottom: "#d9916a",
            brightness: .7,
            saturation: .9,
            cloudBrightness: .68,
            cloudSaturation: .82,
            hintOpacity: .82,
            windOpacity: .58,
            stars: .22
        };

        if (hour >= dayStart && hour < sunriseEnd) {
            return mixSky(night, dawn, day, progressBetween(hour, dayStart, sunriseEnd));
        }

        if (hour >= sunriseEnd && hour < sunsetStart) {
            return day;
        }

        if (hour >= sunsetStart && hour < nightStart) {
            return mixSky(day, dusk, night, progressBetween(hour, sunsetStart, nightStart));
        }

        return night;
    }

    function mixSky(from, middle, to, progress) {
        const p = smoothstep(clamp(progress, 0, 1));

        if (p < .5) {
            return interpolateSky(from, middle, p * 2);
        }

        return interpolateSky(middle, to, (p - .5) * 2);
    }

    function interpolateSky(from, to, progress) {
        return {
            top: mixColor(from.top, to.top, progress),
            bottom: mixColor(from.bottom, to.bottom, progress),
            brightness: lerp(from.brightness, to.brightness, progress),
            saturation: lerp(from.saturation, to.saturation, progress),
            cloudBrightness: lerp(from.cloudBrightness, to.cloudBrightness, progress),
            cloudSaturation: lerp(from.cloudSaturation, to.cloudSaturation, progress),
            hintOpacity: lerp(from.hintOpacity, to.hintOpacity, progress),
            windOpacity: lerp(from.windOpacity, to.windOpacity, progress),
            stars: lerp(from.stars, to.stars, progress)
        };
    }

    function applySkyState(state) {
        if (typeof window.setSkyTheme === "function") {
            window.setSkyTheme({
                top: state.top,
                bottom: state.bottom
            });
        }

        document.documentElement.style.setProperty("--ambient-brightness", state.brightness);
        document.documentElement.style.setProperty("--ambient-saturation", state.saturation);
        document.documentElement.style.setProperty("--cloud-brightness", state.cloudBrightness);
        document.documentElement.style.setProperty("--cloud-saturation", state.cloudSaturation);
        document.documentElement.style.setProperty("--hint-opacity", state.hintOpacity);
        document.documentElement.style.setProperty("--wind-opacity", state.windOpacity);
        document.documentElement.style.setProperty("--stars-opacity", state.stars);
    }

    function createStars(container) {
        const starCount = 54;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("span");
            const size = Math.random() > .82 ? 3 : 2;

            star.className = "star";
            star.style.left = (4 + Math.random() * 92) + "%";
            star.style.top = (5 + Math.random() * 58) + "%";
            star.style.setProperty("--star-size", size + "px");
            star.style.setProperty("--star-duration", (2.8 + Math.random() * 3.2) + "s");
            star.style.setProperty("--star-delay", (-Math.random() * 4) + "s");
            container.appendChild(star);
        }
    }

    function getSanSalvadorDate() {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/El_Salvador",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false
        }).formatToParts(new Date());

        const values = {};

        parts.forEach(function (part) {
            values[part.type] = Number(part.value);
        });

        return new Date(Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second));
    }

    function getMoonPhaseIndex(date) {
        const synodicMonth = 29.530588853;
        const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
        const daysSince = (date.getTime() - knownNewMoon) / 86400000;
        const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;

        return Math.round((phase / synodicMonth) * 8) % 8;
    }

    function progressBetween(value, start, end) {
        return (value - start) / (end - start);
    }

    function progressNight(hour, start, end) {
        const normalizedHour = hour < start ? hour + 24 : hour;
        const normalizedEnd = end < start ? end + 24 : end;

        return (normalizedHour - start) / (normalizedEnd - start);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function smoothstep(value) {
        return value * value * (3 - 2 * value);
    }

    function lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    function mixColor(from, to, progress) {
        const fromRgb = hexToRgb(from);
        const toRgb = hexToRgb(to);

        return rgbToHex({
            r: Math.round(lerp(fromRgb.r, toRgb.r, progress)),
            g: Math.round(lerp(fromRgb.g, toRgb.g, progress)),
            b: Math.round(lerp(fromRgb.b, toRgb.b, progress))
        });
    }

    function hexToRgb(hex) {
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    function rgbToHex(rgb) {
        return "#" + [rgb.r, rgb.g, rgb.b].map(function (value) {
            return value.toString(16).padStart(2, "0");
        }).join("");
    }
}
