const refs = {
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};

let timerId = null;

refs.startBtn.addEventListener('click', onClickStart);
refs.stopBtn.addEventListener('click', onClickStop);

function onClickStart(e) {
  timerId = setInterval(() => {
    document.body.style.background = getRandomHexColor();
  }, 1000);
  getBtnDisabled(true, false);
}

function onClickStop(e) {
  clearInterval(timerId);
  getBtnDisabled(false, true);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function getBtnDisabled(disabled, notdisabled) {
  refs.startBtn.disabled = disabled;
  refs.stopBtn.disabled = notdisabled;
}
