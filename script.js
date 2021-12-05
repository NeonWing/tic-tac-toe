const Dionysus = {
    color: "#d50ee0",
    buttonClass: "dionysus-button"
};

const Aphrodite = {
    color: "#f288f3",
    buttonClass: "aphrodite-button"
}

const Player = function(turn, symbol, spots, god) {
    this.turn = turn;
    this.symbol = symbol;
    let type;
    this.spots = spots;
    this.god = god;
};

const playerOne = new Player(1, 'X', [], Dionysus);
const playerTwo = new Player(2, 'O', [], Aphrodite);

const gameManager = (() => {
    let currentPlayer = playerOne;
    const winCons = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]];

    const changeTurn = function() {
        (gameManager.currentPlayer.turn === 1) ? gameManager.currentPlayer = playerTwo : gameManager.currentPlayer = playerOne;
    }

    const checkForWins = (moveset) => {
        let counter = 0;
        for(let j = 0; j < winCons.length; j++) {
            for(let i = 0; i < moveset.length; i++) {
                if(winCons[j].includes(moveset[i])) {
                    counter++;
                    // console.log(`Player ${gameManager.currentPlayer.turn} Potential Win ${winCons[j]} - ${moveset[i]} - Hits ${counter}`);
                }
    
                if(counter === 3) {
                    console.log(`Player ${gameManager.currentPlayer.turn} Won!`);
                    gameBoard.enabled = false;
                    return true;
                }
            }
            counter = 0;
        }
        if(playerOne.spots.length + playerTwo.spots.length === 9) {
            console.log("Draw");
            gameBoard.enabled = false;
            return 3;
        }
    
        return false;
    }

    return {
        currentPlayer,
        changeTurn,
        checkForWins
    }
})(); 

const gameDisplay = (() => {
    const playerOneCard = document.querySelector(".player-one");
    const playerTwoCard = document.querySelector(".player-two");
    const vs = document.querySelector(".vs");
    let colorMode = "light";

    const changeToGameBoard = () => {
        if(playerOne.type === undefined || playerTwo.type === undefined) return;

        playButton.addEventListener("animationend", function() {
            document.querySelector(".player-select-section").classList.add("hidden");
            document.querySelector(".play-button-section").classList.add("hidden");
            document.querySelector(".screen-two").classList.remove("hidden");
            document.querySelector(".screen-two").classList.add("animate__animated", "animate__fadeIn");
        });

        playerOneCard.classList.add("animate__animated", "animate__fadeOutLeft");
        playerTwoCard.classList.add("animate__animated", "animate__fadeOutRight"); 
        vs.classList.add("animate__animated", "animate__fadeOutDown");
        playButton.classList.add("animate__animated", "animate__fadeOutDown");       
    }

    const showCurrentTurn = () => {
        const playerOneNameTag = document.querySelector(".player-one-name");
        const playerTwoNameTag = document.querySelector(".player-two-name");

        playerTwoNameTag.classList.toggle("active");
        playerOneNameTag.classList.toggle("active");
    }

    const playButton = document.querySelector(".play-button");
    playButton.addEventListener('click', changeToGameBoard);

    const colorModeSwitcher = document.getElementById("colorModeSwitch");
    colorModeSwitcher.checked = false;
    colorModeSwitcher.addEventListener('change', () => {
        (gameDisplay.colorMode === "light") ? gameDisplay.colorMode = "dark" : gameDisplay.colorMode = "light";
        console.log(gameDisplay.colorMode);
        let elements = [...document.querySelectorAll(".light-back, .light-text, .light-button, .light-button-text, .box-light , .marked-light, .dark-back, .dark-text, .dark-button, .dark-button-text, .box-dark, .marked-dark")];
        elements.forEach((el) => {
            if(el.classList.contains("light-back") || el.classList.contains("dark-back")) {
                el.classList.toggle("light-back");
                el.classList.toggle("dark-back");
            }
            if(el.classList.contains("light-text") || el.classList.contains("dark-text")) {
                el.classList.toggle("light-text");
                el.classList.toggle("dark-text");
            }
            if(el.classList.contains("light-button") || el.classList.contains("dark-button")) {
                el.classList.toggle("light-button");
                el.classList.toggle("dark-button");
            }
            if(el.classList.contains("light-button-text") || el.classList.contains("dark-button-text")) {
                el.classList.toggle("light-button-text");
                el.classList.toggle("dark-button-text");
            }
            if(el.classList.contains("box-light") || el.classList.contains("box-dark")) {
                el.classList.toggle("box-light");
                el.classList.toggle("box-dark");
            }
            if(el.classList.contains("marked-light") || el.classList.contains("marked-dark")) {
                el.classList.toggle("marked-light");
                el.classList.toggle("marked-dark");
            }
        });
    });

    return {
        showCurrentTurn,
        colorMode
    }
})();

