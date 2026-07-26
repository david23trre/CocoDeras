function initSkyTheme() {
    syncSkyTheme();
}

function syncSkyTheme() {
    const skyTop = getComputedStyle(document.documentElement)
        .getPropertyValue("--sky-top")
        .trim();

    updateThemeColor(skyTop || "#1fa5ff");
}

function setSkyTheme(colors) {
    const root = document.documentElement;

    if (colors.top) {
        root.style.setProperty("--sky-top", colors.top);
    }

    if (colors.bottom) {
        root.style.setProperty("--sky-bottom", colors.bottom);
    }

    syncSkyTheme();
}

function updateThemeColor(color) {
    let themeMeta = document.querySelector('meta[name="theme-color"]');

    if (!themeMeta) {
        themeMeta = document.createElement("meta");
        themeMeta.name = "theme-color";
        document.head.appendChild(themeMeta);
    }

    themeMeta.content = color;
}

window.setSkyTheme = setSkyTheme;
window.syncSkyTheme = syncSkyTheme;
