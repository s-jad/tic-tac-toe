import { GameBoard } from "./game_board.js"
import { Display } from "./display.js"

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

    const setGameDraw = () => {
        gameState.gameDraw = gameState.gameDraw ^ 1;
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
            Display.winningAnimation();
        } else if (gameState.gameStarted === 1 && gameState.gameDraw === 1) {
            gameState.gameStarted = gameState.gameStarted ^ 1;
            Display.displayDraw();
        }
    };

    return {
        switchState,
        setGameWon,
        setGameDraw,
        resetGameState,
    };

})();

