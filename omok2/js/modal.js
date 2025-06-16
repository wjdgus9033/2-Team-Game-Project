const modalWrapperEl = document.getElementById("modal-wrapper");
const modalMessageEl = document.getElementById("modal-message");
const modalEl = document.getElementById("modal");

function createStart() {
  const startBtn = document.createElement("button");
  const message = document.createElement("p");
  let isRemoved = false;

  modalWrapperEl.style.display = "flex";

  setMessage(message, startBtn);

  for(let i = 0; i < playerScoreEl.length; i++) {
    playerScoreEl[i].innerHTML = "";
  }

  startBtn.id = "game-start-btn";
  startBtn.addEventListener("click", () => {
    modalWrapperEl.style.display = "none";
    game.start();
    updateTurnUI(game.activePlayer);
    timerStatus.updateTimeUI();
    modalEl.removeChild(startBtn);
    isRemoved = true;
  });

  modalWrapperEl.addEventListener("click", () => {
    modalWrapperEl.style.display = "none";
    game.start();
    updateTurnUI(game.activePlayer);
    timerStatus.updateTimeUI();
    if (!isRemoved) modalEl.removeChild(startBtn);
  });

  player1El.style.border = "none";
  player2El.style.border = "none";
  
  modalEl.appendChild(startBtn);
  modalMessageEl.appendChild(message);
}

function setMessage(message, startBtn) {
  modalMessageEl.innerHTML = "";
  if (game.isOver && game.activePlayer === -1) {
    startBtn.textContent = "다시시작";
    message.textContent = "무승부!";
  } else if (game.isOver) {
    startBtn.textContent = "다시시작";
    message.innerHTML = `${
      game.player[game.activePlayer].name
    }돌이 승리하였습니다.<br/>
    소요된 턴 : ${game.currentRound} <br/>
    획득한 점수 : ${game.player[game.activePlayer].score} <br/>
    게임 시간 : ${Math.floor((Date.now() - timerStatus.startTime) / 1000)}초`;
  } else {
    startBtn.textContent = "시작하기";
    message.textContent = "게임을 시작하기";
  }
}
