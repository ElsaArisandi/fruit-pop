const fruits = [
    { name: "Apel", image: "assets/apple.jpg", color: "Merah" },
    { name: "Pisang", image: "assets/banana.png", color: "Kuning" },
    { name: "Anggur", image: "assets/grape.png", color: "Ungu" },
    { name: "Mangga", image: "assets/mango.png", color: "Orange" },
    { name: "Jeruk", image: "assets/orange.jpg", color: "Orange" },
];

// 🎵 Load sound effects
const correctSound = new Audio("assets/sounds/correct.mp3");
const wrongSound = new Audio("assets/sounds/wrong.mp3");

let correctFruit = null;
let gameMode = "name"; // Default mode
let score = 0;
let questionCount = 0;
const maxQuestions = 10;

// Event untuk tombol "Mulai Permainan"
document.getElementById("startGame").addEventListener("click", function () {
    document.getElementById("gameArea").classList.remove("hidden");
    document.getElementById("startGame").style.display = "none";
    score = 0;
    questionCount = 0;
    loadRandomFruit();
});

// Fungsi untuk mengatur mode
function setGameMode(mode) {
    gameMode = mode;
    document.getElementById("gameArea").classList.remove("hidden");
    document.getElementById("startGame").style.display = "none";
    score = 0;
    questionCount = 0;
    loadRandomFruit();
}

// Fungsi utama untuk memuat buah secara acak
function loadRandomFruit() {
    if (questionCount >= maxQuestions) {
        endGame();
        return;
    }

    questionCount++;

    let randomIndex = Math.floor(Math.random() * fruits.length);
    correctFruit = fruits[randomIndex];

    const fruitImg = document.getElementById("fruitImage");
    fruitImg.classList.remove("animate-fruit");
    void fruitImg.offsetWidth; // force reflow
    fruitImg.src = correctFruit.image;
    fruitImg.alt = correctFruit.name;
    fruitImg.classList.add("animate-fruit");

    const questionText = document.querySelector("#gameArea p");
    if (gameMode === "name") {
        questionText.textContent = "🍎 Tebak Nama Buah:";
        shuffleOptions(correctFruit.name, "name");
    } else {
        questionText.textContent = "🎨 Tebak Warna Buah:";
        shuffleOptions(correctFruit.color, "color");
    }
}

// Fungsi untuk mengacak pilihan
function shuffleOptions(correctAnswer, type) {
    let options = document.querySelectorAll(".option");
    let choices = type === "name"
        ? fruits.map(f => f.name)
        : fruits.map(f => f.color);

    choices = [...new Set(choices)]; // hilangkan duplikat

    let shuffled = [correctAnswer, ...choices.filter(c => c !== correctAnswer)
        .sort(() => 0.5 - Math.random()).slice(0, options.length - 1)];

    shuffled = shuffled.sort(() => 0.5 - Math.random());

    options.forEach((option, index) => {
        option.textContent = shuffled[index];
        option.onclick = () => checkAnswer(option.textContent, correctAnswer);
    });
}

// Fungsi untuk memeriksa jawaban
function checkAnswer(selected, correct) {
    const feedback = document.getElementById("feedback");

    if (selected === correct) {
        feedback.textContent = "✅ Jawaban Benar!";
        feedback.style.color = "green";
        correctSound.play();
        score++;
    } else {
        feedback.textContent = `❌ Salah! Jawaban: ${correct}`;
        feedback.style.color = "red";
        wrongSound.play();
    }

    setTimeout(() => {
        feedback.textContent = "";
        loadRandomFruit();
    }, 1000);
}

// Fungsi akhir permainan
function endGame() {
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = `
        <h2>Permainan Selesai!</h2>
        <p>Skor akhir kamu: <strong>${score} / ${maxQuestions}</strong></p>
        <button id="restartGame">Main Lagi</button>
    `;

    document.getElementById("restartGame").addEventListener("click", () => {
        document.location.reload();
    });
}
