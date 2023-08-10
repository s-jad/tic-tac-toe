import { App } from "./app.js"
import { GameBoard } from "./game_board.js"

export const Display = ((doc) => {
    const displayDraw = () => {
        const displayDrawModal = document.getElementById('display-draw-container');
        const displayDrawFlex = document.getElementById('display-draw-flex');
        const newGameBtn = displayDrawFlex.querySelector('.new-game-btn');
        const welcomeModal = document.getElementById('welcome-modal-container');
        const welcomeModalFlex = document.getElementById('welcome-modal-flex');

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

    const checkWinnerInClassList = (player, list) => {
        return list.match(player);
    };

    const checkWinningLine = (winningNumbers, list) => {
        const inWinningLine = winningNumbers.map(num => {
            const isWinner = list.includes(num);
            return isWinner;
        });

        return inWinningLine.some(winner => winner === true);
    };


    const winningAnimation = () => {
        const gameGrid = document.getElementById('inner-grid');
        const squares = Array.from(gameGrid.querySelectorAll(".square"));
        const winner = "player-" + GameBoard.getWinner();
        let winningNumbers = GameBoard.getWinningSquares();

        winningNumbers = winningNumbers.map(num => `num-${num}`);

        let winners = [];
        let losers = [];

        squares.forEach((square) => {
            const classList = square.classList.toString();
            if (checkWinnerInClassList(winner, classList)) {
                if (checkWinningLine(winningNumbers, classList)) {
                    winners.push(square);
                }
                else {
                    losers.push(square);
                }
            } else {
                losers.push(square);
            }
        });

        const winnerHue = (360 / GameBoard.getNumberOfPlayers()) * (GameBoard.getWinner() - 1);

        losers.forEach((square, index) => {
            setTimeout(() => {
                square.classList.add('losing-square');
            }, 30 * index);
        });

        winners.forEach((square, index) => {
            setTimeout(() => {
                square.classList.add('winning-square');
            }, 400 * index);
            setTimeout(() => {
                square.style.boxShadow = `0 0 30px hsl(${winnerHue}, var(--sat-90), 70%),
                                          0 0 10px hsl(${winnerHue}, var(--sat-90), 90%),
                                          inset 0 0 30px hsl(${winnerHue}, var(--sat-90), 70%),
                                          inset 0 0 10px hsl(${winnerHue}, var(--sat-90), 90%)`;
            }, 650 * index);
        });


        setTimeout(() => {
            displayWinner(GameBoard.getWinner);
        }, winners.length * 650 + 650);
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
        const crossLine = welcomeAnimationContainer.querySelector('.cross-line.left');
        const crossLineRight = welcomeAnimationContainer.querySelector('.cross-line.right');

        const crossesAndCircles = crosses.map((cross, index) => {
            return [cross, circles[index]];
        }).flat();

        squares.forEach((square, index) => {
            setTimeout(() => {
                square.classList.add('settle');
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
                crossesAndCircles.forEach(crossOrCircle => {
                    crossOrCircle.classList.remove('active');
                });
            }, 350);

            setTimeout(() => {
                crossLineRight.classList.add('active');
            }, 850);

        }, 210 * squares.length + 310 * crossesAndCircles.length);

        setTimeout(() => {
            welcomeAnimationContainer.classList.remove("active");
            setupWelcomeScreen();
        }, 6750);

    };

    const openCustomOptions = () => {
        const customOptions = document.getElementById('custom-options');
        customOptions.classList.remove('slide-in');
    };

    const closeCustomOptions = () => {
        const customOptions = document.getElementById('custom-options');
        customOptions.classList.add('slide-out');
        setTimeout(() => {
            customOptions.classList.add('slide-in');
            customOptions.classList.remove('slide-out');
        }, 310);
    };

    const openTicTacToeDescription = () => {
        const ticTacToe = document.getElementById('tic-tac-toe-description');
        ticTacToe.classList.remove('slide-in');
    };

    const closeTicTacToeDescription = () => {
        const ticTacToe = document.getElementById('tic-tac-toe-description');
        ticTacToe.classList.add('slide-out');
        setTimeout(() => {
            ticTacToe.classList.add('slide-in');
            ticTacToe.classList.remove('slide-out');
        }, 310);
    };

    const openConnectFourDescription = () => {
        const customOptions = document.getElementById('connect-four-description');
        customOptions.classList.remove('slide-in');
    };

    const closeConnectFourDescription = () => {
        const connectFour = document.getElementById('connect-four-description');
        connectFour.classList.add('slide-out');
        setTimeout(() => {
            connectFour.classList.add('slide-in');
            connectFour.classList.remove('slide-out');
        }, 310);
    };

    const setupWelcomeScreen = () => {
        // Welcome Screen
        const welcomeModal = document.getElementById("welcome-modal-container");
        const welcomeModalFlex = document.getElementById("welcome-modal-flex");
        const welcomeModalConfirmBtn = document.getElementById("welcome-modal-confirm-btn");
        const gridSizeInput = document.getElementById("grid-size-input");
        const numPlayersInput = document.getElementById("num-players-input");
        const winningLineInput = document.getElementById("winning-line-input");
        const ticTacToeRadio = document.getElementById("tic-tac-toe-radio");
        const connectFourRadio = document.getElementById("connect-four-radio");
        const customRadio = document.getElementById("custom-radio");
        const radioContainer = document.getElementById('radio-container');

        // Open the modal
        welcomeModal.classList.add("active");

        const handleRadioChange = () => {
            if (ticTacToeRadio.checked) {
                closeCustomOptions();
                closeConnectFourDescription();
                openTicTacToeDescription();
            } else if (connectFourRadio.checked) {
                closeCustomOptions();
                closeTicTacToeDescription();
                openConnectFourDescription();
            } else if (customRadio.checked) {
                closeTicTacToeDescription();
                closeConnectFourDescription();
                openCustomOptions();
            }
        };

        radioContainer.addEventListener('change', handleRadioChange);

        // Add event listener to confirm button
        welcomeModalConfirmBtn.addEventListener('click', function() {
            if (ticTacToeRadio.checked) {
                GameBoard.setNumberOfPlayers(2);
                GameBoard.setSelectedNumColumns(3);
                GameBoard.setWinningLineLength(3);
            } else if (connectFourRadio.checked) {
                GameBoard.setNumberOfPlayers(2);
                GameBoard.setSelectedNumColumns(8);
                GameBoard.setWinningLineLength(4);
            } else if (customRadio.checked) {
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
            }

            // Switch gameState to gameStarted
            App.switchState();

            // Close the welcomeModal
            welcomeModal.classList.remove("active");
            welcomeModalFlex.classList.add("fade");
        });
    };

    const displayWelcomeScreen = () => {
        const welcomeModal = document.getElementById("welcome-modal-container");
        const welcomeModalFlex = document.getElementById("welcome-modal-flex");

        welcomeModal.classList.add('active');
        welcomeModalFlex.classList.remove('fade');
    };

    return {
        welcomeAnimation,
        setupWelcomeScreen,
        displayWelcomeScreen,
        winningAnimation,
        displayDraw,
    };

})(document);

// Initiates the Game
Display.welcomeAnimation();
