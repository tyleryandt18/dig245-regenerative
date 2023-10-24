/* javascript */

let wordList = [
    "audio",
    "brand",
    "cute",
    "trust",
    "ionic",
    "place",
    "flying",
    "great",
    "quiche",
    "quit",
    "quick",
    "quack",
    "quake",
    "quaking",
    "boot",
    "allocate",
    "brake",
    "crack",
    "crank",
    "lever",
    "level",
    "little",
    "litter"
];

wordList.sort();

function filterList(currWord) {
    let newWords = [];
    wordList.forEach(word => {
        if (word.startsWith(currWord)) {
            newWords.push(word);
        };
    });

    return newWords;
}

let myGame = document.querySelector("#myGame");
let myWord = document.getElementById("myWord");
let myButton = document.getElementById("reset");

myButton.addEventListener("click", (event) => {
    myWord.textContent = '';
    myGame.myAnswer.value = '';
    myButton.style.display = "none";
})

myGame.addEventListener("submit", (event) => {
    event.preventDefault();

    let currWord = myWord.textContent + this.myAnswer.value;

    if(wordList.includes(currWord)){
        currWord = "You Lost! You spelled " + currWord;
        myButton.style.display = "block";
    } else {
        let newWords = filterList(currWord);
        if(newWords.length == 0){
            alert("The word you are spelling is not in the dictionary. Try Again.");
            currWord = myWord.textContent;
        } else {
            let cpuWord = newWords[Math.floor(Math.random() * newWords.length)];
            let cpuLetter = cpuWord[currWord.length]; /* No -1 to adjust for grabbing the next letter */
            /* TO-DO: change so the computer tries to spell a word that won't cause it to lose */
            currWord = currWord + cpuLetter;
            if(wordList.includes(currWord)){
                currWord = "You Won! The computer spelled " + currWord;
                myButton.style.display = "block";
            }
        }
    }

    myWord.textContent = currWord;
    
    /* Reset myAnswer to be empty */
    this.myAnswer.value = '';
});
