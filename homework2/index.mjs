import moment from 'moment';
import colors from 'colors';
import EventEmitter from 'events';

/** class Timer */
class Timer {
  /** create instance of Timer class
   * @param {string} time - time in string value
   * @param {number} id - id of instance
   * @returns {object} - instance of Timer class
   */
  constructor(time, id) {
    this.name = `Timer${id}`;
    this.time = moment(time, 'hh-DD-MM-YYYY');
    this.interval = null;
    this.#set();
  }

  /** Create interval to call private method tick */
  start() {
    this.interval = setInterval(this.#tick.bind(this), 1000);
  }

  /** Stop interval to call method tick */
  stop() {
    emitter.emit('end', this.name);
    clearInterval(this.interval);
  }

  /** Display remaining time */
  print(duration) {
    return `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  }

  /** Call set action */
  #set() {
    emitter.emit('set', this.name, this.time.toLocaleString());
  }

  /** Calculate how much time is left and stop calling or display remaining time */
  #tick() {
    const diff = this.#diffTime();

    if (!this.#check(diff)) this.stop();
    else emitter.emit('tick', this.name, this.print(diff));
  }

  /** Check that difference more 0 */
  #check(diff) {
    if (diff.asSeconds() <= 0) return false;
    return true;
  }

  /** Calculate difference between dates */
  #diffTime() {
    const diff = this.time.diff(moment());
    return moment.duration(diff);
  }
}

/** Create emitter and add listeners */
const emitter = new EventEmitter();

emitter.on('set', (timerName, timeTo) => {
  console.log(`Set ${timerName} to ${timeTo}`);
});

emitter.on('tick', (timerName, remainingTime) => {
  console.log(`${timerName}: ${remainingTime}`);
});

emitter.on('end', (timerName) => {
  console.log(colors.green(`${timerName} is complete`));
});

/** parse and start timers */
const timers = process.argv.slice(2);

for (let i = 0; i < timers.length; i++) {
  new Timer(timers[i], i + 1).start();
}
