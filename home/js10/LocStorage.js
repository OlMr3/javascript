class LocStorageClass {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.storage = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }
    addValue(key, value) {
        this.storage[key] = value;
        localStorage.setItem(this.storageKey, JSON.stringify(this.storage));
    }
    getValue(key) {
        if (this.storage.hasOwnProperty(key)) {
            return this.storage[key];
        }
    }
    deleteValue(key) {
        if (this.storage.hasOwnProperty(key)) {
            delete this.storage[key];
            localStorage.setItem(this.storageKey, JSON.stringify(this.storage));
            return true;
        }
        return false;
    }
    getKeys() {
        return Object.keys(this.storage);
    }
}
var drinkStorage = new LocStorageClass("drinkStorage");
var dishStorage = new LocStorageClass("dishStorage");
function addDrink() {
    const name = prompt('Введите название напитка');
    const alco = confirm('Алкогольный?');
    let spiritsYes = 'Да';
    let spiritsNo = 'Нет';
    let spirits;
    if (alco) {
        spirits = spiritsYes;
    }
    else {
        spirits = spiritsNo;
    }
    const recipe = prompt('Введите рецепт напитка');
    drinkStorage.addValue(name, { a: spirits, r: recipe });
}
function addDish() {
    const name = prompt('Введите название блюда');
    const spisy = confirm('Острое?');
    let spisysYes = 'Да';
    let spisysNo = 'Нет';
    let spisyDish;
    if (spisy) {
        spisyDish = spisysYes;
    }
    else {
        spisyDish = spisysNo;
    }
    const recipe = prompt('Введите рецепт блюда');
    dishStorage.addValue(name, { a: spisyDish, r: recipe });
}
function getDrink() {
    const name = prompt('Введите название напитка');
    const info = drinkStorage.getValue(name);
    if (!info) {
        alert('Нет такого напитка');
    }
    else {
        alert(`Напиток: ${name} 
Алкогольный: ${info.a} 
Рецепт приготовления: ${info.r}`);
    }
}
function getDish() {
    const name = prompt('Введите название блюда');
    const info = dishStorage.getValue(name);
    if (!info) {
        alert('Нет такого блюда');
    }
    else {
        alert(`Блюдо: ${name} 
Острое: ${info.a} 
Рецепт приготовления: ${info.r}`);
    }
}
function delDrink() {
    const name = prompt('Введите название напитка, которое хотите удалить');
    const deleteInfo = drinkStorage.deleteValue(name);
    if (!deleteInfo) {
        alert('Нет такого напитка');
    }
    else {
        alert('Напиток удален')
    }
}
function delDish() {
    const name = prompt('Введите название блюда, которое хотите удалить');
    const deleteInfo = dishStorage.deleteValue(name);
    if (!deleteInfo) {
        alert('Нет такого блюда');
    }
    else {
        alert('Блюдо удалено')
    }
}
function showListDrink() {
    const listDrinks = drinkStorage.getKeys();
    if (listDrinks.length === 0) {
        alert('Напитки отсутствуют');
    }
    else {
        alert(listDrinks.join(', '));
    }
}
function showListDish() {
    const listDish = dishStorage.getKeys();
    if (listDish.length === 0) {
        alert('Блюда отсутствуют');
    }
    else {
        alert(listDish.join(', '));
    }
}