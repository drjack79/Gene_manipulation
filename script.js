// Firebase libraries are imported dynamically in initializeFirebase function
// This setup handles cases where __firebase_config and __initial_auth_token
// might not be defined (e.g., when running locally outside the Canvas environment).

// Data for the game: questions and their answers
const gameData = [
    { question: "The building blocks of DNA are __________.", answer: "NUCLEOTIDES" },
    { question: "The sugar present in RNA is __________.", answer: "RIBOSE" },
    { question: "__________ bonds link the nitrogenous bases of two DNA strands.", answer: "HYDROGEN" },
    { question: "The enzyme responsible for DNA replication is __________.", answer: "DNA POLYMERASE" },
    { question: "Transcription is the process of synthesizing __________ from a DNA template.", answer: "RNA" },
    { question: "The three stop codons in the genetic code are __________, __________, and __________.", answer: "UAA UAG UGA" },
    { question: "In eukaryotes, mRNA undergoes post-transcriptional modifications like __________, __________, and __________.", answer: "SPLICING 5' CAPPING POLYADENYLATION" },
    { question: "The enzyme that synthesizes RNA during transcription is __________.", answer: "RNA POLYMERASE" },
    { question: "The Central Dogma of molecular biology states: DNA → __________ → __________.", answer: "RNA PROTEIN" },
    { question: "The region of DNA where RNA polymerase binds to initiate transcription is called the __________.", answer: "PROMOTER" },
    { question: "Ribosomes are composed of __________ and __________.", answer: "RRNA PROTEINS" },
    { question: "tRNA has a three-nucleotide sequence called __________ that pairs with the mRNA codon.", answer: "ANTICODON" },
    { question: "DNA replication is __________, meaning each new DNA molecule has one old and one new strand.", answer: "SEMICONSERVATIVE" },
    { question: "In prokaryotes, the cluster of genes regulated together is called an __________.", answer: "OPERON" },
    { question: "The process of translating mRNA into protein takes place in the __________.", answer: "RIBOSOME" },
    { question: "The enzyme __________ seals the gaps between Okazaki fragments on the lagging strand.", answer: "DNA LIGASE" },
    { question: "A mutation that does not affect the amino acid sequence is called a __________ mutation.", answer: "SILENT" },
    { question: "Histones are proteins around which __________ wraps in eukaryotic cells.", answer: "DNA" },
    { question: "The short RNA primers in DNA replication are synthesized by the enzyme __________.", answer: "PRIMASE" },
    { question: "The process by which genes are silenced through small RNAs is called __________.", answer: "RNA INTERFERENCE" }
];

