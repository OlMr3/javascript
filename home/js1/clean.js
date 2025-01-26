function removeSpace(str){
    let start = 0;
    let end = str.length - 1;
    while (start <= end && str[start] === ' '){
        start++;
    }
    if (start>end){
        console.log('Строка состояла только из пробелов');
        return '';
    }
    while (end>=start && str[end] === ' '){
        end--
    }
    if (start === 0 && end === str.length - 1){
        console.log('Пробелы отсутствуют');
        return str;
    }
    return str.substring(start, end+1);
}
let userStr = prompt('Введите строку');
let res = removeSpace(userStr);
console.log(res);
alert(`*${res}*`);