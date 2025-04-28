class Snake {
    constructor(){
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.size = 1;
        this.speed = 10;
    }

    updade(){
        const head = {x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y};
        this.body.unshift(head);
        if(this.body.length > this.size) {
            this.body.pop();
        }
    }
    changeDirection (newDirection){
        if (newDirection.x !==-this.direction.x || newDirection.y !== -this.direction.y){
            this.direction = newDirection;
        }
    }
    checkCollision(){
        const head = this.body[0];
        if(head.x < 0 ||)
    }
}



/*document.getElementById('savePlayerName').addEventListener('click', function() {
    const playerName = document.getElementById('playerName').value;

    if (playerName) {
        savePlayerName(playerName);
    } else {
        alert("Пожалуйста, введите ваше имя.");
    }
});*/
/*function createNewRecordTable() {
    const newTableName = 'MRYAZEVA_TEST_TABLEOFRECORDS';
    const updatePassword = Math.random(); // Используем временную метку как пароль

    const data = {
        f: 'UPDATE',
        n: newTableName,
        p: updatePassword,
        v: JSON.stringify({ scores: [] }) // Инициализируем пустой массив рекордов
    };

    fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.error("Ошибка при создании таблицы:", result.error);
            return;
        }
        
        console.log("Таблица успешно создана!");
        // Теперь можно загружать или сохранять рекорды
    })
    .catch(error => console.error('Ошибка:', error));
}
createNewRecordTable();
/*function savePlayerName(playerName) {
    const updatePassword = Math.random();

    const data = {
        f: 'LOCKGET',
        n: 'MRYAZEVA_TEST_TABLEOFRECORDS',
        p: updatePassword
    };

    fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
       if (result.error) {
        console.error("Ошибка при блокировке записи:", result.error);
           if (result.error === "invalid string name") {
               // Если таблицы нет, создаем её
               createNewRecordTable();
               return; // Прерываем выполнение функции
           }
           
           return;
       }

       const records = JSON.parse(result.result)?.scores || [];
       
       // Добавляем новый рекорд
       records.push({ name: playerName, score: 0 });

       const updateData = {
           f: 'UPDATE',
           n: 'MRYAZEVA_TEST_TABLEOFRECORDS',
           p: updatePassword,
           v: JSON.stringify({ scores: records })
       };

       return fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
           method: 'POST',
           headers: { 
               'Content-Type': 'application/json' 
           },
           body: JSON.stringify(updateData)
       });
   })
   .then(response => response.json())
   .then(result => {
      if (result && result.error) { 
          console.error("Ошибка при обновлении записи:", result.error); 
      } else { 
          console.log("Имя успешно сохранено!"); 
          alert("Ваше имя успешно сохранено!"); // Уведомление об успешном сохранении
      } 
   })
   .catch(error => console.error('Ошибка:', error));
}





function loadRecords() {
    const data = {
        f: 'READ',
        n: 'MRYAZEVA_TEST_TABLEOFRECORDS'
    };

    fetch('https://fe.it-academy.by/AjaxStringStorage2.php', { // Замените ajaxHandlerScript на правильный URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.error("Ошибка при загрузке рекордов:", result.error);
            return;
        }

        const records = JSON.parse(result.result)?.scores || [];
        
        // Отображаем рекорды
        const recordsList = document.getElementById('recordsList');
        recordsList.innerHTML = '';

        records.sort((a, b) => b.score - a.score);

        for (let i = 0; i < Math.min(records.length, 10); i++) { 
            const li = document.createElement('li');
            li.textContent = `${records[i].name}: ${records[i].score}`;
            recordsList.appendChild(li);
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function saveScore(playerName, score) {
    const updatePassword = Math.random();

    const data = {
        f: 'LOCKGET',
        n: 'MRYAZEVA_TEST_TABLEOFRECORDS',
        p: updatePassword
    };

    fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
       if (result.error) {
           console.error("Ошибка при блокировке записи:", result.error);
           return;
       }

       const records = JSON.parse(result.result)?.scores || [];
       
       const playerIndex = records.findIndex(record => record.name === playerName);
       
       if (playerIndex !== -1) {
           records[playerIndex].score = score;

           const updateData = {
               f: 'UPDATE',
               n: 'MRYAZEVA_TEST_TABLEOFRECORDS',
               p: updatePassword,
               v: JSON.stringify({ scores: records })
           };

           return fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
               method: 'POST',
               headers: { 
                   'Content-Type': 'application/json' 
               },
               body: JSON.stringify(updateData)
           });
       } else {
           console.error("Игрок не найден.");
       }
   })
   .then(response => response.json())
   .then(result => {
      if (result && result.error) { 
          console.error("Ошибка при обновлении записи:", result.error); 
      } else { 
          console.log("Рекорд успешно сохранен!"); 
          loadRecords(); 
      } 
   })
   .catch(error => console.error('Ошибка:', error));
}*/



