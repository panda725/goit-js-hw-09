import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DELAY = 1000;
const refs = {
  picker: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  btnReset: document.querySelector('button[data-reset]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notify.failure('Please choose a date in the future');
    } else {
      Notify.success('Date was chosed, press Start');
      refs.btnStart.disabled = false;
    }
  },
};

flatpickr(refs.picker, options);

class calendarTimer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  onStart() {
    if (this.isActive) {
      return;
    }

    const selectedTime = new Date(refs.picker.value);
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const countdown = selectedTime - currentTime;
      const interfaceTime = this.convertMs(countdown);

      if (countdown < 1000) {
        clearInterval(this.intervalId);
      }

      this.onTick(interfaceTime);
    }, DELAY);
  }

  onReset() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const interfaceTime = this.convertMs(0);
    this.onTick(interfaceTime);
    Notify.success('Done');
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }
}

// экземпляр
const calendarUI = new calendarTimer({
  onTick: updateInterface,
});

refs.btnStart.addEventListener('click', () => {
  calendarUI.onStart();
});
refs.btnReset.addEventListener('click', () => {
  calendarUI.onReset();
});

// add to interface

function updateInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}