// Game state variables
let playerName = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentWord = '';
let maskedWord = [];
let guessedLetters = new Set();
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6; // Head, Body, 2 Arms, 2 Legs
let score = 0;
let timer;
let timeLeft = 60;
let gameActive = false; // Flag to control game flow during transitions
let db; // Firestore instance
let auth; // Auth instance
let userId; // Current user ID
let scoresCollectionRef; // Reference to the Firestore collection for scores
let firebaseInitialized = false; // Flag to track Firebase initialization status

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const playerNameInput = document.getElementById('playerName');
const startGameButton = document.getElementById('startGameButton');
const viewLeaderboardButtonWelcome = document.getElementById('viewLeaderboardButtonWelcome');
const displayPlayerName = document.getElementById('displayPlayerName');
const questionDisplay = document.getElementById('questionDisplay');
const wordDisplay = document.getElementById('wordDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const guessInput = document.getElementById('guessInput');
const guessedLettersDisplay = document.getElementById('guessedLettersDisplay').querySelector('span');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('scoreDisplay');
const hangmanParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
const leaderboardList = document.getElementById('leaderboardList');
const downloadCsvButton = document.getElementById('downloadCsvButton');
const backToWelcomeButton = document.getElementById('backToWelcomeButton');

// Message box elements
const messageBox = document.getElementById('messageBox');
const messageBoxText = document.getElementById('messageBoxText');
const messageBoxButton = document.getElementById('messageBoxButton');

// Function to show custom message box
function showMessageBox(message, callback = null) {
    messageBoxText.textContent = message;
    messageBox.style.display = 'block';
    messageBoxButton.onclick = () => {
        messageBox.style.display = 'none';
        guessInput.focus();
        if (callback) {
            callback();
        }
    };
}

// --- Firebase Initialization ---
async function initializeFirebase() {
    try {
        // Use global variables if defined, otherwise provide empty defaults for local testing
         const firebaseConfig = {
    apiKey: "AIzaSyBRD3CDd6jH_xIYExErNioHDN1oP1Q_j4A",
    authDomain: "hangman-1920.firebaseapp.com",
    projectId: "hangman-1920",
    storageBucket: "hangman-1920.firebasestorage.app",
    messagingSenderId: "62296248655",
    appId: "1:62296248655:web:9c8c1631063b16df01753a",
    measurementId: "G-B6G0XDMTSX"
  };
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        // Check if Firebase config is provided. If not, Firebase features will be disabled.
        if (Object.keys(firebaseConfig).length === 0) {
            console.warn("Firebase config is missing. Leaderboard and score saving will be disabled.");
            showMessageBox("Firebase services are not configured. Leaderboard and score saving will be unavailable.", () => {
                // Disable Firebase-dependent buttons
                viewLeaderboardButtonWelcome.disabled = true;
                downloadCsvButton.disabled = true;
            });
            return; // Exit if no config
        }

        // Dynamically import Firebase modules. This assumes the browser supports ES modules.
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
        const { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
        const { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Sign in with custom token if available, otherwise anonymously
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                // Define the collection path for public scores
                scoresCollectionRef = collection(db, `artifacts/${appId}/public/data/scores`);
                firebaseInitialized = true; // Set flag to true
                console.log("Firebase initialized and user authenticated:", userId);
            } else {
                console.log("No user signed in.");
                firebaseInitialized = false; // Set flag to false if no user
            }
        });
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        showMessageBox(`Failed to initialize game services: ${error.message}`, () => {
            // Disable Firebase-dependent buttons on error
            viewLeaderboardButtonWelcome.disabled = true;
            downloadCsvButton.disabled = true;
        });
        firebaseInitialized = false; // Ensure flag is false on error
    }
}

// --- Game Initialization and Flow ---

// Enable start button only if name is entered
playerNameInput.addEventListener('input', () => {
    startGameButton.disabled = playerNameInput.value.trim() === '';
});

startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        displayPlayerName.textContent = playerName;
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initializeGame();
    }
});

viewLeaderboardButtonWelcome.addEventListener('click', () => {
    if (!firebaseInitialized) {
        showMessageBox("Leaderboard is unavailable because Firebase services are not configured or failed to initialize.");
        return;
    }
    welcomeScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
    fetchAndDisplayLeaderboard();
});

backToWelcomeButton.addEventListener('click', () => {
    leaderboardScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
});

function initializeGame() {
    // Shuffle gameData and pick 10 questions
    currentQuestions = shuffleArray(gameData).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;
    gameActive = true; // Game is now active
    loadNextQuestion();
}

function loadNextQuestion() {
    if (currentQuestionIndex < currentQuestions.length) {
        clearTimeout(timer); // Clear any existing timer
        resetHangmanFigure();
        guessedLetters.clear();
        incorrectGuesses = 0;
        timeLeft = 60; // Reset timer for new question
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        timerDisplay.classList.remove('text-red-700'); // Reset timer color
        messageDisplay.textContent = '';
        guessInput.value = '';
        guessInput.focus();
        guessedLettersDisplay.textContent = ''; // Clear guessed letters display

        const { question, answer } = currentQuestions[currentQuestionIndex];
        questionDisplay.textContent = question;
        currentWord = answer.toUpperCase();
        maskedWord = currentWord.split('').map(char => {
            if (char === ' ' || char === "'" || char === "-") { // Keep spaces, apostrophes, hyphens visible
                return char;
            }
            return '_';
        });
        updateWordDisplay();
        startTimer();
    } else {
        endGame();
    }
}

function updateWordDisplay() {
    wordDisplay.textContent = maskedWord.join(' ');
}

