function lockOrientation() {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(function(error) {
            console.error('Не удалось заблокировать ориентацию:', error);
        });
    }
}

// Функция для обработки изменения ориентации
function handleOrientationChange() {
    const message = document.getElementById('message');
    if (window.matchMedia("(orientation: landscape)").matches) {
        // Если устройство в горизонтальном положении, показываем сообщение и скрываем все остальное
        document.body.style.opacity = '0';
        message.style.display = 'block';
    } else {
        // Если устройство в вертикальном положении, скрываем сообщение и показываем все
        document.body.style.opacity = '1';
        message.style.display = 'none';
    }
}

// Блокируем ориентацию при загрузке страницы
window.addEventListener('load', () => {
    lockOrientation();
    handleOrientationChange(); // Проверяем начальную ориентацию
});

// Добавляем обработчик события изменения ориентации
window.addEventListener('orientationchange', handleOrientationChange);