// Получаем элемент для отображения сообщения
const messageElement = document.createElement('div');
messageElement.style.position = 'fixed';
messageElement.style.top = '10px';
messageElement.style.left = '50%';
messageElement.style.transform = 'translateX(-50%)';
messageElement.style.backgroundColor = 'red';
messageElement.style.color = 'white';
messageElement.style.padding = '10px';
messageElement.style.display = 'none'; // Скрываем сообщение по умолчанию
document.body.appendChild(messageElement);

// Функция для обработки изменения ориентации
function handleOrientationChange() {
    if (window.innerHeight < window.innerWidth) {
        // Если экран в горизонтальной ориентации
        messageElement.textContent = 'Пожалуйста, используйте вертикальную ориентацию!';
        messageElement.style.display = 'block'; // Показываем сообщение
    } else {
        // Если экран в вертикальной ориентации
        messageElement.style.display = 'none'; // Скрываем сообщение
    }
}

// Добавляем обработчик события изменения размера окна
window.addEventListener('resize', handleOrientationChange);

// Вызываем функцию сразу, чтобы проверить начальную ориентацию
handleOrientationChange();
