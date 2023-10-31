/* javascript */

/* 
TO-DOs:
- Bootstrap danger class for warning message when word isn't in dictionary
- get a list of all possible words, and sort words by popularity, make the computer
choose the most popular word as well
- save local state, so if I close a tab, it still comes back to the same state
*/

/*
Thanks to this github page (too many contributors to list) for the list of words
https://github.com/dwyl/english-words/tree/master
*/

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

/* 1 minute timer for the player's choice */
let myTimer = document.getElementById("myTimer");
let seconds = 60;
let timerStarted = false;
let timer;

function playerChoice(){
    if(timerStarted === false){
        timerStarted = true;
        timer = setInterval(function(){
            if(seconds > 0){
                if(seconds === 60){
                    myTimer.textContent = "1:00";
                } else if(seconds < 10){
                    myTimer.textContent = "0:0" + String(seconds);
                } else {
                    myTimer.textContent = "0:" + String(seconds);
                }
                seconds--;
            } else {
                clearInterval(timer);
                timerStarted = false;
                seconds = 60;
                myTimer.textContent = "0:00";
                gameUpdate.textContent = "The timer ran out, you lost the round!";
                if(updateScore(0)){
                    gameUpdate.textContent = "GAME OVER! YOU LOST!";
                    playAgain.style.display = "initial";
                }
            }
        }, 1000)
    }
}

let myScore = 0;
let cpuScore = 0;
let myCount = document.getElementById("myCount");
let cpuCount = document.getElementById("cpuCount");
const GHOST = "GHOST";

function updateScore(flag) {
    myWord.textContent = '';
    if(flag == 0) {
        myCount.textContent = myCount.textContent + GHOST[myScore];
        myScore++;
    } else if (flag == 1) {
        cpuCount.textContent = cpuCount.textContent + GHOST[cpuScore];
        cpuScore++;
    }
    if((myScore == 5) || (cpuScore == 5)){
        return true;
    } else {
        return false;
    }
}

function computerChoice(newWords, currWord) {
    let cpuWord = newWords[Math.floor(Math.random() * newWords.length)];
    let cpuLetter = cpuWord[currWord.length]; /* No -1 to adjust for grabbing the next letter */
    /* TO-DO: change so the computer tries to spell a word that won't cause it to lose */
    return cpuLetter;
}

let myGame = document.querySelector("#myGame");
let myWord = document.getElementById("myWord");
let gameUpdate = document.getElementById("gameUpdate");
let playAgain = document.getElementById("playAgain");

playAgain.addEventListener("click", () => {
    myWord.textContent = '';
    myGame.myAnswer.value = '';
    gameUpdate.textContent = '';
    myCount.textContent = "Your Letters: ";
    cpuCount.textContent = "Computer's Letters: ";
    myScore = 0;
    cpuScore = 0;
    playAgain.style.display = "none";
})

myGame.addEventListener("submit", (event) => {
    event.preventDefault();

    /* clear the timer */
    timerStarted = false;
    seconds = 60;
    myTimer.textContent = "1:00";
    clearInterval(timer);

    this.myAnswer.disabled = true;
    let currWord = myWord.textContent + this.myAnswer.value;
    gameUpdate.textContent = '';

    setTimeout(() => {
        this.myAnswer.disabled = false;
        if(wordList.includes(currWord)){
            gameUpdate.textContent = "You lost the round! You spelled " + currWord;
            currWord = '';
            if(updateScore(0)){
                gameUpdate.textContent = "GAME OVER! YOU LOST!";
                playAgain.style.display = "initial";
            }
        } else {
            let newWords = filterList(currWord);
            if(newWords.length == 0){
                gameUpdate.textContent = "The word you are spelling is not in the dictionary. Try again."
                currWord = myWord.textContent;
            } else {
                currWord = currWord + computerChoice(newWords, currWord);
                    if(wordList.includes(currWord)){
                        gameUpdate.textContent = "You won the round! The computer spelled " + currWord;
                        currWord = '';
                        if(updateScore(1)) {
                            currWord = "GAME OVER! YOU WON!";
                            playAgain.style.display = "initial";
                        }
                    } else {
                        /* 1 minute timer for the player to enter a letter */
                        playerChoice();
                    }
                }
    
            }
        myWord.textContent = currWord;

    }, 1000);

    /* Reset the answer box */
    this.myAnswer.value = '';
});