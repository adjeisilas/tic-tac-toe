const startBtn = document.querySelector('#start-btn');
const modelHidden = document.querySelector('.model-hidden');
const saveBtn = document.querySelector('#save-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const player1Id = document.querySelector('#player1Id');
const player2Id = document.querySelector('#player2Id');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('button:last-of-type');

let player1 = null;
let player2 = null;
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
const messageDisplay = document.createElement('div');
messageDisplay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #2d3047 0%, #1b1b2f 100%);
    color: white;
    padding: 30px 50px;
    border-radius: 15px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    z-index: 2000;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: none;
    backdrop-filter: blur(10px);
`;
document.body.appendChild(messageDisplay);
function showMessage(message, duration = 2000) {
    messageDisplay.textContent = message;
    messageDisplay.style.display = 'block';
    
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, duration);
}
startBtn.addEventListener('click', () => {
    modelHidden.style.display = 'flex';
});
cancelBtn.addEventListener('click', () => {
    modelHidden.style.display = 'none';
});
modelHidden.addEventListener("submit", (e) => {
    e.preventDefault();
    const player1Input = modelHidden.querySelector("#player1").value.trim();
    const player2Input = modelHidden.querySelector("#player2").value.trim();

    if (!player1Input.length || !player2Input.length) {
        showMessage("Both player names are required", 2000);
        return;
    }

    player1 = player1Input || 'Player 1';
    player2 = player2Input || 'Player 2';
    
    player1Id.textContent = `${player1} (X)`;
    player2Id.textContent = `${player2} (O)`;
    
    modelHidden.style.display = "none";
    resetGame();
    gameActive = true;
    
    showMessage(`Game Started! ${player1} vs ${player2}`, 1500);
});
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (gameActive && gameBoard[index] === '') {
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            if (currentPlayer === 'X') {
                cell.style.color = '#00b4db';
            } else {
                cell.style.color = '#ff416c';
            }
            
            if (checkWinner()) {
                const winnerName = currentPlayer === 'X' ? player1 : player2;
                gameActive = false;
                highlightWinningCells();
                
                showMessage(`${winnerName} wins!`, 3000);
                return;
            }
            
            if (checkDraw()) {
                gameActive = false;
                showMessage("It's a draw!", 3000);
                return;
            }
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updatePlayerDisplay();
        }
    });
});
resetBtn.addEventListener('click', resetGame);
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && 
               gameBoard[a] === gameBoard[b] && 
               gameBoard[a] === gameBoard[c];
    });
}
function highlightWinningCells() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const winningPattern = winPatterns.find(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && 
               gameBoard[a] === gameBoard[b] && 
               gameBoard[a] === gameBoard[c];
    });
    
    if (winningPattern) {
        winningPattern.forEach(index => {
            cells[index].style.background = 'rgba(0, 180, 219, 0.3)';
            cells[index].style.borderColor = '#00b4db';
            cells[index].style.boxShadow = '0 0 20px rgba(0, 180, 219, 0.5)';
        });
    }
}
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'white';
        cell.style.background = 'rgba(255, 255, 255, 0.05)';
        cell.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        cell.style.boxShadow = 'none';
    });
    
    if (player1 && player2) {
        gameActive = true;
        updatePlayerDisplay();
        showMessage('Game Reset!', 1500);
    }
}
function updatePlayerDisplay() {
    player1Id.style.opacity = currentPlayer === 'X' ? '1' : '0.6';
    player2Id.style.opacity = currentPlayer === 'O' ? '1' : '0.6';
    player1Id.style.fontWeight = currentPlayer === 'X' ? 'bold' : 'normal';
    player2Id.style.fontWeight = currentPlayer === 'O' ? 'bold' : 'normal';

    player1Id.style.textShadow = currentPlayer === 'X' ? '0 0 10px rgba(0, 180, 219, 0.7)' : 'none';
    player2Id.style.textShadow = currentPlayer === 'O' ? '0 0 10px rgba(255, 65, 108, 0.7)' : 'none';
}