/ Функция для выполнения AJAX-запросов
async function ajaxRequest(params) {
    const response = await fetch(ajaxHandlerScript, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
    });
    return await response.json();
}

// Сохранение имени игрока
saveNameButton.addEventListener('click', async () => {
    const playerName = playerNameInput.value.trim();
    if (playerName.length < 5) {
        alert('Имя игрока должно быть не менее 5 символов.');
        return;
    }

    const params = {
        f: 'INSERT',
        n: recordName,
        v: JSON.stringify([{ name: playerName, score: 0 }]), // Начальный счет 0
    };

    const result = await ajaxRequest(params);
    if (result.error) {
        alert(result.error);
    } else {
        alert('Имя сохранено!');
    }
});

// Показ рекордов
showRecordsButton.addEventListener('click', async () => {
    const params = {
        f: 'READ',
        n: recordName,
    };

    const result = await ajaxRequest(params);
    if (result.error) {
        alert(result.error);
    } else {
        // Здесь предполагаем, что результат - это массив объектов с именем и счетом
        const records = JSON.parse(result.result);
        recordsDiv.innerHTML = ''; // Очистка предыдущих записей
        records.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.textContent = `${record.name}: ${record.score}`;
            recordsDiv.appendChild(recordElement);
        });
    }
});









// Функция для выполнения AJAX-запросов
async function ajaxRequest(params) {
    const response = await fetch(ajaxHandlerScript, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
    });
    return await response.json();
}

// Сохранение имени игрока
async function savePlayerName(playerName) {
    const params = {
        f: 'READ',
        n: recordName,
    };
    
    const result = await ajaxRequest(params);
    
    let records = [{}];
    if (result.error) {
        if (result.error !== "string not found") {
            alert(result.error);
            return;
        }
    } else {
        records = JSON.parse(result.result); // Получаем текущие записи
    }

    // Добавляем нового игрока
    records[playerName] = 0; // Начальный счёт 0
    updatePassword = Math.random();
    // Сохраняем обновлённые записи
    const insertParams = {
        f: 'UPDATE',
        n: recordName,
        p: updatePassword, // Убедитесь, что используете правильный пароль
        v: JSON.stringify(records),
    };

    const insertResult = await ajaxRequest(insertParams);
    if (insertResult.error) {
        alert(insertResult.error);
    } else {
        alert('Игрок успешно добавлен!');
    }
}

// Обновление счёта игрока
async function updatePlayerScore(playerName, newScore) {
    updatePassword = Math.random();
    const lockParams = {
        f: 'LOCKGET',
        n: recordName,
        p: updatePassword, // Убедитесь, что используете правильный пароль
    };

    const lockResult = await ajaxRequest(lockParams);
    if (lockResult.error) {
        alert(lockResult.error);
        return;
    }

    let records = JSON.parse(lockResult.result);
    records[playerName] = Math.max(records[playerName], newScore); // Обновляем счёт

    const updateParams = {
        f: 'UPDATE',
        n: recordName,
        p: updatePassword, // Убедитесь, что используете правильный пароль
        v: JSON.stringify(records),
    };

    const updateResult = await ajaxRequest(updateParams);
    if (updateResult.error) {
        alert(updateResult.error);
    } else {
        alert('Счёт обновлён!');
    }
}