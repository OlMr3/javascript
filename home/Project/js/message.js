function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function handleOrientationChange() {
    const warning = document.querySelector('.landscape-warning');
    if (window.matchMedia("(orientation: landscape)").matches && isMobile()) {
        // Блокируем горизонтальную ориентацию
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(function(error) {
                console.error('Ошибка блокировки ориентации: ', error);
            });
        }
        // Показываем предупреждение
        warning.style.display = 'block';
        document.body.style.display = 'none'; // Скрываем контент
    } else {
        // Скрываем предупреждение
        warning.style.display = 'none';
        document.body.style.display = 'block'; // Показываем контент
    }
}

// Проверяем на мобильное устройство
if (isMobile()) {
    // Добавляем обработчик события изменения ориентации
    window.addEventListener('orientationchange', handleOrientationChange);
    // Вызываем функцию при загрузке
    handleOrientationChange();
} else {
    // Если не мобильное устройство, показываем контент
    document.body.style.display = 'block';
}
