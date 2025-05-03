const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
const stringName = 'MRYAZEVA_GAME_RULES';
const gameRules = 'По кнопке "Старт" запускается игра. Изначально счет: 0. Игроку дается 3 жизни. Игрок управляет змейкой при помощи кнопок направления — вверх, вниз, влево, вправо. Движение начинается при нажатии на любую из этих кнопок. Ползая, змейка должна собирать еду, за которую начисляются очки и тем самым она увеличивается в размере.  Если она съела бомбу или столкнулась со стеной, или столкнулась сама с собой, то количество жизней уменьшается на 1 и игра перезапускается без потери очков и змейка снова изначального размера. Цель игры — набрать как можно больше очков. Игра заканчивается, если количество жизней равно 0.'

const playerNameInput = document.getElementById('playerName');
const saveNameButton = document.getElementById('saveName');
const showRecordsButton = document.getElementById('records');
const recordsDiv = document.getElementById('recordsContainer');
const recordName = 'MRYAZEVA_TABLE_OFRECORDS'; 

async function ajaxRequest(params) {
    const response = await fetch(ajaxHandlerScript, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params)
    });
    return response.json();
}

// Обновление рекорда
async function updatePlayerScore(playerName, score) {
    updatePassword = Math.random();
    const params = {
        f: 'LOCKGET',
        n: recordName,
        p: updatePassword
    };

    const result = await ajaxRequest(params);
    if (result.error) {
        alert(result.error);
        return;
    }

    // Получаем текущие данные
    let currentData = result.result ? JSON.parse(result.result) : [];

    // Обновляем или добавляем рекорд
    const playerRecord = currentData.find(record => record.name === playerName);
    if (playerRecord) {
        playerRecord.score = Math.max(playerRecord.score, score); // Обновляем рекорд, если новый выше
    } else {
        currentData.push({ name: playerName, score: score });
        console.log(playerName) // Добавляем новый рекорд
    }

    // Обновляем данные на сервере
    const updateParams = {
        f: 'UPDATE',
        n: recordName,
        p: updatePassword,
        v: JSON.stringify(currentData)
    };

    const updateResult = await ajaxRequest(updateParams);
    if (updateResult.error) {
        alert(updateResult.error);
    } else {
        alert('Рекорд обновлен!');
    }
}
//ЧТЕНИЕ РЕКОРДА
async function fetchTopRecords() {
    const params = {
        f: 'READ',
        n: recordName,
    };

    const result = await ajaxRequest(params);
    if (result.error) {
        alert(result.error);
        return [];
    }

    return JSON.parse(result.result) || [];
}
async function displayTopRecords() {
    const records = await fetchTopRecords();

    // Сортируем записи по убыванию счета
    records.sort((a, b) => b.score - a.score);

    // Берем только первые 10 записей
    const topRecords = records.slice(0, 10);

    // Отображаем записи
    const recordsDiv = document.getElementById('topRecords'); 
    recordsDiv.innerHTML = ''; // Очищаем предыдущие записи
    topRecords.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.textContent = `${record.name}: ${record.score}`;
        recordsDiv.appendChild(recordElement);
    });
}

document.getElementById('records').addEventListener('click', () =>
    showsRulesOrRecords('records')); 

function insertGameRules(rules) {
    const data = {
        f: 'INSERT',
        n: stringName,
        v: rules
    };
    fetch(ajaxHandlerScript, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: new URLSearchParams(data) 
    })
        .then(response => response.json())
        .then(response => {
            if (response.result === "OK") { 
                console.log("Правила успешно сохранены.");
            } else {
                console.log("Ошибка при сохранении правил:", response);
            }
        })
        .catch(error => console.error("Ошибка при вставке:", error));
}

// Вызов функции для добавления правил игры
/*insertGameRules(gameRules);*/
function getGameRules() {
    const data = {
        f: 'READ',
        n: stringName
    };
    fetch(ajaxHandlerScript, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
        .then(response => response.json())
        .then(response => {
            if (response.result) {
                // Вставляем правила в div
                document.getElementById('rulesContent').textContent = response.result;
            } else {
                document.getElementById('rulesContent').textContent = "Правила не найдены.";
                console.log("Ошибка при получении правил:", response.error);
            }
        })
        .catch(error => {
            document.getElementById('rulesContent').textContent = "Ошибка при загрузке правил.";
            console.error("Ошибка при запросе:", error);
        });
}

// Вызовем функцию для загрузки правил при загрузке страницы
/*getGameRules()*/;
document.getElementById('gameRules').addEventListener('click', () => showsRulesOrRecords('gameRules'))
   
function showsRulesOrRecords(type) {
    const rulesDiv = document.getElementById('rules');
    const recordDiv = document.getElementById('recordsContainer');
    if (type === 'gameRules') {
        rulesDiv.classList.remove('hidden');
        rulesDiv.classList.add('visible');
        recordDiv.classList.remove('visible');
        recordDiv.classList.add('hidden');
        getGameRules();
    }
    if (type === 'records') {
        recordDiv.classList.remove('hidden');
        recordDiv.classList.add('visible');
        rulesDiv.classList.remove('visible');
        rulesDiv.classList.add('hidden');
        displayTopRecords();
    }
}
const closeButtons = document.querySelectorAll('.close-btn');
// Добавляем обработчик событий для каждого элемента
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const rulesDiv = document.getElementById('rules');
        const recordDiv = document.getElementById('recordsContainer');

        // Проверяем, какой див видимый и скрываем его
        if (rulesDiv.classList.contains('visible')) {
            rulesDiv.classList.remove('visible');
            rulesDiv.addEventListener('transitionend', function handler() {
                rulesDiv.classList.add('hidden');
                rulesDiv.removeEventListener('transitionend', handler);
            });
        } else if (recordDiv.classList.contains('visible')) {
            recordDiv.classList.remove('visible');
            recordDiv.addEventListener('transitionend', function handler() {
                recordDiv.classList.add('hidden');
                recordDiv.removeEventListener('transitionend', handler);
            });
        }
    });
});




