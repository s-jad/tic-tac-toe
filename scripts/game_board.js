export const GameBoard = ((doc) => {
    // Game State
    let state = {
        gridNumber: 9,
        selectedNumColumns: 3,

        numberOfPlayers: 2,

        currentPlayerIndex: 0,
        players: [],
        playerColors: [],

        winningLineLength: 3,
    };



    // PRIVATE FUNCTIONS
    const log = (msg) => {
        console.log(`LOG[${Date.now()}] => ${msg}`);
    }

    const setGridNumber = (gridSize) => {
        console.log(`setGridNumber => GridSize:: ${gridSize}`);
        state.gridNumber = gridSize * gridSize
    }

    const setWinningLineLength = (len) => {
        state.winningLineLength = len;
    };

    const markWithPlayerColor = (square) => {
        square.style.background = `hsla(var(--${state.players[state.currentPlayerIndex]}-color), var(--sat-90), var(--(light-50)))`;
    }

    // PUBLIC FUNCTIONS
    const setSelectedNumColumns = (size) => {
        console.log(`setSelectedGridSize => GridSize:: ${size}`);
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

    const getPlayers = () => {
        for (let i = 0; i < state.players.length; i++) {
            console.log(`Player ${i + 1} => ${state.players[i]}`);
        }
    };

    const startGame = () => {
        log("Game started!");

        const root = document.documentElement;
        // Set the grid-size css variable to determine number of squares
        root.style.setProperty("--grid-size", state.selectedNumColumns);
        setGridNumber(state.selectedNumColumns);

        // Generate the board and attach to DOM
        const grid = doc.querySelector(".inner-grid");
        for (let i = 0; i < state.gridNumber; i++) {
            let square = document.createElement('div');
            square.classList.add("square");
            square.classList.add(`num-${i + 1}`);

            square.addEventListener('click', function(square) {
                markWithPlayerColor(square);
            });

            grid.appendChild(square);
        }
    };

    const playerTurn = () => {

    };

    const endGame = () => {
        log("Game ended!");
    };


    const checkWinner = () => {

    }

    return {
        setSelectedNumColumns,
        setNumberOfPlayers,
        setWinningLineLength,
        getPlayers,
        startGame,
        endGame,
    };

})(document);

