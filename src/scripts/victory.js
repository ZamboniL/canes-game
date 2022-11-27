function main() {
  const playAgainButton = document.getElementById("playAgain");
  playAgainButton.addEventListener("click", handlePlayAgain);

  const localGameState = localStorage.getItem("gameState");
  const p1 = localStorage.getItem("p1") || "Jogador 01";
  const p2 = localStorage.getItem("p2") || "Jogador 02";

  if (!localGameState) {
    window.location.href = "index.html";
  }

  const gameState = JSON.parse(localGameState);

  const isTie = gameState.score.p1 === gameState.score.p2;
  const winner = gameState.score.p1 > gameState.score.p2 ? "p1" : "p2";

  if (isTie) {
    handleTie(gameState, p1, p2);
    return;
  }

  handleWin(gameState, winner, p1, p2);
}

function handlePlayAgain() {
  localStorage.removeItem("gameState");
  localStorage.removeItem("p1");
  localStorage.removeItem("p2");

  window.location.href = "index.html";
}

function handleTie(gameState, p1, p2) {
  document.querySelector("#tie").style.display = "flex";

  document.querySelector("#p1Name").textContent = p1;
  document.querySelector(
    "#p1Score"
  ).textContent = `${gameState.score.p1} Pontos`;
  document.querySelector("#p2Name").textContent = p2;
  document.querySelector(
    "#p2Score"
  ).textContent = `${gameState.score.p2} Pontos`;
}

function handleWin(gameState, winner, p1, p2) {
  document.querySelector("#win").style.display = "flex";

  document.querySelector("#winnerName").textContent = winner === "p1" ? p1 : p2;
  document.querySelector(
    "#winnerScore"
  ).textContent = `${gameState.score[winner]} Pontos`;

  document.querySelector("#loserName").textContent = winner === "p1" ? p2 : p1;
  document.querySelector("#loserScore").textContent = `${
    gameState.score[winner === "p1" ? "p2" : "p1"]
  } Pontos`;
}

main();
