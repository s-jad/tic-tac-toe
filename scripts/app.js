import { GameBoard } from "./game_board.js"

export const App = (() => {
    let gameState = {
        welcome: 1,
        gameStarted: 0,
        gameWon: 0,
        gameDraw: 0,
        currentPlayerMoves: [],

        // Default values, can be modified by players
    };

    const switchState = () => {
        if (gameState.welcome === 1) {
            gameState.welcome = gameState.welcome ^ 1;
            gameState.gameStarted = gameState.gameStarted ^ 1;
            GameBoard.startGame();
        } else if (gameState.gameStarted === 1) {
            console.log("Games already running");
        }
    };

    const addSquareToCurrentPlayerMoves = (sq) => {
        const sqClassList = sq.classList.toString();
        const playerNumber = sqClassList.match(/player-(\d+)/);
        const sqNumber = sqClassList.match(/num-(\d+)/);

        const currentMove = { player: playerNumber[1], square: sqNumber[1] };
        gameState.currentPlayerMoves.push(currentMove);
        sortCurrentPlayerMoves();
    };

    const sortCurrentPlayerMoves = () => {
        gameState.currentPlayerMoves.sort((a, b) => a.square - b.square);
    }

    const checkWinner = () => {
        console.log("Inside checkWinner");
        for (let i = 0; i < gameState.currentPlayerMoves.length; i++) {
            console.log(gameState.currentPlayerMoves[i]);
        }

    };

    return {
        addSquareToCurrentPlayerMoves,
        checkWinner,
        switchState,
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

    GameBoard.getPlayers();

    // Switch gameState to gameStarted
    App.switchState();

    // Close the welcomeModal
    welcomeModal.classList.remove("active");
    welcomeModalFlex.classList.add("fade");
});

