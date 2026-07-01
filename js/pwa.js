(function () {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./service-worker.js');
        });
    }

    if (isStandalone) {
        return;
    }

    let installPrompt = null;
    let installBanner = null;

    function hideInstallBanner() {
        if (installBanner) {
            installBanner.remove();
            installBanner = null;
        }
    }

    function showInstallBanner() {
        if (!installPrompt || installBanner) {
            return;
        }

        installBanner = document.createElement('div');
        installBanner.className = 'install-prompt';
        installBanner.innerHTML = `
            <button class="install-prompt__button" type="button">Instalar app</button>
            <button class="install-prompt__close" type="button" aria-label="Ocultar">&times;</button>
        `;

        installBanner.querySelector('.install-prompt__button').addEventListener('click', async function () {
            hideInstallBanner();
            installPrompt.prompt();
            await installPrompt.userChoice;
            installPrompt = null;
        });

        installBanner.querySelector('.install-prompt__close').addEventListener('click', hideInstallBanner);
        document.body.appendChild(installBanner);
    }

    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        installPrompt = event;
        showInstallBanner();
    });

    window.addEventListener('appinstalled', function () {
        installPrompt = null;
        hideInstallBanner();
    });
})();
