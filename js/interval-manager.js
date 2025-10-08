let intervalIds = [];

function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

function stopGame() {
  intervalIds.forEach(clearStoppableInterval);
  intervalIds = [];
}

function clearStoppableInterval(id) {
  clearInterval(id);
  intervalIds = intervalIds.filter((intervalId) => intervalId !== id);
}

function getActiveIntervalsCount() {
  return intervalIds.length;
}
