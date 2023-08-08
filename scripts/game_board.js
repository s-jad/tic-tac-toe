import { App } from "./app.js"

export const GameBoard = ((doc) => {
    // Game State
    let state = {
        gridNumber: 9,
        selectedNumColumns: 3,
        winningLineLength: 3,
        numberOfPlayers: 2,

        currentPlayerIndex: 0,
        players: [],
        playerColors: [],
        currentPlayerMoves: [],

        winner: "",
        winningSquares: [],

    };


    // PRIVATE FUNCTIONS
    const log = (msg) => {
        console.log(`LOG[${Date.now()}] => ${msg}`);
    };

    const resetGameBoard = () => {
        state = {
            gridNumber: 9,
            selectedNumColumns: 3,
            winningLineLength: 3,
            numberOfPlayers: 2,

            currentPlayerIndex: 0,
            players: [],
            playerColors: [],
            currentPlayerMoves: [],

            winner: "",
            winningSquares: [],
        };

        const playerDisplay = doc.getElementById('player-display');
        const playerDisplayDivs = Array.from(playerDisplay.querySelectorAll('div[id^="player"][id$="card"]'));
        playerDisplayDivs.forEach(div => playerDisplay.removeChild(div));
        console.log(playerDisplay);

        const gameGrid = doc.getElementById('inner-grid');
        const gridSquares = Array.from(gameGrid.querySelectorAll('.square'));
        gridSquares.forEach(square => gameGrid.removeChild(square));
        console.log(gameGrid)
    };

    const setGridNumber = (gridSize) => {
        state.gridNumber = gridSize * gridSize
    };

    const setWinningLineLength = (len) => {
        state.winningLineLength = parseInt(len);
    };

    const markWithPlayerColor = (square) => {
        const hue = `--${state.players[state.currentPlayerIndex]}-color`;
        square.style.background = `hsl(var(${hue}), var(--sat-90), var(--light-30))`;

    };

    const switchCurrentPlayer = () => {
        // Remove current-player from display
        const currentPlayerCardSelector = `#${state.players[state.currentPlayerIndex]}-card`;
        const currentPlayerCard = document.querySelector(currentPlayerCardSelector);
        currentPlayerCard.classList.remove("current-player");

        // Move index, wrap around when on last player 
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

        // Add current-player from display
        const nextPlayerCardSelector = `#${state.players[state.currentPlayerIndex]}-card`;
        const nextPlayerCard = document.querySelector(nextPlayerCardSelector);
        nextPlayerCard.classList.add("current-player");
    };

    const addSquareToCurrentPlayerMoves = (sq) => {
        const sqClassList = sq.classList.toString();
        const playerNumber = sqClassList.match(/player-(\d+)/);
        const sqNumber = sqClassList.match(/num-(\d+)/);

        const currentMove = { player: parseInt(playerNumber[1]), square: parseInt(sqNumber[1]) };
        state.currentPlayerMoves.push(currentMove);
        sortCurrentPlayerMoves();
    };

    const sortCurrentPlayerMoves = () => {
        state.currentPlayerMoves.sort((a, b) => a.square - b.square);
    }

    const checkWinner = () => {
        for (let i = 0; i < state.currentPlayerMoves.length; i++) {
            const currentPlayer = state.currentPlayerMoves[i].player;
            const currentStartingSq = state.currentPlayerMoves[i].square;

            const horizontalWin = checkWinnerHorizontal(currentStartingSq, currentPlayer);
            const verticalWin = checkWinnerVertical(currentStartingSq, currentPlayer);

            if (horizontalWin) {
                console.log(`Horizontal: Player ${horizontalWin.winningPlayer} has won!`);
                return horizontalWin;
            }

            if (verticalWin) {
                console.log(`Vertical: Player ${verticalWin.winningPlayer} has won!`);
                return verticalWin;
            }
        }

    };

    const checkWinnerHorizontal = (index, player) => {
        console.log(`index => ${index}`);
        console.log(`player => ${player}`);


        const horizontalCheck = state.currentPlayerMoves.filter(move =>
            move.player === player &&
            move.square >= index &&
            move.square < index + state.winningLineLength
        );
        console.log("horizontalCheck");
        console.log(horizontalCheck);
        if (horizontalCheck.length === state.winningLineLength) {
            const winningSquares = horizontalCheck.map((move) => move.square);
            const winningPlayer = horizontalCheck[0].player;
            console.log(`checkWinnerHorizontal:: Winning player => ${winningPlayer}`);
            console.log(`checkWinnerHorizontal:: Winning squares => ${winningSquares}`);
            return { winningSquares, winningPlayer };
        }
    };

    const checkWinnerVertical = (index, player) => {
        const verticalCheck = state.currentPlayerMoves.filter(move =>
            move.player === player &&
            move.square % state.selectedNumColumns === index % state.selectedNumColumns &&
            move.square < (state.selectedNumColumns * (state.winningLineLength - 1)) + index
        );

        if (verticalCheck.length === state.winningLineLength) {
            const winningSquares = verticalCheck.map((move) => move.square);
            const winningPlayer = verticalCheck[0].player;
            return { winningSquares, winningPlayer };
        }
    };

    // PUBLIC FUNCTIONS
    const setSelectedNumColumns = (size) => {
        state.selectedNumColumns = size;
    };

    const setNumberOfPlayers = (num) => {
        state.numberOfPlayers = num;

        // Get --base-hue to generate different colors for each player 
        const root = document.documentElement;
        const rootStyles = getComputedStyle(root);
        const baseHue = rootStyles.getPropertyValue('--base-hue');

        // Set the player display to have each of the player names on
        const playerDisplay = document.getElementById('player-display');

        // Fill the players/playerColors arrays and playerDisplay element
        for (let i = 0; i < num; i++) {
            const playerName = `player-${i + 1}`;
            state.players.push(playerName);

            // Set root css variables for base hue of each player color
            const playerColor = `--player-${i + 1}-color`;
            const hueJump = Math.floor(360 / num);
            const playerHue = parseInt(baseHue) + (i * hueJump);
            root.style.setProperty(playerColor, playerHue);

            const playerDisplayDiv = document.createElement('div');
            playerDisplayDiv.id = `player-${i + 1}-card`;
            playerDisplayDiv.style.background = `hsl(var(${playerColor}), var(--sat-50), var(--light-70))`;
            playerDisplayDiv.innerText = `Player ${i + 1}`;
            playerDisplay.appendChild(playerDisplayDiv);
        }
    };

    const getCurrentBoard = () => {
        return state.currentPlayerMoves;
    };

    const startGame = () => {
        log("Game started!");

        const root = document.documentElement;
        // Set the grid-size css variable to determine number of squares
        root.style.setProperty("--grid-size", state.selectedNumColumns);
        setGridNumber(state.selectedNumColumns);

        // Generate the board and attach to DOM
        const grid = doc.getElementById("inner-grid");
        for (let i = 0; i < state.gridNumber; i++) {
            let square = document.createElement('div');
            square.classList.add("square");
            square.classList.add(`num-${i + 1}`);

            square.addEventListener('click', function(e) {
                square.classList.add(state.players[state.currentPlayerIndex]);
                console.log(square);
                markWithPlayerColor(e.target);
                addSquareToCurrentPlayerMoves(square);
                const winningDetails = checkWinner();

                if (winningDetails) {
                    console.log(`Winning details => ${winningDetails}`);
                    state.winner = winningDetails.winningPlayer;
                    state.winningSquares = winningDetails.winningSquares;
                    App.setGameWon();
                    App.switchState();
                }
                switchCurrentPlayer();
            });

            grid.appendChild(square);
        }
    };

    const displayDraw = () => {
        console.log("Game was a draw!");
    };

    const displayWinner = () => {
        const displayWinnerModal = document.getElementById('display-winner-container');
        const displayWinnerFlex = document.getElementById('display-winner-flex');
        const winnerDisplay = document.getElementById('winner-display');
        const newGameBtn = displayWinnerFlex.querySelector('.new-game-btn');
        const welcomeModal = document.getElementById('welcome-modal-container');
        const welcomeModalFlex = document.getElementById('welcome-modal-flex');

        winnerDisplay.innerText = `Player ${state.winner} has won!`;
        newGameBtn.addEventListener('click', function() {
            // Close the display winner modal
            displayWinnerModal.classList.remove('active');
            displayWinnerFlex.classList.add('fade');

            // Reset gameState and board state
            App.resetGameState();
            resetGameBoard();

            // Open the welcome modal
            welcomeModal.classList.add('active');
            welcomeModalFlex.classList.remove('fade');
        });

        displayWinnerModal.classList.add('active');
        displayWinnerFlex.classList.remove('fade');
    };

    const endGame = () => {
        log("Game ended!");
    };


    return {
        getCurrentBoard,
        setSelectedNumColumns,
        setNumberOfPlayers,
        setWinningLineLength,
        startGame,
        endGame,
        displayWinner,
        displayDraw,
    };

})(document);

