document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 4;
    let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    const gameBoard = document.getElementById('game-board');

    // Initialize game board
    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                createTile(i, j);
            }
        }
        addRandomTile();
        addRandomTile();
        updateBoard();
    }

    // Create a tile element
    function createTile(row, col) {
        const tile = document.createElement('div');
        tile.id = `tile-${row}-${col}`;
        tile.className = 'tile';
        gameBoard.appendChild(tile);
    }

    // Add a random tile
    function addRandomTile() {
        let emptyTiles = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    emptyTiles.push({ row: i, col: j });
                }
            }
        }

        if (emptyTiles.length > 0) {
            const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Update the game board UI
    function updateBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const tile = document.getElementById(`tile-${i}-${j}`);
                tile.textContent = board[i][j] === 0 ? '' : board[i][j];
                tile.style.backgroundColor = board[i][j] === 0 ? '#cdc1b4' : '#eee4da';
            }
        }
    }

    // Generate a random number with specific chances
    function getRandomMergeValue() {
        const randomValue = Math.random();
        if (randomValue < 0.7) {
            return Math.floor(Math.random() * 100) + 1; // 70% chance for 1 to 100
        } else if (randomValue < 0.9) {
            return 2048; // 20% chance for 2048
        } else {
            return 69420; // 10% chance for 69420
        }
    }

    // Move and merge tiles in the specified direction
    function move(direction) {
        let moved = false;

        for (let i = 0; i < boardSize; i++) {
            let row = board[i];
            if (direction === 'right' || direction === 'left') {
                row = board[i].slice();
            } else {
                row = board.map(r => r[i]);
            }

            if (direction === 'right' || direction === 'down') {
                row = row.reverse();
            }

            const filteredRow = row.filter(val => val !== 0);
            for (let j = 0; j < filteredRow.length - 1; j++) {
                if (filteredRow[j] === filteredRow[j + 1]) {
                    filteredRow[j] = getRandomMergeValue();
                    filteredRow.splice(j + 1, 1);
                    filteredRow.push(0);
                }
            }

            while (filteredRow.length < boardSize) {
                filteredRow.push(0);
            }

            if (direction === 'right' || direction === 'down') {
                filteredRow.reverse();
            }

            for (let j = 0; j < boardSize; j++) {
                if (direction === 'right' || direction === 'left') {
                    if (board[i][j] !== filteredRow[j]) {
                        moved = true;
                    }
                    board[i][j] = filteredRow[j];
                } else {
                    if (board[j][i] !== filteredRow[j]) {
                        moved = true;
                    }
                    board[j][i] = filteredRow[j];
                }
            }
        }

        if (moved) {
            addRandomTile();
            updateBoard();
        }
    }

    // Handle key events for moving tiles
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    });

    // Initialize the game
    initializeBoard();
});