function updateGuessedLettersDisplay() {
    guessedLettersDisplay.textContent = Array.from(guessedLetters).sort().join(', ');
}

function startTimer() {
    clearTimeout(timer); // Ensure only one timer is running
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 10) {
            timerDisplay.classList.add('text-red-700'); // Make timer red when low
        } else {
            timerDisplay.classList.remove('text-red-700');
        }

        if (timeLeft <= 0) {
            clearTimeout(timer);
            gameActive = false; // Temporarily pause game input
            showMessageBox(`Time's up! The word was "${currentWord}".`, () => {
                gameActive = true; // Resume game input
                currentQuestionIndex++;
                loadNextQuestion();
            });
        }
    }, 1000);
}

function handleGuess(event) {
    if (!gameActive) return; // Prevent input during transitions
    if (event.key === 'Enter') {
        const guess = guessInput.value.trim().toUpperCase();
        guessInput.value = ''; // Clear input field immediately

        if (!guess || guess.length !== 1 || !/[A-Z]/.test(guess)) {
            messageDisplay.textContent = 'Please enter a single letter (A-Z).';
            return;
        }

        if (guessedLetters.has(guess)) {
            messageDisplay.textContent = `You already guessed "${guess}". Try another letter.`;
            return;
        }

        guessedLetters.add(guess);
        updateGuessedLettersDisplay();
        messageDisplay.textContent = ''; // Clear previous messages

        if (currentWord.includes(guess)) {
            // Correct guess
            let found = false;
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] === guess) {
                    maskedWord[i] = guess;
                    found = true;
                }
            }
            updateWordDisplay();
            checkWinLoss();
        } else {
            // Incorrect guess
            incorrectGuesses++;
            drawHangmanPart(incorrectGuesses);
            checkWinLoss();
        }
    }
}

guessInput.addEventListener('keydown', handleGuess);

function checkWinLoss() {
    if (maskedWord.join('') === currentWord) {
        // Win current word
        clearTimeout(timer);
        score++;
        scoreDisplay.textContent = score;
        gameActive = false; // Temporarily pause game input
        showMessageBox(`Correct! The word was "${currentWord}".`, () => {
            gameActive = true; // Resume game input
            currentQuestionIndex++;
            loadNextQuestion();
        });
    } else if (incorrectGuesses >= maxIncorrectGuesses) {
        // Lose current word (Hangman complete)
        clearTimeout(timer);
        gameActive = false; // Temporarily pause game input
        showMessageBox(`Game Over! The word was "${currentWord}".`, () => {
            gameActive = true; // Resume game input
            currentQuestionIndex++;
            loadNextQuestion();
        });
    }
}

function drawHangmanPart(partNumber) {
    if (partNumber > 0 && partNumber <= hangmanParts.length) {
        document.getElementById(hangmanParts[partNumber - 1]).classList.remove('hidden');
    }
}

function resetHangmanFigure() {
    hangmanParts.forEach(partId => {
        document.getElementById(partId).classList.add('hidden');
    });
}

async function endGame() {
    clearTimeout(timer);
    gameActive = false; // Game is no longer active
    showMessageBox(`Game complete, ${playerName}! Your final score is ${score} out of ${currentQuestions.length}.`, async () => {
        if (firebaseInitialized && db && scoresCollectionRef) {
            try {
                showMessageBox("Saving your score...", async () => {
                    await addDoc(scoresCollectionRef, {
                        playerName: playerName,
                        score: score,
                        timestamp: serverTimestamp(), // Firestore timestamp
                        userId: userId // Store userId for potential filtering/tracking
                    });
                    console.log("Score saved successfully!");
                    showMessageBox("Score saved! What's next?", () => {
                        welcomeScreen.classList.remove('hidden');
                        gameScreen.classList.add('hidden');
                        playerNameInput.value = '';
                        startGameButton.disabled = true;
                    });
                });
            } catch (e) {
                console.error("Error adding document: ", e);
                showMessageBox(`Failed to save score: ${e.message}`, () => {
                    welcomeScreen.classList.remove('hidden');
                    gameScreen.classList.add('hidden');
                    playerNameInput.value = '';
                    startGameButton.disabled = true;
                });
            }
        } else {
            console.warn("Firebase not initialized. Score will not be saved.");
            showMessageBox("Game ended, but score could not be saved (Firebase not configured or initialized).", () => {
                welcomeScreen.classList.remove('hidden');
                gameScreen.classList.add('hidden');
                playerNameInput.value = '';
                startGameButton.disabled = true;
            });
        }
    });
}

