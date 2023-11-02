/* javascript */

/* 
TO-DOs:
- get a list of all possible words, and sort words by popularity, make the computer
choose the most popular word as well
- save local state, so if I close a tab, it still comes back to the same state
*/

/*
Thanks to this github page (too many contributors to list) for the list of words
https://github.com/dwyl/english-words/tree/master
*/

/* Word List Functionality */
let wordList = Object.keys(words);

function filterList(currWord) {
    let newWords = [];
    wordList.forEach(word => {
        if (word.startsWith(currWord)) {
            newWords.push(word);
        };
    });

    return newWords;
}

/* Differentiate between who played what letter */
function updateLetterStyles(myContent) {
    console.log(myContent);
    myContent = '<span class="underline">' + myContent + '</span>';
    console.log(myContent);
    return myContent;
}

/* Hard Mode Functionality */
let hardMode = false;
let buttonClicked = false;
let hardModeButton = document.getElementById("hardMode");
let title = document.getElementById("title");
let myAnswer = document.getElementById("myAnswer");

function hardModeOff() {
    document.body.style.backgroundColor = "#500375";
    title.classList.remove("title-hard");
    title.classList.add("title");
    hardModeButton.textContent = "Hard Mode";
    hardModeButton.style.color = "red";
    myAnswer.style.color = "#500375";

    hardMode = false;
    buttonClicked = false;

    seconds = 60;
    myTimer.textContent = "1:00";
}

function hardModeOn() {
    document.body.style.backgroundColor = "black";
    title.classList.remove("title");
    title.classList.add("title-hard");
    hardModeButton.textContent = "Easy Mode";
    hardModeButton.style.color = "#500375";
    myAnswer.style.color = "red";

    hardMode = true;
    buttonClicked = true;

    seconds = 30;
    myTimer.textContent = "0:30";
}

hardModeButton.addEventListener("click", () => {
    if(buttonClicked){
        hardModeOff();
    } else {
        hardModeOn();
    }
});


/* timer for the player's choice */
let myTimer = document.getElementById("myTimer");
let seconds;
let timerStarted = false;
let timer;

function playerChoice(){
    if(timerStarted === false){
        timerStarted = true;
        hardModeButton.disabled = true;
        timer = setInterval(function(){
            if(seconds > 0){
                if(seconds === 60){
                    myTimer.textContent = "1:00";
                } else if(seconds < 10){
                    myTimer.textContent = "0:0" + String(seconds);
                    myTimer.style.color = "red";
                } else {
                    myTimer.textContent = "0:" + String(seconds);
                }
                seconds--;
            } else {
                clearInterval(timer);
                timerStarted = false;
                hardModeButton.disabled = false;
                seconds = 60;
                myTimer.textContent = "0:00";
                gameUpdate.textContent = "The timer ran out, you lost the round! The computer was spelling " + computerWord;
                if(updateScore(0)){
                    gameUpdate.textContent = "GAME OVER! YOU LOST!";
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
    let cpuLetter = cpuWord[currWord.length];
    if(hardMode){
        let count = 0;
        while(cpuWord.length % 2 === 0 || newWords.includes(currWord + cpuLetter)){
            if(count === newWords.length){
                return[cpuLetter, cpuWord];
            }
            count++;
            cpuWord = newWords[Math.floor(Math.random() * newWords.length)];
            cpuLetter = cpuWord[currWord.length];
        }
    }
    return [cpuLetter, cpuWord];
}

function resetTimer() {
    /* clear the timer */
    timerStarted = false;
    myTimer.style.color = "white";
    if(hardMode){
        seconds = 30;
        myTimer.textContent = "0:30";
    } else {
        seconds = 60;
        myTimer.textContent = "1:00";
    }
    clearInterval(timer);
}

let myGame = document.querySelector("#myGame");
let myWord = document.getElementById("myWord");
let gameUpdate = document.getElementById("gameUpdate");
let playAgain = document.getElementById("playAgain");
let computerWord;

playAgain.addEventListener("click", () => {
    myWord.textContent = '';
    myGame.myAnswer.value = '';
    gameUpdate.textContent = '';
    myCount.textContent = '';
    cpuCount.textContent = '';
    computerWord = '';
    displayWord = '';
    myScore = 0;
    cpuScore = 0;
    resetTimer();
    hardModeButton.disabled = false;
})

function gameLogic(currWord, myAnswer) {
    myAnswer.disabled = false;
    if(wordList.includes(currWord)){
        hardModeButton.disabled = false;
        gameUpdate.textContent = "You lost the round! You spelled " + currWord;
        currWord = '';
        resetTimer();
        if(updateScore(0)){
            gameUpdate.textContent = "GAME OVER! YOU LOST!";
        }
    } else {
        let newWords = filterList(currWord);
        if(newWords.length == 0){
            gameUpdate.textContent = "The word you are spelling is not in the dictionary. Try again."
            myWord.textContent = myWord.textContent.slice(0, -1);
            currWord = myWord.textContent;
        } else {
            resetTimer();
            choice = computerChoice(newWords, currWord);
            computerWord = choice[1];
            currWord = currWord + choice[0];
                if(wordList.includes(currWord)){
                    hardModeButton.disabled = false;
                    gameUpdate.textContent = "You won the round! The computer spelled " + currWord;
                    currWord = '';
                    if(updateScore(1)) {
                        currWord = "GAME OVER! YOU WON!";
                    }
                } else {
                    /* One minute timer */
                    playerChoice();
                    myWord.innerHTML = updateLetterStyles(myWord.innerHTML);
                }
            }

        }
    myWord.textContent = currWord;
};

myGame.addEventListener("submit", (event) => {
    event.preventDefault();

    this.myAnswer.disabled = true;
    let currWord = myWord.textContent + this.myAnswer.value;
    myWord.textContent = myWord.textContent + this.myAnswer.value;
    gameUpdate.textContent = '';

    setTimeout(() => {
        gameLogic(currWord, this.myAnswer);
    }, 1000);

    /* Reset the answer box */
    this.myAnswer.value = '';

});