function removeSpace(str){
    let start = 0;
    let end = str.length - 1;
    while (start <= end && str[start] === ' '){
        start++;
    }
    while (end>=start && str[end] === ' '){
        end--
    }
    return str.substring(start, end+1);
}
let userStr = prompt('Введите строку');
let res = removeSpace(userStr);
alert(`*${res}*`);