import { App } from "./app.js"
import { GameBoard } from "./game_board.js"

export const Display = ((doc) => {
    const displayDraw = (winner) => {
        const displayDrawModal = document.getElementById('display-draw-container');
        const displayDrawFlex = document.getElementById('display-draw-flex');
        const newGameBtn = displayDrawFlex.querySelector('.new-game-btn');
        const welcomeModal = document.getElementById('welcome-modal-container');
        const welcomeModalFlex = document.getElementById('welcome-modal-flex');

        winnerDisplay.innerText = `Player ${winner} has won!`;

        newGameBtn.addEventListener('click', function() {
            // Close the display winner modal
            displayDrawModal.classList.remove('active');
            displayDrawFlex.classList.add('fade');

            // Reset gameState and board state
            App.resetGameState();
            GameBoard.resetGameBoard();

            // Open the welcome modal
            welcomeModal.classList.add('active');
            welcomeModalFlex.classList.remove('fade');
        });

        displayDrawModal.classList.add('active');
        displayDrawFlex.classList.remove('fade');
    };

    const displayWinner = () => {
        const displayWinnerModal = document.getElementById('display-winner-container');
        const displayWinnerFlex = document.getElementById('display-winner-flex');
        const winnerDisplay = document.getElementById('winner-display');
        const newGameBtn = displayWinnerFlex.querySelector('.new-game-btn');
        const welcomeModal = document.getElementById('welcome-modal-container');
        const welcomeModalFlex = document.getElementById('welcome-modal-flex');

        winnerDisplay.innerText = `Player ${GameBoard.getWinner()} has won!`;

        newGameBtn.addEventListener('click', function() {
            // Close the display winner modal
            displayWinnerModal.classList.remove('active');
            displayWinnerFlex.classList.add('fade');

            // Reset gameState and board state
            App.resetGameState();
            GameBoard.resetGameBoard();

            // Open the welcome modal
            welcomeModal.classList.add('active');
            welcomeModalFlex.classList.remove('fade');
        });

        displayWinnerModal.classList.add('active');
        displayWinnerFlex.classList.remove('fade');
    };

    const welcomeAnimation = () => {
        const welcomeAnimationContainer = doc.getElementById('welcome-animation');
        const squares = Array.from(welcomeAnimationContainer.querySelectorAll('.square'));
        const crosses = Array.from(welcomeAnimationContainer.querySelectorAll('.cross'));
        const circles = Array.from(welcomeAnimationContainer.querySelectorAll('.circle'));
        const crossLine = welcomeAnimationContainer.querySelector('.cross-line');

        const crossesAndCircles = crosses.map((cross, index) => {
            return [cross, circles[index]];
        }).flat();

        squares.forEach((square, index) => {
            setTimeout(() => {
                square.classList.add('settle');
                console.log(square);
            }, 210 * index);
        });

        setTimeout(() => {
            crossesAndCircles.forEach((crossOrCircle, index) => {
                setTimeout(() => {
                    crossOrCircle.classList.add('active');
                }, 310 * index);
            });
        }, 210 * squares.length);

        setTimeout(() => {
            setTimeout(() => {
                crossLine.classList.add('active');
                crossesAndCircles.forEach((crossOrCircle) => {
                    crossOrCircle.classList.remove('active');
                });
            }, 350);
        }, 210 * squares.length + 310 * crossesAndCircles.length);

        setTimeout(() => {
            welcomeAnimationContainer.classList.remove("active");
            setupWelcomeScreen();
        }, 6600);

    };

    const setupWelcomeScreen = () => {
        // Welcome Screen
        const welcomeModal = document.getElementById("welcome-modal-container");
        const welcomeModalFlex = document.getElementById("welcome-modal-flex");
        const welcomeModalConfirmBtn = document.getElementById("welcome-modal-confirm-btn");
        const gridSizeInput = document.getElementById("grid-size-input");
        const numPlayersInput = document.getElementById("num-players-input");
        const winningLineInput = document.getElementById("winning-line-input");

        // Open the modal
        welcomeModal.classList.add("active");

        // Add event listener to confirm button
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
    };

    return {
        welcomeAnimation,
        setupWelcomeScreen,
        displayWinner,
        displayDraw
    };

})(document);

// Initiates the Game
Display.welcomeAnimation();
