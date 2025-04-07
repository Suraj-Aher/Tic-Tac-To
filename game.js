const boardElement = document.getElementById("board");
const message = document.getElementById("message");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawsEl = document.getElementById("draws");

let board, gameOver, currentPlayer;
let xWins = 0, oWins = 0, draws = 0;

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

function randomRGB() {
    const r = 180 + Math.floor(Math.random() * 75);
    const g = 180 + Math.floor(Math.random() * 75);
    const b = 180 + Math.floor(Math.random() * 75);
    document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
}

function drawBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.textContent = cell;
        div.addEventListener("click", () => handleMove(index));
        boardElement.appendChild(div);
    });
}

function handleMove(index) {
    if (board[index] || gameOver) return;

    board[index] = currentPlayer;
    clickSound.play();
    drawBoard();

    if (checkWinner(currentPlayer)) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (modeSelect.value === "single" && currentPlayer === "O") {
        setTimeout(() => {
            computerMove();
            drawBoard();
            checkWinner("O");
            currentPlayer = "X";
        }, 400);
    }
}

function computerMove() {
    const diff = difficultySelect.value;
    let move;

    if (diff === "easy") {
        move = randomMove();
    } else if (diff === "medium") {
        move = Math.random() < 0.5 ? randomMove() : minimax(board, "O").index;
    } else {
        move = minimax(board, "O").index;
    }

    if (move !== undefined) board[move] = "O";
}

function randomMove() {
    const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : undefined;
}

function checkWinner(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    const won = wins.some(pattern =>
        pattern.every(i => board[i] === player)
    );

    if (won) {
        message.textContent = `${player} Wins! 🎉`;
        gameOver = true;
        if (player === "X") xScoreEl.textContent = ++xWins;
        else oScoreEl.textContent = ++oWins;
        winSound.play();

        setTimeout(resetGame, 1500);  // Auto-restart after 1.5s
        return true;
    }

    if (!board.includes("")) {
        message.textContent = " Draw 🤝";
        drawsEl.textContent = ++draws;
        drawSound.play();
        gameOver = true;

        setTimeout(resetGame, 1500);  // Auto-restart after 1.5s
        return false;
    }

    return false;
}

function minimax(newBoard, player) {
    const empty = newBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    let moves = [];

    for (let i of empty) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        const result = minimax(newBoard, player === "O" ? "X" : "O");
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let max = -Infinity;
        for (let m of moves) {
            if (m.score > max) {
                max = m.score;
                bestMove = m;
            }
        }
    } else {
        let min = Infinity;
        for (let m of moves) {
            if (m.score < min) {
                min = m.score;
                bestMove = m;
            }
        }
    }
    return bestMove;
}

function checkWin(board, player) {
    return [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ].some(p => p.every(i => board[i] === player));
}

function resetGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameOver = false;
    message.textContent = "";
    drawBoard();
    randomRGB();

    // Toggle difficulty dropdown
    difficultySelect.disabled = modeSelect.value === "two" ? true : false;
}

resetGame();
