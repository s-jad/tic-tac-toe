import { GameBoard } from "./game_board.js"

const App = (() => {
    let gameState = {
        welcome: 1,
        gameStarted: 0,
        gameWon: 0,
        gameDraw: 0,

        selectedGridSize: 3,
        playerOneWon: 0,
        playerTwoWon: 0,

    };

    const setSelectedGridSize = (size) => {
        gameState.selectedGridSize = size;
    };

    const switchState = () => {
        if (gameState.welcome === 1) {
            gameState.welcome = gameState.welcome ^ 1;
            gameState.gameStarted = gameState.gameStarted ^ 1;
            GameBoard.setGridNumber(gameState.selectedGridSize);
            GameBoard.startGame();
        } else if (gameState.gameStarted === 1) {
            console.log("Games already running");
        }
    };

    return {
        switchState,
        setSelectedGridSize,
    };

})();

// Welcome Screen

const welcomeModal = document.getElementById("welcome-modal-container");
const welcomeModalFlex = document.getElementById("welcome-modal-flex");
const confirmGridSizeBtn = document.getElementById("confirm-grid-size-btn");
const gridSizeInput = document.getElementById("grid-size-input");

confirmGridSizeBtn.addEventListener('click', function() {
    // Default to 3 x 3 grid if no input given
    if (gridSizeInput.value === undefined) {
        App.setSelectedGridSize(3);
    } else {
        App.setSelectedGridSize(gridSizeInput.value);
    }

    // Switch gameState to gameStarted
    App.switchState();

    // Close the welcomeModal
    welcomeModal.classList.remove("active");
    welcomeModalFlex.classList.add("fade");
});

