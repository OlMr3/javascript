function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function toggleControls() {
    const controls = document.getElementById('controls');
    if (isMobileDevice()) {
        controls.style.display = 'flex'; // Показать кнопки на мобильных устройствах
    } else {
        controls.style.display = 'none'; // Скрыть кнопки на десктопах
    }
}

// Вызываем функцию при загрузке страницы
window.onload = toggleControls;

// Также можно добавить обработчик события для изменения размера окна
window.onresize = toggleControls;



