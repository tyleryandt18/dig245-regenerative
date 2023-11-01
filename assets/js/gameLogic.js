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

let wordList = Object.keys(words);

/* wordList.sort(); */

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
                    myTimer.style.color = "white";
                } else if(seconds < 10){
                    myTimer.textContent = "0:0" + String(seconds);
                    myTimer.style.color = "red";
                } else {
                    myTimer.textContent = "0:" + String(seconds);
                    myTimer.style.color = "white";
                }
                seconds--;
            } else {
                clearInterval(timer);
                timerStarted = false;
                seconds = 60;
                myTimer.textContent = "0:00";
                gameUpdate.textContent = "The timer ran out, you lost the round! The computer was spelling " + computerWord;
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

let hardMode = false;
let buttonClicked = false;
let hardModeButton = document.getElementById("hard-mode");
let title = document.getElementsByClassName("title");
console.log(title);

hardModeButton.addEventListener("click", () => {
    if(buttonClicked){
        document.body.style.backgroundColor = "#500375";
        
        hardMode = false;
        buttonClicked = false;
    } else {
        document.body.style.backgroundColor = "black";
        title[0].style.background = "-webkit-linear-gradient(red, black);"

        hardMode = true;
        buttonClicked = true;
    }
});

function computerChoice(newWords, currWord) {
    let randomNum = Math.floor(Math.random() * newWords.length);
    let cpuWord = newWords[randomNum];
    if(hardMode){
        let count = 0;
        while(cpuWord.length % 2 !== 0){
            console.log(cpuWord);
            count++;
            if(count === newWords.length){
                let cpuLetter = cpuWord[currWord.length];
                return[cpuLetter, cpuWord];
            }
            cpuWord = newWords[randomNum + count];
        }
    }
    let cpuLetter = cpuWord[currWord.length]; /* No -1 to adjust for grabbing the next letter */
    /* TO-DO: change so the computer tries to spell a word that won't cause it to lose */
    return [cpuLetter, cpuWord];
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
    playAgain.style.display = "none";
})

myGame.addEventListener("submit", (event) => {
    event.preventDefault();

    this.myAnswer.disabled = true;
    let currWord = myWord.textContent + this.myAnswer.value;
    gameUpdate.textContent = '';

    /* clear the timer */
    timerStarted = false;
    seconds = 60;
    myTimer.textContent = "1:00";
    clearInterval(timer);

    setTimeout(() => {
        this.myAnswer.disabled = false;
        if(wordList.includes(currWord)){
            gameUpdate.textContent = "You lost the round! You spelled " + currWord;
            currWord = '';
            restartTimer = false;
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
                choice = computerChoice(newWords, currWord);
                computerWord = choice[1];
                currWord = currWord + choice[0];
                    if(wordList.includes(currWord)){
                        gameUpdate.textContent = "You won the round! The computer spelled " + currWord;
                        currWord = '';
                        if(updateScore(1)) {
                            currWord = "GAME OVER! YOU WON!";
                            playAgain.style.display = "initial";
                        }
                    } else {
                        /* One minute timer */
                        playerChoice();
                    }
                }
    
            }
        myWord.textContent = currWord;

    }, 1000);

    /* Reset the answer box */
    this.myAnswer.value = '';

});