const words = [
    { word: "ATP", question: "What is required for T4 DNA ligase to function?" },
    { word: "Sucrose", question: "_________________used in increase the density of the sample in the Agarose gel electrophoresis." },
    { word: "Magnesium", question: "_____________ ions are important for the activity of Type 2 restriction enzyme ." },
    { word: "Alkaline phosphatase", question: "Enzyme used to remove the phosphate from the 5' end is _____________" },
    { word: "10", question: "The volume of enzyme should not be more than _____ of the total reaction mixture." },
    { word: "SDS", question: "Which component is commonly used to lyse cells during DNA extraction?" },
    { word: "Protein", question: "The purpose of adding Proteinase K in DNA extraction is _______________ degradation " },
    { word: "Acetate", question: "__________buffer is used to neutralise the pH in the DNA isolation" },
    { word: "sodium hydroxide", question: "____________is used to lysis the cell in the Plasmid DNA isolation." },
    { word: "Palindrome", question: "Recognition site will be have the __________ sequence." }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedData, selectedWord, questionText, guessedWord, wrongGuesses;
let username = "";
const maxWrong = 6;
let timeLeft = 60;
let timerInterval;

const hangmanParts = [
    "#head", "#body", "#left-arm", 
    "#right-arm", "#left-leg", "#right-leg"
];

function startGame() {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter your name to start the game.");
        return;
    }
    
    document.getElementById("name-container").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    
    currentQuestionIndex = 0;
    score = 0;
    initializeGame();
    startTimer();
}

function restartGame() {
    document.getElementById("result-container").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    currentQuestionIndex = 0;
    score = 0;
    initializeGame();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    document.getElementById("message").textContent = "Time's up! The answer was: " + selectedWord;
    document.getElementById("next-button").style.display = "block";
    disableAllButtons();
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}`;
}

function disableAllButtons() {
    const buttons = document.querySelectorAll("#letters button");
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = "0.6";
    });
}

function loadNextQuestion() {
    if (currentQuestionIndex < words.length - 1) {
        currentQuestionIndex++;
        resetTimer();
        initializeGame();
        startTimer();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("final-result").textContent = 
        `${username}, your final score is: ${score} out of ${words.length * 10}`;
    exportScoreToExcel();
}
function exportScoreToExcel() {
    const now = new Date();
    const formattedTime = now.toLocaleString("en-IN", { hour12: true });
    const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");

    const newEntry = {
        Name: username,
        Score: score,
        Date: formattedTime
    };

    let existingData = JSON.parse(localStorage.getItem("hangmanResults")) || [];
    existingData.push(newEntry);
    localStorage.setItem("hangmanResults", JSON.stringify(existingData));

    const worksheet = XLSX.utils.json_to_sheet(existingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    const filename = `Hangman_Scores_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
}

    clearInterval(timerInterval);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("final-result").textContent = 
        `${username}, your final score is: ${score} out of ${words.length * 10}`;
}

function initializeGame() {
    selectedData = words[currentQuestionIndex];
    selectedWord = selectedData.word;
    questionText = selectedData.question;
    guessedWord = Array(selectedWord.length).fill("_");
    wrongGuesses = 0;
    
    // Automatically reveal spaces and special characters
    for (let i = 0; i < selectedWord.length; i++) {
        const char = selectedWord[i];
        if (char === " " || !/[A-Za-z]/.test(char)) {
            guessedWord[i] = char;
        }
    }
    
    document.getElementById("next-button").style.display = "none";
    document.getElementById("message").textContent = "";
    document.getElementById("letters").innerHTML = "";
    
    createLetterButtons();
    updateDisplay();
    resetHangman();
}

function resetHangman() {
    hangmanParts.forEach(part => {
        document.querySelector(part).style.visibility = "hidden";
    });
}

function updateDisplay() {
    document.getElementById("word-display").textContent = guessedWord.join(" ");
    document.getElementById("question").textContent = questionText;
    document.getElementById("score").textContent = `Score: ${score}`;
    updateHangman();
}

function updateHangman() {
    for (let i = 0; i < wrongGuesses && i < hangmanParts.length; i++) {
        document.querySelector(hangmanParts[i]).style.visibility = "visible";
    }
}

function checkLetter(letter) {
    let correctGuess = false;
    
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i].toLowerCase() === letter.toLowerCase()) {
            guessedWord[i] = selectedWord[i]; // Preserve original case
            correctGuess = true;
        }
    }
    
    if (!correctGuess) {
        wrongGuesses++;
    }
    
    updateDisplay();
    checkGameStatus();
}

function checkGameStatus() {
    if (!guessedWord.includes("_")) {
        document.getElementById("message").textContent = "Correct! +10 points";
        document.getElementById("message").style.color = "green";
        score += 10;
        document.getElementById("next-button").style.display = "block";
        clearInterval(timerInterval);
        disableAllButtons();
    } else if (wrongGuesses >= maxWrong) {
        document.getElementById("message").textContent = `Game Over! The answer was: ${selectedWord}`;
        document.getElementById("message").style.color = "red";
        document.getElementById("next-button").style.display = "block";
        clearInterval(timerInterval);
        disableAllButtons();
    }
}

function createLetterButtons() {
    const lettersDiv = document.getElementById("letters");
    lettersDiv.innerHTML = "";
    
    // Create A-Z buttons
    for (let char of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        let btn = document.createElement("button");
        btn.textContent = char;
        btn.className = "letter-btn";
        btn.onclick = function() {
            this.disabled = true;
            this.style.backgroundColor = "#6c757d";
            checkLetter(char);
        };
        lettersDiv.appendChild(btn);
    }
    
    // Add space button
    let spaceBtn = document.createElement("button");
    spaceBtn.textContent = "SPACE";
    spaceBtn.className = "space-btn";
    spaceBtn.onclick = function() {
        this.disabled = true;
        this.style.backgroundColor = "#495057";
        checkLetter(" ");
    };
    lettersDiv.appendChild(spaceBtn);
}

// Initialize on window load
window.onload = function() {
    document.getElementById("username").focus();
};