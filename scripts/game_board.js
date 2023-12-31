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

        const gameGrid = doc.getElementById('inner-grid');
        const gridSquares = Array.from(gameGrid.querySelectorAll('.square'));
        gridSquares.forEach(square => gameGrid.removeChild(square));
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

        // Add current-player to display
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

    const getSquareEvents = (event) => {
        const square = event.target;
        square.classList.add(state.players[state.currentPlayerIndex]);
        markWithPlayerColor(square);
        addSquareToCurrentPlayerMoves(square);
        const draw = checkDraw();
        console.log(`Game was a draw? => ${draw}`);
        const winningDetails = checkWinner();

        if (winningDetails) {
            state.winner = winningDetails.winningPlayer;
            state.winningSquares = winningDetails.winningSquares;
            console.log(`Winning details => ${state.winner} , ${state.winningSquares}`);
            App.setGameWon();
            App.switchState();
        } else if (draw) {
            App.setGameDraw();
            App.switchState();
        } else {
            switchCurrentPlayer();
        }
        removeSquareEvents(square);
    };

    const removeSquareEvents = (square) => {
        square.removeEventListener('click', getSquareEvents);
    };

    const checkWinner = () => {
        for (let i = 0; i < state.currentPlayerMoves.length; i++) {
            const currentPlayer = state.currentPlayerMoves[i].player;
            const currentStartingSq = state.currentPlayerMoves[i].square;

            const horizontalWin = checkWinnerHorizontal(currentStartingSq, currentPlayer);
            const verticalWin = checkWinnerVertical(currentStartingSq, currentPlayer);
            const diagonalWin = checkWinnerDiagonal(currentStartingSq, currentPlayer);

            if (horizontalWin) {
                console.log("Horizontal win");
                return horizontalWin;
            }

            if (verticalWin) {
                console.log("Vertical win");
                return verticalWin;
            }

            if (diagonalWin) {
                console.log("Diagonal win");
                return diagonalWin;
            }
        }

    };

    const horizontalWrapAroundCheck = (moves) => {
        // If any of the middle squares of the line are in the last column
        // Return false, not a true horizontal win
        const middleSquares = moves.slice(0, -1);
        if (middleSquares.some(move => move.square % state.selectedNumColumns === 0)) {
            return false;
        } else {
            return true;
        }
    };

    const checkWinnerHorizontal = (index, player) => {
        const horizontalCheck = state.currentPlayerMoves.filter(move =>
            move.player === player &&
            move.square >= index &&
            move.square < index + state.winningLineLength
        );

        if (
            horizontalCheck.length === state.winningLineLength &&
            horizontalWrapAroundCheck(horizontalCheck)
        ) {
            const winningSquares = horizontalCheck.map((move) => move.square);
            const winningPlayer = horizontalCheck[0].player;
            return { winningSquares, winningPlayer };
        }
    };

    const verticalWrapAroundCheck = (moves) => {
        // If consecutive moves arent seperated in value by no. of columns
        // Return false, not a true vertical win
        for (let i = 1; i < moves.length; i++) {
            if (moves[i].square !== moves[i - 1].square + parseInt(state.selectedNumColumns)) {
                console.log(`moves[i].square => ${moves[i].square}`);
                console.log(`moves[i-1].square => ${moves[i - 1].square}`);
                console.log(`vWrapAroundCHeck => ${moves[i].square} !== ${moves[i - 1].square + parseInt(state.selectedNumColumns)}`)
                return false;
            }
        }
        return true;
    };

    const checkWinnerVertical = (index, player) => {
        const verticalCheck = state.currentPlayerMoves.filter(move =>
            move.player === player &&
            move.square % state.selectedNumColumns === index % state.selectedNumColumns &&
            move.square < (state.selectedNumColumns * (state.winningLineLength - 1)) + index
        );

        if (
            verticalCheck.length === state.winningLineLength &&
            verticalWrapAroundCheck(verticalCheck)
        ) {
            const winningSquares = verticalCheck.map((move) => move.square);
            const winningPlayer = verticalCheck[0].player;
            return { winningSquares, winningPlayer };
        }
    };

    const diagonalSameRowCheck = (moves) => {
        // If two consecutive moves are in the same row
        // Return false, not a true diagonal win
        for (let i = 1; i < moves.length; i++) {
            const move1 = Math.ceil(moves[i].square / state.selectedNumColumns);
            const move2 = Math.ceil(moves[i - 1].square / state.selectedNumColumns);

            if (move1 === move2) {
                return false;
            }
        }
        return true;
    }

    const checkWinnerDiagonal = (index, player) => {
        const colNum = parseInt(state.selectedNumColumns);
        const playerMoves = state.currentPlayerMoves.filter(move => move.player === player && move.square >= index);
        let currentIndexRight = index;
        let currentIndexLeft = index;
        let diagonalBufferLeft = [];
        let diagonalBufferRight = [];

        for (let i = 0; i < state.winningLineLength; i++) {
            const currentMove = playerMoves.filter(move => {
                return move.square === currentIndexRight;
            });

            if (currentMove.length !== 0) {
                diagonalBufferRight.push(currentMove[0]);
            }

            if (diagonalBufferRight.length >= state.winningLineLength &&
                diagonalSameRowCheck(diagonalBufferRight)
            ) {
                const winningSquares = diagonalBufferRight.map((move) => move.square);
                const winningPlayer = diagonalBufferRight[0].player;
                return { winningSquares, winningPlayer };
            }
            currentIndexRight = currentIndexRight + colNum + 1;
        };

        for (let i = 0; i < state.winningLineLength; i++) {
            const currentMove = playerMoves.filter(move => {
                return move.square === currentIndexLeft
            });

            if (currentMove.length !== 0) {
                diagonalBufferLeft.push(currentMove[0]);
            }

            if (diagonalBufferLeft.length >= state.winningLineLength &&
                diagonalSameRowCheck(diagonalBufferLeft)
            ) {
                const winningSquares = diagonalBufferLeft.map((move) => move.square);
                const winningPlayer = diagonalBufferLeft[0].player;
                return { winningSquares, winningPlayer };
            }
            currentIndexLeft = currentIndexLeft + colNum - 1;
        };
    }

    const checkDraw = () => {
        if (state.currentPlayerMoves.length === state.gridNumber) {
            return true;
        }
        return false;
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

            // For later use in animations
            state.playerColors.push({ playerName, playerColor, playerHue });

            root.style.setProperty(playerColor, playerHue);

            const playerDisplayDiv = document.createElement('div');
            playerDisplayDiv.id = `player-${i + 1}-card`;
            playerDisplayDiv.style.background = `hsl(var(${playerColor}), var(--sat-50), var(--light-70))`;
            playerDisplayDiv.innerText = `Player ${i + 1}`;


            // Make player 1 current player
            if (i === 0) {
                playerDisplayDiv.classList.add("current-player");
            }
            playerDisplay.appendChild(playerDisplayDiv);
        }
    };

    const getCurrentBoard = () => {
        return state.currentPlayerMoves;
    };

    const getWinner = () => {
        return state.winner;
    }

    const getWinningSquares = () => {
        return state.winningSquares;
    }

    const getPlayerColors = () => {
        console.log(state.playerColors);
        return state.playerColors;
    }

    const getNumberOfPlayers = () => {
        console.log(`number of players: ${state.players.length}`);
        return state.players.length;
    };

    const startGame = () => {
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

            square.addEventListener('click', getSquareEvents);

            grid.appendChild(square);
        }
    };


    return {
        resetGameBoard,
        getCurrentBoard,
        getWinner,
        getWinningSquares,
        getPlayerColors,
        getNumberOfPlayers,
        setSelectedNumColumns,
        setNumberOfPlayers,
        setWinningLineLength,
        startGame,
    };

})(document);

