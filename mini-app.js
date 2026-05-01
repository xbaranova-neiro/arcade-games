(function () {
    'use strict';

    function syncViewport() {
        var vv = window.visualViewport;
        var h = vv ? vv.height : window.innerHeight;
        var w = vv ? vv.width : window.innerWidth;
        document.documentElement.style.setProperty('--app-vh', h + 'px');
        document.documentElement.style.setProperty('--app-vw', w + 'px');
    }

    function initTelegram() {
        try {
            var app = window.Telegram && window.Telegram.WebApp;
            if (!app) return;
            app.ready();
            app.expand();
            if (typeof app.disableVerticalSwipes === 'function') {
                app.disableVerticalSwipes();
            }
            var isGame = !!(document.querySelector('.game-container') || document.querySelector('.layout'));
            if (isGame && app.BackButton) {
                app.BackButton.show();
                app.BackButton.onClick(function () {
                    window.location.href = 'index.html';
                });
            }
        } catch (e) { /* ignore */ }
    }

    function preventRubberBandOnGame() {
        /* Лаунчер (index) без .game-container / .layout — не перехватываем жесты */
        if (!document.querySelector('.game-container') && !document.querySelector('.layout')) return;
        document.addEventListener('touchmove', function (e) {
            if (!e.cancelable) return;
            var t = e.target;
            if (t && t.closest && t.closest('canvas, button, .mobile-controls, .mobile-strip, .pad, .actions, .game-container, .layout, .overlay, #gridContainer')) {
                e.preventDefault();
            }
        }, { passive: false });
        document.addEventListener('gesturestart', function (e) {
            if (e.cancelable) e.preventDefault();
        }, { passive: false });
    }

    syncViewport();
    initTelegram();
    document.documentElement.classList.add('mini-app-ready');

    window.addEventListener('resize', syncViewport);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncViewport);
        window.visualViewport.addEventListener('scroll', syncViewport);
    }

    preventRubberBandOnGame();
})();
