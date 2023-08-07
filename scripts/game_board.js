export const GameBoard = ((doc) => {
    // Game State
    let state = {
        playerTurn: 0,
        gridNumber: 9,
        playerOneWon: 0,
        playerTwoWon: 0,
    };

    // PRIVATE FUNCTIONS
    const log = (msg) => {
        console.log(`LOG[${Date.now()}] => ${msg}`);
    }

    const generateGridSize = (size) => {
        return Math.sqrt(state.gridNumber);
    }

    const setGridNumber = (gridSize) => {
        state.gridNumber = gridSize * gridSize
    }


    // PUBLIC FUNCTIONS
    const startGame = () => {
        log("Game started!");

        // Set the grid-size css variable to determine number of squares
        const root = document.documentElement;
        root.style.setProperty("--grid-size", generateGridSize(state.gridNumber));

        // Generate the board and attach to DOM
        const grid = doc.querySelector(".inner-grid");
        for (let i = 0; i < state.gridNumber; i++) {
            let square = document.createElement('div');
            square.classList.add("square");
            square.classList.add(`num-${i + 1}`);
            grid.appendChild(square);
        }
    };

    const endGame = () => {
        log("Game ended!");
    };

    const setPlayerTurn = () => {
        state.playerTurn = state.playerTurn ^ 1;
        log("Setting player turn");
        console.log(`                   => Player turn: ${state.playerTurn === 0 ? "PlayerOne" : "PlayerTwo"}`);
    }

    const checkWinner = () => {

    }

    return {
        setGridNumber,
        startGame,
        endGame,
        setPlayerTurn,
    };

})(document);

GameBoard.setGridNumber(6);
GameBoard.startGame();
GameBoard.setPlayerTurn();
GameBoard.setPlayerTurn();
GameBoard.setPlayerTurn();
GameBoard.endGame();

