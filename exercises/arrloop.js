const words = ['hello', 'world', 'search', 'search', 'good'];
let index = -1;

for (let i = 0; i < words.length; i++) {
    if (words[i] === 'search') {
        index = i;
        break; // Stops the loop immediately after the first find
    }
}

console.log(index);

function findIndex(array, word) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === word) {
            return i;
        }
    }
    return -1;
}
