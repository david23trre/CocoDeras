(function () {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async function () {
            try {
                const registration = await navigator.serviceWorker.register('./service-worker.js');

                await registration.update();

                if (registration.waiting) {
                    registration.waiting.postMessage('SKIP_WAITING');
                }

                registration.addEventListener('updatefound', function () {
                    const newWorker = registration.installing;

                    if (!newWorker) {
                        return;
                    }

                    newWorker.addEventListener('statechange', function () {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            newWorker.postMessage('SKIP_WAITING');
                        }
                    });
                });

                let refreshing = false;

                navigator.serviceWorker.addEventListener('controllerchange', function () {
                    if (refreshing) {
                        return;
                    }

                    refreshing = true;
                    window.location.reload();
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        });
    }

    if (isStandalone) {
        return;
    }

    let installPrompt = null;
    const installBanner = document.getElementById('installPrompt');

    function hideInstallBanner() {
        if (installBanner) {
            installBanner.hidden = true;
        }
    }

    function showInstallBanner() {
        if (!installPrompt || !installBanner) {
            return;
        }

        installBanner.hidden = false;
    }

    if (installBanner) {
        installBanner.querySelector('.install-prompt__button').addEventListener('click', async function () {
            if (!installPrompt) {
                hideInstallBanner();
                return;
            }

            hideInstallBanner();

            installPrompt.prompt();
            await installPrompt.userChoice;

            installPrompt = null;
        });

        installBanner.querySelector('.install-prompt__close').addEventListener('click', hideInstallBanner);
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