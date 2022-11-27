const initialState = {
  round: 1,
  currentPlayer: "p1",
  attempt: 1,
  score: { p1: 0, p2: 0 },
  openCards: [],
};
const colors = ["green", "purple", "red", "blue", "orange"];
const localStorageState = window.localStorage.getItem("gameState");
let gameState =
  JSON.parse(localStorageState) || generateGameState(initialState, colors);

createCardList(gameState.cards);
updateGameState(gameState);

function generateGameState(initialState, colors) {
  const initialGameState = {
    ...initialState,
    objective: colors[Math.round(Math.random() * 4)],
    cards: shuffle(colors),
  };

  window.localStorage.setItem("gameState", JSON.stringify(initialGameState));

  return initialGameState;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function updateGameState(newGameState) {
  gameState = newGameState;
  window.localStorage.setItem("gameState", JSON.stringify(newGameState));
  updateAttempt(newGameState.attempt);
  updateRound(newGameState.round);
  updatePlayer(newGameState.currentPlayer);
  updateNextPlayer(newGameState.currentPlayer);
  updateObjective(newGameState.objective);
}

function updateRound(round) {
  const roundElement = document.querySelector("#round");
  roundElement.textContent = `${round.toString().padStart(2, "0")} Rodada!`;
}

function updatePlayer(currentPlayer) {
  const playerName =
    window.localStorage.getItem(currentPlayer) ||
    `Jogador 0${currentPlayer[1]}`;

  const playerElement = document.querySelector("#player");
  playerElement.textContent = playerName;
}

function updateNextPlayer(currentPlayer) {
  const nextPlayer = currentPlayer === "p1" ? "p2" : "p1";
  const nextPlayerName =
    window.localStorage.getItem(nextPlayer) || `Jogador 0${nextPlayer[1]}`;

  const nextPlayerElement = document.querySelector("#nextPlayer");
  nextPlayerElement.textContent = nextPlayerName;
}

function updateAttempt(attempt) {
  const playerElement = document.querySelector("#attempt");
  playerElement.textContent = `${attempt
    .toString()
    .padStart(2, "0")} Tentativa`;
}

function updateObjective(objective) {
  const objectiveElement = document.querySelector("#objective");
  objectiveElement.innerHTML = "";
  const cardElement = createCard(objective, true);

  objectiveElement.appendChild(cardElement);
}

function createCard(color, open) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  const cardInnerElement = document.createElement("div");
  cardInnerElement.classList.add("card-inner");

  if (open) {
    cardInnerElement.classList.add("open");
  }

  const cardFrontElement = document.createElement("div");
  cardFrontElement.classList.add("card-front");

  const cardButtonElement = document.createElement("button");
  cardButtonElement.classList.add("card-button");
  cardButtonElement.textContent = "?";
  cardButtonElement.addEventListener("click", handleCardClick);

  const cardBackElement = document.createElement("div");
  cardBackElement.classList.add("card-back");

  const cardImageElement = document.createElement("img");
  cardImageElement.src = `./src/assets/${color}-card.svg`;
  cardImageElement.alt = color;

  cardBackElement.appendChild(cardImageElement);
  cardFrontElement.appendChild(cardButtonElement);
  cardInnerElement.appendChild(cardFrontElement);
  cardInnerElement.appendChild(cardBackElement);
  cardElement.appendChild(cardInnerElement);

  return cardElement;
}

function createCardList(cards) {
  const cardList = document.getElementById("cardList");
  cardList.innerHTML = "";

  const cardElements = cards.map((color) => {
    const listItemElement = document.createElement("li");
    const cardElement = createCard(color, gameState.openCards.includes(color));
    listItemElement.appendChild(cardElement);

    return listItemElement;
  });

  cardList.append(...cardElements);
}

function handleCardClick(e) {
  const cardElement = e.target.closest("li");
  const cardInnerElement = e.target.closest(".card-inner");
  const cardIndex = Array.from(cardElement.parentElement.children).indexOf(
    cardElement
  );

  const isLastAttempt = gameState.attempt === 3;
  const isObjectiveCard = gameState.cards[cardIndex] === gameState.objective;
  const isLastRound = gameState.round === 3 && gameState.currentPlayer === "p2";

  if (gameState.openCards.includes(cardIndex)) {
    return;
  }

  if (isLastAttempt || isObjectiveCard) {
    disableCardsButton(true);
    const newGameState = {
      ...gameState,
      openCards: [...gameState.openCards, gameState.cards[cardIndex]],
    };
    cardInnerElement.classList.add("open");
    updateGameState(newGameState);
  }

  if (isObjectiveCard) {
    if (isLastRound) {
      setTimeout(seeGameResult, 2000);
      return;
    }

    setTimeout(() => triggerPlayerChange(roundWonUpdate), 500);
    return;
  }

  if (isLastAttempt) {
    if (isLastRound) {
      setTimeout(seeGameResult, 2000);
      return;
    }

    setTimeout(() => triggerPlayerChange(roundLostUpdate), 1000);
    return;
  }

  const newGameState = {
    ...gameState,
    attempt: gameState.attempt + 1,
    openCards: [...gameState.openCards, gameState.cards[cardIndex]],
  };
  cardInnerElement.classList.add("open");
  updateGameState(newGameState);
}

function disableCardsButton(disable) {
  const cardsButton = document.querySelectorAll(".card-button");

  cardsButton.forEach((button) => {
    button.disabled = disable;
  });
}

function triggerPlayerChange(roundUpdateCb) {
  const notificationElement = document.querySelector("#playerChange");
  notificationElement.classList.add("active");

  setTimeout(() => {
    notificationElement.classList.remove("active");
    roundUpdateCb();
  }, 1000);
}

function roundWonUpdate() {
  disableCardsButton(false);
  const newScore =
    gameState.score[gameState.currentPlayer] + (4 - gameState.attempt);

  const newGameState = {
    ...gameState,
    round:
      gameState.currentPlayer === "p2" ? gameState.round + 1 : gameState.round,
    attempt: 1,
    currentPlayer: gameState.currentPlayer === "p1" ? "p2" : "p1",
    objective: colors[Math.round(Math.random() * 4)],
    cards: shuffle(colors),
    score: {
      ...gameState.score,
      [gameState.currentPlayer]: newScore,
    },
    openCards: [],
  };

  updateGameState(newGameState);
  createCardList(newGameState.cards);
}

function roundLostUpdate() {
  disableCardsButton(false);

  const newGameState = {
    ...gameState,
    round:
      gameState.currentPlayer === "p2" ? gameState.round + 1 : gameState.round,
    attempt: 1,
    currentPlayer: gameState.currentPlayer === "p1" ? "p2" : "p1",
    objective: colors[Math.round(Math.random() * 4)],
    cards: shuffle(colors),
    openCards: [],
  };

  updateGameState(newGameState);
  createCardList(newGameState.cards);
}

function seeGameResult() {
  window.location.href = "resultado.html";
  return;
}
