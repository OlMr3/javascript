class ObjStorageClass {
    constructor (){
        this.storage = {};
    }
    
    addValue (key, value) {
        this.storage[key] = value;
    }
    getValue (key) {
        return this.storage[key];
    }
   deleteValue (key) {
        if (this.storage.hasOwnProperty(key)) {
            delete this.storage[key];
            return true;
        }
        return false;
    }
    getKeys () {
        return Object.keys(this.storage);
    }
}
var drinkStorage = new ObjStorageClass;
function add() {
    const name = prompt('Введите имя напитка');
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
function get() {
    const name = prompt('Введите имя напитка');
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
function del() {
    const name = prompt('Введите имя напитка, которое хотите удалить');
    const deleteInfo = drinkStorage.deleteValue(name);
    if (!deleteInfo) {
        alert('Нет такого напитка');
    }
    else {
        alert('Напиток удален')
    }
}
function showList() {
    const listDrinks = drinkStorage.getKeys();
    if (listDrinks.length === 0) {
        alert('Напитки отсутствуют');
    }
    else {
        alert(listDrinks.join(', '));
    }
}