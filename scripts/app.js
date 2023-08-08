import { GameBoard } from "./game_board.js"

export const App = (() => {
    let gameState = {
        welcome: 1,
        gameStarted: 0,
        gameWon: 0,
        gameDraw: 0,

        // Default values, can be modified by players
    };

    const setGameWon = () => {
        gameState.gameWon = gameState.gameWon ^ 1;
    };

    const resetGameState = () => {
        gameState = {
            welcome: 1,
            gameStarted: 0,
            gameWon: 0,
            gameDraw: 0,
        };
    };

    const switchState = () => {
        console.log("Game State::");
        console.log(gameState);
        if (gameState.welcome === 1) {
            gameState.welcome = gameState.welcome ^ 1;
            gameState.gameStarted = gameState.gameStarted ^ 1;
            GameBoard.startGame();
        } else if (gameState.gameStarted === 1 && gameState.gameWon === 1) {
            gameState.gameStarted = gameState.gameStarted ^ 1;
            GameBoard.displayWinner();
        } else if (gameState.gameStarted === 1 && gameState.gameDraw === 1) {
            gameState.gameStarted = gameState.gameStarted ^ 1;
            GameBoard.displayDraw();
        }
    };


    return {
        switchState,
        setGameWon,
        resetGameState,
    };

})();

// Welcome Screen

const welcomeModal = document.getElementById("welcome-modal-container");
const welcomeModalFlex = document.getElementById("welcome-modal-flex");
const welcomeModalConfirmBtn = document.getElementById("welcome-modal-confirm-btn");
const gridSizeInput = document.getElementById("grid-size-input");
const numPlayersInput = document.getElementById("num-players-input");
const winningLineInput = document.getElementById("winning-line-input");

welcomeModalConfirmBtn.addEventListener('click', function() {
    // Default to 3 x 3 grid if no input given
    if (gridSizeInput.value === undefined) {
        GameBoard.setSelectedNumColumns(3);
    } else {
        GameBoard.setSelectedNumColumns(gridSizeInput.value);
    }

    // Default to 2 players if no input given
    if (numPlayersInput.value === undefined) {
        GameBoard.setNumberOfPlayers(2);
    } else {
        GameBoard.setNumberOfPlayers(numPlayersInput.value);
    }

    // Default to 3 in-a-row if no input given
    if (numPlayersInput.value === undefined) {
        GameBoard.setWinningLineLength(3);
    } else {
        GameBoard.setWinningLineLength(winningLineInput.value);
    }

    // Switch gameState to gameStarted
    App.switchState();

    // Close the welcomeModal
    welcomeModal.classList.remove("active");
    welcomeModalFlex.classList.add("fade");
});

