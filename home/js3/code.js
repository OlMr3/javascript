function vowelCount (str){
    let letters='ауоыэяюёеи';
    let count=0;
    for(let i=0; i<str.length; i++){
        const char = str[i].toLowerCase();
        if (letters.includes(char)){
            count++;
        }     
    }
return count;
}
let userStr=prompt('Введите строку');

let vowelRussianCount=vowelCount(userStr);
console.log(vowelRussianCount);