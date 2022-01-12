// container
class Container {
  constructor() {
    this.pomodoros = [];
  }

  addPomodoro(pomodoro) {
    this.pomodoros.push(pomodoro);
  }

  removePomodoro(id) {
    this.pomodoros = this.pomodoros.filter((pomodoro) => pomodoro.id != id);
  }
}