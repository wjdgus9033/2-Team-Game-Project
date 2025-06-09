const modalWrapperEl = document.getElementById("modal-wrapper");
const modalEl = document.getElementById("modal");

function createStart() {
  const startBtn = document.createElement("button");
  let isRemoved = false;
  modalWrapperEl.style.display = "flex";
  startBtn.textContent = game.isOver ? "다시시작" : "시작하기";

  startBtn.id = "game-start-btn";
  startBtn.addEventListener("click", () => {
    modalWrapperEl.style.display = "none";
    game.start();
    modalEl.removeChild(startBtn);
    isRemoved = true;
  });

  modalWrapperEl.addEventListener("click", () => {
    modalWrapperEl.style.display = "none";
    game.start();
    if (!isRemoved) modalEl.removeChild(startBtn);
  });
  modalEl.appendChild(startBtn);
}
