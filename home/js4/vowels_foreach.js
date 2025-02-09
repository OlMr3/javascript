
function countVowels(str) {
    const vowels = ['а', 'у', 'е', 'ы', 'о', 'э', 'ё', 'я', 'и', 'ю'];
    let vowelCount = 0;
    vowels.forEach(vowel => {
        const count = str.split(vowel).length - 1;
        vowelCount += count;
    });
    return vowelCount;
}
function countVowels1(str) {
    const vowels = ['а', 'у', 'е', 'ы', 'о', 'э', 'ё', 'я', 'и', 'ю'];
    let filtered=str.split('').filter(char=>vowels.includes(char));
    return filtered.length;
}
function countVowels2(str) {
    const vowels = ['а', 'у', 'е', 'ы', 'о', 'э', 'ё', 'я', 'и', 'ю'];
    let count=str.split('').reduce((a, v)=>vowels.includes(v)?a+1:a,0);
    return count;
}

let userStr = prompt("Введите строку:");
userStr=userStr.toLowerCase();
console.log(countVowels(userStr));
console.log(countVowels1(userStr));
console.log(countVowels2(userStr));
 
