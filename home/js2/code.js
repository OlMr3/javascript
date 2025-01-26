
function treeSum(arr) {
    let start = 0;
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (typeof item === 'number') {
            start += item;
        } else
            if (Array.isArray(item)) {
                start += treeSum(item);
            }
    }
    return start;
}
let array = [5, 7,
    [4, [2], 8, [1, 3], 2],
    [9, []],
    1, 8];
let res = treeSum(array);
alert(res);