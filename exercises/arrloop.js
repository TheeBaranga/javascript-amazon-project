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

const food = ['egg', 'apple', 'banana', 'egg', 'grape'];

export function removeEgg(array) {
    const reversedArray = array.toReversed();
    let newarray = [];
    let removed = 0;
    for (let i = 0; i < reversedArray.length; i++) {
        if (reversedArray[i] === 'egg' && removed < 2) {
            removed++;
        } else {
            newarray.push(reversedArray[i]);
        }   
    }
    return newarray.toReversed();
}

 export function countOccurrences() {
    for (let i = 1; i <= 20; i++) {
    if (i%3 === 0 && i%5 === 0) {
        console.log('fizzbuzz');
    } else if (i%3 === 0) {
        console.log('fizz');
    } else if (i%5 === 0) {
        console.log('buzz');
    } else {
        console.log(i);
    }
}
}

colors = ['green', 'red', 'blue', 'yellow', 'red'];

array.forEach(element => {
    function findIndex(array, col) {
        newcol = [];
        for (let i = 0; i < array.length; i++) {
          if (array[i] !== col) {
            newcol.push(array[i]);
          }
        }
        return newcol;
      }
});