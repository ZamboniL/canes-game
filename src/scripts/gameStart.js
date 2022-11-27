function main() {
  const form = document.getElementById("gameStartForm");
  form.addEventListener("submit", handleSubmit);

  const questionBox = document.querySelector(".question-box");
  const closeButton = document.querySelector(".close-button");

  questionBox.addEventListener("click", handleHowToPlayClick);
  closeButton.addEventListener("click", handleHowToPlayClick);
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const p1 = form.elements["p1"].value;
  const p2 = form.elements["p2"].value;

  if (p1 && p2) {
    localStorage.setItem("p1", p1);
    localStorage.setItem("p2", p2);
    window.location.href = "jogo.html";
    return;
  }

  alert("Preencha ambos os campos!");
}

function handleHowToPlayClick() {
  const questionBox = document.querySelector(".question-box");
  const howToPlay = document.querySelector("#howToPlay");
  const gameStart = document.querySelector("#gameStart");

  questionBox.classList.toggle("active");
  howToPlay.classList.toggle("active");
  gameStart.classList.toggle("active");
}

main();
