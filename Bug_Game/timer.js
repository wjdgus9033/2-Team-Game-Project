
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            gameOverText = "TimeOut!";
            endGame();
        }
    }, 1000);
}