// --- Leaderboard Functions ---
function fetchAndDisplayLeaderboard() {
    leaderboardList.innerHTML = '<li class="text-gray-500 text-center py-4">Loading scores...</li>';
    if (!firebaseInitialized || !db || !scoresCollectionRef) {
        leaderboardList.innerHTML = '<li class="text-red-500 text-center py-4">Leaderboard unavailable: Firebase not initialized.</li>';
        return;
    }

    // Query scores, ordered by score descending, then by timestamp descending
    const q = query(scoresCollectionRef, orderBy("score", "desc"), orderBy("timestamp", "desc"));

    // Listen for real-time updates to the leaderboard
    onSnapshot(q, (snapshot) => {
        const scores = [];
        snapshot.forEach((doc) => {
            scores.push({ id: doc.id, ...doc.data() });
        });
        renderLeaderboard(scores);
    }, (error) => {
        console.error("Error fetching leaderboard:", error);
        leaderboardList.innerHTML = `<li class="text-red-500 text-center py-4">Error loading scores: ${error.message}</li>`;
    });
}

function renderLeaderboard(scores) {
    leaderboardList.innerHTML = ''; // Clear existing list
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<li class="text-gray-500 text-center py-4">No scores yet. Be the first to play!</li>';
        return;
    }

    scores.forEach((scoreEntry, index) => {
        const listItem = document.createElement('li');
        listItem.className = `flex justify-between items-center p-3 rounded-lg mb-2 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`;
        // Ensure timestamp exists before trying to convert
        const date = scoreEntry.timestamp && typeof scoreEntry.timestamp.toDate === 'function' ? new Date(scoreEntry.timestamp.toDate()).toLocaleString() : 'N/A';
        listItem.innerHTML = `
            <span class="font-semibold text-gray-800">${index + 1}. ${scoreEntry.playerName}</span>
            <span class="text-blue-600 font-bold">${scoreEntry.score} / 10</span>
            <span class="text-sm text-gray-500">${date}</span>
        `;
        leaderboardList.appendChild(listItem);
    });
}

function downloadCsv(scores) {
    if (!firebaseInitialized) {
        showMessageBox("Cannot download scores: Firebase services are not configured or failed to initialize.");
        return;
    }
    if (scores.length === 0) {
        showMessageBox("No scores to download.");
        return;
    }

    let csvContent = "Player Name,Score,Date\n"; // CSV Header
    scores.forEach(scoreEntry => {
        const date = scoreEntry.timestamp && typeof scoreEntry.timestamp.toDate === 'function' ? new Date(scoreEntry.timestamp.toDate()).toLocaleString() : 'N/A';
        // Enclose fields in quotes to handle commas within names/dates
        csvContent += `"${scoreEntry.playerName}",${scoreEntry.score},"${date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'molecular_biology_hangman_scores.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

downloadCsvButton.addEventListener('click', () => {
    // Fetch current scores to ensure the CSV is up-to-date
    if (!firebaseInitialized || !db || !scoresCollectionRef) {
        showMessageBox("Database not initialized. Cannot download scores.");
        return;
    }
    const q = query(scoresCollectionRef, orderBy("score", "desc"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        const scores = [];
        snapshot.forEach((doc) => {
            scores.push({ id: doc.id, ...doc.data() });
        });
        downloadCsv(scores);
    }, (error) => {
        console.error("Error fetching scores for CSV:", error);
        showMessageBox(`Error preparing CSV: ${error.message}`);
    });
});


// Utility function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initial setup: Initialize Firebase and focus on name input
window.onload = async () => {
    await initializeFirebase();
    playerNameInput.focus();
};
