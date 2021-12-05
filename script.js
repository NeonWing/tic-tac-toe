const Dionysus = {
    color: "dionysus-color",
    buttonClass: "dionysus-button",
    image: "dionysus-image",
    bond: "./bond/Dionysus-bond-forged.webp"
};

const Aphrodite = {
    color: "aphrodite-color",
    buttonClass: "aphrodite-button",
    image: "aphrodite-image",
    bond: "./bond/Aphrodite-bond-icon.webp"
}

const Ares = {
    color: "ares-color",
    buttonClass: "ares-button",
    image: "ares-image",
    bond: "./bond/Ares-bond-icon.webp"
}

const Artemis = {
    color: "artemis-color",
    buttonClass: "artemis-button",
    image: "artemis-image",
    bond: "./bond/Artemis-bond-forged.webp"
}

const Hermes = {
    color: "hermes-color",
    buttonClass: "hermes-button",
    image: "hermes-image",
    bond: "./bond/Hermes-bond-forged.webp"
}

const Player = function(turn, symbol, spots, god) {
    this.turn = turn;
    this.symbol = symbol;
    this.type;
    this.spots = spots;
    this.god = god;
    this.roundWins = 0;
};

const playerOne = new Player(1, 'X', [], Dionysus);
const playerTwo = new Player(2, 'O', [], Aphrodite);

const gameManager = (() => {
    let currentPlayer = playerOne;
    const winCons = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]];
    let round = 1;

    const changeTurn = function() {
        (gameManager.currentPlayer.turn === 1) ? gameManager.currentPlayer = playerTwo : gameManager.currentPlayer = playerOne;
    }

    const checkForWins = (moveset) => {
        let counter = 0;
        for(let j = 0; j < winCons.length; j++) {
            for(let i = 0; i < moveset.length; i++) {
                if(winCons[j].includes(moveset[i])) {
                    counter++;
                    console.log(`Player ${gameManager.currentPlayer.turn} Potential Win ${winCons[j]} - ${moveset[i]} - Hits ${counter}`);
                }
    
                if(counter === 3) {
                    console.log(`Player ${gameManager.currentPlayer.turn} Won!`);
                    gameBoard.enabled = false;
                    return 1;
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

    const playerWonRound = () => {
        gameManager.currentPlayer.roundWins++;
        gameManager.round++;
        gameDisplay.updateRoundWin();
    }

    return {
        currentPlayer,
        changeTurn,
        checkForWins,
        playerWonRound,
        round
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

        if(gameManager.currentPlayer.turn === 1) {
            playerTwoNameTag.classList.remove("active");
            playerOneNameTag.classList.add("active");
        } else {
            playerTwoNameTag.classList.add("active");
            playerOneNameTag.classList.remove("active");
        }
    }

    const playButton = document.querySelector(".play-button");
    playButton.addEventListener('click', changeToGameBoard);

    const colorModeSwitcher = document.getElementById("colorModeSwitch");
    colorModeSwitcher.checked = false;
    colorModeSwitcher.addEventListener('change', () => {
        (gameDisplay.colorMode === "light") ? gameDisplay.colorMode = "dark" : gameDisplay.colorMode = "light";
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

    const updateRoundWin = () => {
        if(gameManager.currentPlayer.turn === 1) {
            document.querySelector(".player-ones-side").querySelector(".win-count").textContent = gameManager.currentPlayer.roundWins;
        } else {
            document.querySelector(".player-twos-side").querySelector(".win-count").textContent = gameManager.currentPlayer.roundWins;
        }

        playerOne.spots = [];
        playerTwo.spots = [];

        gameManager.currentPlayer = playerOne;

        setTimeout(() => {
            gameBoard.clearBoxes();
            document.querySelector(".round-count").textContent = gameManager.round;
            gameDisplay.showCurrentTurn();
        }, 2000)

        gameBoard.enabled = true;
    }

    return {
        showCurrentTurn,
        colorMode,
        updateRoundWin
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
            if(gameManager.checkForWins(gameManager.currentPlayer.spots) === 1){
                gameManager.playerWonRound();
                return;
            } else if (gameManager.checkForWins(gameManager.currentPlayer.spots) === 3) {
                gameManager.round++;
                gameDisplay.updateRoundWin();
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

    const clearBoxes = () => {
        boxes.forEach((box) => {
            box.textContent = "";
            box.classList.remove(`marked-${gameDisplay.colorMode}`);
        });
    }

    return {
        enabled,
        clearBoxes
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

    //Remove Old God
    const removePlayerGod = (num, player) => {
        document.querySelector(`.player-${num}-select`).querySelector(".player-select").classList.remove(player.god.buttonClass);
        document.querySelector(`.player-${num}`).querySelector(`.player-icon-section`).classList.remove(player.god.image);
    }

    //Add new God
    const addPlayerGod = (num, player) => {
        document.querySelector(`.player-${num}s-side`).querySelector(".player-image").src = player.god.bond;
        document.querySelector(`.player-${num}`).querySelector(`.player-icon-section`).classList.add(player.god.image);
    }

    //Edit God 
    const playerOneEdit = document.querySelector(".player-one").querySelector(".edit");
    const playerTwoEdit = document.querySelector(".player-two").querySelector(".edit");

    playerOneEdit.addEventListener("click", () => {
        editPlayer.openModal(playerOne);
    });
    playerTwoEdit.addEventListener("click", () => {
        editPlayer.openModal(playerTwo);
    });

    return {
        removePlayerGod,
        addPlayerGod
    }
})();

const editPlayer = (() => {
    const modal = document.querySelector("#modal");
    const modalClose = document.querySelector(".close");
    let playerToEdit;

    modalClose.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    });

    const openModal = (player) => {
        editPlayer.modal.classList.toggle("hidden");
        playerToEdit = player;
    }

    const changeGod = (god) => {
        if(playerToEdit === playerOne) {
            playerSelectManager.removePlayerGod("one", playerOne);
            playerToEdit.god = god;
            playerSelectManager.addPlayerGod("one", playerOne);
        } else {
            playerSelectManager.removePlayerGod("two", playerTwo);
            playerToEdit.god = god;
            playerSelectManager.addPlayerGod("two", playerTwo);
        }
    }

    document.querySelectorAll(".god").forEach((god) => {
        god.addEventListener("click", () => {
            switch(god.id) {
                case "dionysus":
                    editPlayer.changeGod(Dionysus);
                    break;
                case "aphrodite":
                    editPlayer.changeGod(Aphrodite);
                    break;
                case "artemis":
                    editPlayer.changeGod(Artemis);
                    break;
                case "hermes":
                    editPlayer.changeGod(Hermes);
                    break;
                case "ares":
                    editPlayer.changeGod(Ares);
                    break;
            }
        });
    });

    return {
        modal,
        openModal,
        changeGod,
        playerToEdit
    }
})();