const gameBoard = (() => {
    const boxes = [];
    const board = document.querySelector(".board");
    let enabled = true;

    const markSpot = function(e) {
        if(e.target.classList.contains(`marked-${gameDisplay.colorMode}`)) return;
        if(gameBoard.enabled) {
            if(e.target.classList.contains("gray")) {
                e.target.classList.remove("gray");
            }
            e.target.classList.add(`marked-${gameDisplay.colorMode}`);

            gameManager.currentPlayer.spots.push(boxes.indexOf(e.target));

            e.target.textContent = gameManager.currentPlayer.symbol;
            if(gameManager.checkForWins(gameManager.currentPlayer.spots)){
                return;
            } else if (gameManager.checkForWins(gameManager.currentPlayer.spots) === 3) {
                return;
            }
            gameManager.changeTurn();
            gameDisplay.showCurrentTurn();
        }
    }

    const highlightSpot = function(box, symbol) {
        if(box.classList.contains(`marked-${gameDisplay.colorMode}`)) return;

        box.textContent = symbol;
        box.classList.add("gray");
    }

    const clearSpot = function(e) {
        if(e.target.classList.contains(`marked-${gameDisplay.colorMode}`)) return;

        e.target.textContent = "";
        e.target.classList.remove("gray");
        e.target.classList.remove("marked");
    }

    for(let i = 0; i < 9; i++) {
        boxes.push(document.createElement('div'));
        boxes[i].classList.add("box");
        (gameDisplay.colorMode === "light") ? boxes[i].classList.add("box-light") : boxes[i].classList.add("box-dark");
        boxes[i].addEventListener('click', markSpot);
        boxes[i].addEventListener('mouseover', () => {
            highlightSpot(boxes[i], gameManager.currentPlayer.symbol);
        });
        boxes[i].addEventListener('mouseleave', clearSpot);
        board.appendChild(boxes[i]);
    }

    for(let i = 0; i < 9; i++) {
        if(i < 3) boxes[i].style.borderTop = "none";
        if(i === 0 || i % 3 === 0) boxes[i].style.borderLeft = "none";
        if(i === 5 || i === 2 || i === 8) boxes[i].style.borderRight = "none";
        if(i > 5) boxes[i].style.borderBottom = "none";
    }

    return {
        enabled
    }
})();

const playerSelectManager = (() => {
    const setPlayerType = function(button, player, dataRef) {
        if (playerOne.type != null && player === "one" || playerTwo.type != null && player === "two") {
            let spread = [...document.querySelector(`.player-${player}-select`).children];
            console.log(spread);
            spread.forEach((button) => {
                if(button.classList.contains(playerOne.god.buttonClass) || button.classList.contains(playerTwo.god.buttonClass)) {
                    button.classList.remove(playerTwo.god.buttonClass);
                    button.classList.remove(playerOne.god.buttonClass);
                    
                } else if (button.classList.contains("selected-ai")) {
                    button.classList.remove("selected-ai");
                }
            });
        }

        //Set Class
        if(button.id === "player") {
             if(player === "one") button.classList.add(playerOne.god.buttonClass)
             else button.classList.add(playerTwo.god.buttonClass)  
        } else {
            button.classList.add("selected-ai");
        }

        //Set data
        if(player === "one") {
            playerOne.type = button.id;
            dataRef.dataset.playerType = playerOne.type;
        } else {
            playerTwo.type = button.id;
            dataRef.dataset.playerType = playerTwo.type;
        }
    }

    //Button Listeners and Shit
    const playerTypeButtons = document.querySelectorAll(".player-select");
    playerTypeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            let dataRef = button.parentElement.parentElement;
            let playerNum = dataRef.dataset.player;
            setPlayerType(button, playerNum, dataRef);
        });
    });
})();




