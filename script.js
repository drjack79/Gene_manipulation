// Firebase libraries are imported dynamically in initializeFirebase function
// This setup handles cases where __firebase_config and __initial_auth_token
// might not be defined (e.g., when running locally outside the Canvas environment).

// Data for the game: questions and their answers
const gameData = [
{ question: "During DNA isolation, cells are typically lysed using a _________ buffer.", answer: "lysis" },
{ question: "To separate DNA from other cellular components, ____________________ is commonly used to precipitate DNA.", answer: "ethanol" },
{ question: "During DNA isolation, ____________________ is used to degrade proteins, preventing their co-precipitation with DNA.", answer: "Protease K" },
{ question: "The final step in many DNA isolation protocols involves resuspending the purified DNA in a low-salt buffer, such as ____________________.", answer: "TE buffer" },
{ question: "For plant DNA isolation, a common initial step is mechanical disruption, often using a ____________________ and mortar with liquid nitrogen.", answer: "pestle" },
{ question: "A key step in preparing a sample for DNA isolation is to homogenize the tissue or cells to ensure efficient ____________lysis____________.", answer: "lysis" },
{ question: "The primary goal of DNA isolation is to obtain DNA that is both pure and ____________________.", answer: "intact" },
{ question: "For quantifying DNA concentration after isolation, a spectrophotometer measures absorbance at ____________________ nm.", answer: "260" },
{ question: "The purpose of adding RNase during genomic DNA isolation is to remove contaminating ____________________.", answer: "RNA" },
{ question: "When isolating DNA from blood, ____________________ is typically used to lyse red blood cells while preserving white blood cells, which contain the DNA.", answer: "lysis buffer" },
{ question: "In plasmid isolation, the alkaline lysis method uses ________________________ to denature chromosomal and plasmid DNA.", answer: "high pH" },
{ question: "Following alkaline denaturation in plasmid isolation, ________________________ is added to neutralize the solution, causing chromosomal DNA and proteins to precipitate.", answer: "Potassium acetate" },
{ question: "After neutralization and centrifugation in plasmid isolation, the plasmid DNA remains in the ____________________.", answer: "supernatant" },
{ question: "Column-based plasmid isolation methods utilize a silica-based membrane to bind DNA in the presence of high ____________salt____________.", answer: "salt" },
{ question: "To elute plasmid DNA from a silica column, a low-salt buffer or ____________________ is used.", answer: "water" },
{ question: "During plasmid isolation, SDS (Sodium Dodecyl Sulfate) is a ____________________ that helps to disrupt bacterial cell membranes and denature proteins.", answer: "detergent" },
{ question: "When isolating plasmid DNA, the initial bacterial pellet is typically resuspended in a buffer containing __________ to weaken the cell wall.", answer: "lysozyme" },
{ question: "For large-scale plasmid isolation, a ________________________ culture volume is typically used.", answer: "large" },
{ question: "During plasmid isolation, the addition of a high-salt, low-pH solution causes the precipitation of chromosomal DNA and proteins, which is then removed by _________________.", answer: "centrifugation" },
{ question: "In plasmid isolation using the boiling method, brief heating denatures proteins and chromosomal DNA, while ______________ plasmid DNA remains intact.", answer: "supercoiled" },
{ question: "21. During RNA isolation, the enzyme ________________ is critical for degrading contaminating DNA.", answer: "DNase" },
{ question: "22. RNA is highly susceptible to degradation by ubiquitous enzymes called ________________________.", answer: "RNases" },
{ question: "23. To inhibit RNase activity during RNA isolation, researchers often work in a ________________________-free environment.", answer: "RNase" },
{ question: "24. A common chaotropic agent used in RNA isolation to denature proteins and inactivate RNases is ________________________ isothiocyanate.", answer: "Guanidinium" },
{ question: "25. After phenol-chloroform extraction in RNA isolation, RNA partitions into the ________________________ phase.", answer: "aqueous" },
{ question: "26. In RNA isolation using phenol-chloroform, ________________________ is often added to the phenol mixture to stabilize the interface and ensure cleaner separation of phases.", answer: "isoamyl alcohol" },
{ question: "27. The quality and quantity of isolated RNA can be assessed using a spectrophotometer by measuring absorbance at 260 nm and 280 nm, yielding the A260/A280 ratio to indicate ________________________ contamination.", answer: "protein" },
{ question: "28. When isolating RNA, extreme care must be taken to avoid contamination from ________________________, which are found on skin and dust.", answer: "RNases" },
{ question: "29. During RNA isolation, an A260/A230 ratio below 1.8 typically indicates contamination by ________________________, such as guanidinium salts or phenol.", answer: "organic compounds" },
{ question: "30. In RNA isolation, a common method to separate RNA from DNA and proteins involves using a density gradient, such as ____________________ chloride.", answer: "cesium" },
{ question: "31. After RNA isolation, it is common to assess the RNA integrity using gel electrophoresis to check for intact ribosomal RNA ________________________.", answer: "bands" },
{ question: "32. To minimize degradation during DNA and RNA isolation, all reagents and equipment should be kept ________________________.", answer: "cold" },
{ question: "33. RNA is typically stored in a freezer at ________________________ with RNase inhibitors to prevent degradation.", answer: "-80°C" },
{ question: "34. For RNA isolation from animal tissues, a common initial step is mechanical disruption using a ________________________ or bead beating.", answer: "sonicator" },
{ question: "________________________ is the process by which foreign DNA is introduced into a bacterial cell.", answer: "Transformation" },
{ question: "36. Bacterial cells are made ________________________ to DNA by treatments such as heat shock or electroporation.", answer: "competent" },
{ question: "37. For heat shock transformation, bacterial cells are incubated with DNA on ice, followed by a brief exposure to ________________________, and then returned to ice.", answer: "high temperature" },
{ question: "38. In electroporation, a short ________________________ pulse is applied to create temporary pores in the bacterial cell membrane.", answer: "electric" },
{ question: "39. After transformation, bacteria are typically grown on selective media containing an ________________________ resistance gene encoded by the plasmid.", answer: "antibiotic" },
{ question: "40. To increase the efficiency of transformation, bacterial cells are often treated with calcium chloride ($CaCl_2$) to make their membranes more permeable to DNA, a process known as chemical ________________________.", answer: "permeabilization" },
{ question: "41. Competent cells prepared for transformation are typically stored at ________________________ for long-term preservation.", answer: "-80°C" },
{ question: "42. After transformation, bacteria are typically allowed a recovery period in ________________________ media before plating on selective media.", answer: "rich" },
{ question: "43. In chemical transformation, the bacterial cells are incubated with DNA in the presence of ________________________ ions, typically from $CaCl_2$.", answer: "calcium" },
{ question: "44. After chemical transformation, a brief heat shock step at ________________________ increases the permeability of the bacterial cell membrane.", answer: "42°C" },
{ question: "45. The process of introducing foreign DNA into eukaryotic cells is generally referred to as ________________________.", answer: "transfection" },
{ question: "46. The efficiency of transformation can be quantified by calculating the number of transformants per ________________________ of DNA.", answer: "microgram" },
{ question: "The choice of bacterial strain for transformation depends on factors such as its ________________________ efficiency and compatibility with the plasmid.", answer: "transformation" },
{ question: "________________________ enzymes recognize and cut DNA at specific nucleotide sequences.", answer: "Restriction" },
{ question: "The specific DNA sequences recognized by restriction enzymes are often ________________________, meaning they read the same forwards and backwards on opposite strands.", answer: "palindromic" },
{ question: "Restriction enzymes can produce two types of ends: blunt ends or ________________________ ends.", answer: "sticky" },
{ question: "When sticky ends are generated, they can spontaneously anneal with complementary sticky ends from other DNA fragments through ________________________ bonding.", answer: "hydrogen" },
{ question: "To visualize restriction enzyme digestion products, DNA fragments are typically separated by size using ________________________ electrophoresis.", answer: "agarose gel" },
{ question: "Ligation requires an energy source, typically ________________________, to form the phosphodiester bond.", answer: "ATP" },
{ question: "For successful ligation, the DNA fragments must have compatible ________________________.", answer: "ends" },
{ question: "The optimal temperature for most ligase enzymes, particularly T4 DNA ligase, is around ________________________.", answer: "16°C" },
{ question: "When performing ligation, a molar ratio of ________________________ for insert to vector is often desired to promote efficient insertion.", answer: "3:1" },
{ question: "Restriction enzymes are endonucleases, meaning they cut DNA ________________________ the polynucleotide chain.", answer: "within" },
{ question: "After restriction digestion, the DNA fragments can be purified using a ________________________ kit to remove enzymes and buffers.", answer: "DNA clean-up" },
{ question: "For maximum yield in ligation, the reaction is often performed overnight at a lower temperature to allow for more stable ________________________ of sticky ends.", answer: "annealing" },
{ question: "A restriction enzyme that recognizes $GAATTC$ and cuts between G and A on both strands produces ________________________ ends.", answer: "sticky" },
{ question: "The optimal ratio of insert to vector DNA in a ligation reaction is crucial to minimize the formation of ________________________ plasmid.", answer: "self-ligated" },
{ question: "The fragment of DNA to be inserted into a vector during cloning is often referred to as the ________________________.", answer: "insert" },
{ question: "A common method for detecting DNA on an agarose gel is staining with ________________________ bromide, which intercalates into DNA and fluoresces under UV light.", answer: "ethidium" },
{ question: "Restriction enzyme reactions are typically performed at an optimal temperature, usually ________________________, which mimics bacterial physiological conditions.", answer: "37°C" },
{ question: "In DNA ligation, the enzyme forms a phosphodiester bond between the 3'-hydroxyl group of one nucleotide and the 5'-________________________ group of another.", answer: "phosphate" },
{ question: "When separating DNA fragments by agarose gel electrophoresis, larger fragments migrate more ________________________ through the gel matrix.", answer: "slowly" },
{ question: "A restriction map is a diagram that shows the positions of ________________________ sites on a DNA molecule.", answer: "restriction" },
{ question: "When setting up a ligation reaction, it is crucial to use an appropriate ________________________, which provides the necessary ions and optimal pH for the enzyme.", answer: "buffer" },
{ question: "Some restriction enzymes generate blunt ends, meaning they cut both DNA strands directly ________________________ each other.", answer: "opposite" },
{ question: "For effective ligation, the concentration of DNA fragments in the reaction should be optimized to promote intermolecular ligation over ________________________.", answer: "intramolecular ligation" },
{ question: "The process of using gel electrophoresis to isolate a specific DNA fragment from a mixture is called gel ________________________.", answer: "extraction" },
{ question: "After ligation, the mixture is typically used to transform bacterial cells, which then serve as hosts for DNA ________________________.", answer: "replication" },
{ question: "When using restriction enzymes, a common problem is ________________________ digestion, where the enzyme fails to cut at all recognition sites.", answer: "partial" }
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
        if (callback) {
            callback();
        }
    };
}

// --- Firebase Initialization ---
async function initializeFirebase() {
    try {
        // Use global variables if defined, otherwise provide empty defaults for local testing
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
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
