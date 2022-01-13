require("dotenv").config();
const { MessageEmbed, Client, Intents } = require("discord.js");
const { PlayerWrapper } = require("./voice");
const {
  ERRORS,
  SHORT_MSG,
  COMMANDS,
  LASTWORK_TIME,
  BIGBREAK_TIME,
  createEmbedMsg
} = require("./variables")

// audio configuration
const playerW = new PlayerWrapper()

class Pomodoro {
  constructor(
    workTime,
    smallBreak,
    bigBreak,
    connection,
    id,
    message,
    textOnly
  ) {
    this.id = id;
    this.workTime = workTime;
    this.smallBreak = smallBreak;
    this.bigBreak = bigBreak;
    this.peopleToDm = [];
    this.textAlerts = true;
    this.volume = 0.5;
    this.connection = connection;
    this.message = message;
    this.time = 1;
    this.pomoCreatedTime = new Date();
    this.timerStartedTime = new Date();
    this.dispatcher = null;
    this.timer = null;
    this.interval = null;
    this.textOnly = textOnly;
    this.audio = ""

    this.workCount = 0

    var pomoStartMsg = createEmbedMsg("start", this.workTime, this.smallBreak, this.bigBreak)
    this.message.channel.send(
      {embeds: [pomoStartMsg]}
    );


    this.startANewCycle();
  }

  sendRelevantAlerts(embed, message) {
      //Send Text Alerts
      if (this.textAlerts) {
        if (embed) {
          this.message.channel.send({ embeds: [message] });
        } else {
          this.message.channel.send(message)
        }
      }

      if (!this.textOnly && this.connection) {
        playerW.playSong(this.audio)
      }

      //Send DM Alerts
      if (this.peopleToDm.length > 0) {
        this.peopleToDm.forEach((person) => {
          try {
            if (embed) {
              client.users.fetch(person).then(usr => {
                usr.send({ embeds: [message] })
              })
            } else {
              client.users.fetch(person).then(usr => {
                usr.send(message)
              })
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
  }

  startANewCycle() {
    console.log("CURRENT CYCLE")
    console.log("time: " + this.time)
    console.log("interval: " + this.interval)
    try {
      if (this.time >= 25) {
        this.stopTimer();

        var maxReachedMsg = createEmbedMsg("pomoMax")
        this.message.channel.send(
          {embed: [maxReachedMsg]}
        );

        if (!this.textOnly) {
          this.connection.destroy();
        }

        container.removePomodoro(this.message.guild.id);
        return;
      }

      var alertMsg;

      if (this.time % 2 != 0 && !LASTWORK_TIME.includes(this.time)) {
        this.interval = this.workTime;
        this.audio = "break"
        alertMsg = createEmbedMsg("shortBreak", this.workTime, this.smallBreak)
      } else if (LASTWORK_TIME.includes(this.time)) {
        this.interval = this.workTime;
        this.audio = "break"
        alertMsg = createEmbedMsg("longBreak", this.workTime, this.smallBreak)
      } else if (this.time % 2 == 0 && !BIGBREAK_TIME.includes(this.time)) {
        this.workCount ++;
        this.interval = this.smallBreak;
        this.audio = "work"
        alertMsg = createEmbedMsg("workResume", this.workTime, this.smallBreak)
      } else if (BIGBREAK_TIME.includes(this.time)) {
        this.workCount ++;
        this.interval = this.bigBreak;
        this.audio = "work"
        alertMsg = createEmbedMsg("workResume", this.workTime, this.longBreak)
      }

      this.timerStartedTime = new Date();

      this.timer = setTimeout(() => {
        this.time++;

        console.log("CYCLE OVER, STARTING NEXT CYCLE")
        console.log("time: " + this.time)
        console.log("interval: " + this.interval)
        console.log(": " + this.interval)

        //Send Text Alerts
        this.sendRelevantAlerts(true, alertMsg)
  
        //Start a New Cycle
        this.startANewCycle();
      }, this.interval);
    } catch (err) {
      console.log(err);
    }
  }

  stopTimer() {
    var timeElapsed = Math.floor((new Date().getTime() - this.pomoCreatedTime.getTime()) / 60000)
    var summaryMsg = createEmbedMsg("stop", timeElapsed, this.workCount)
    this.sendRelevantAlerts(true, summaryMsg)
    clearTimeout(this.timer);
    if (!this.textOnly) {
      this.connection.destroy();
    }
  }

  addToDM(id, message) {
    if (this.peopleToDm.filter((person) => person == id).length == 0) {
      this.peopleToDm.push(id);
      message.reply(SHORT_MSG.DM_ON);
    } else {
      this.peopleToDm = this.peopleToDm.filter((person) => person != id);
      message.reply(SHORT_MSG.DM_OFF);
    }
  }

  toggleNotifications(message) {
    this.textAlerts = !this.textAlerts;

    if (this.textAlerts) {
      message.channel.send(SHORT_MSG.TEXT_NOTIF_ON);
    } else {
      message.channel.send(SHORT_MSG.TEXT_NOTIF_OFF);
    }
  }

  changeVolume(volume) {
    this.volume = volume;
  }
}

// container to manage pomodoro objects
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


// run the bot
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});


if (process.env.SH_TOKEN == "" || process.env.SH_TOKEN == undefined) {
  client.login(process.env.DJS_TOKEN);
} else {
  client.login(process.env.SH_TOKEN);
}

client.on("ready", () => {
  console.log("❤");
  client.user.setActivity("ayt!help");
});

let container = new Container();

// parameter parsing
function checkParams(arg1, arg2, arg3, message) {
  let checked = true;

  // if (arg1) {
  //   if (parseInt(arg1) < 5 || parseInt(arg1) > 120 || isNaN(parseInt(arg1))) {
  //     message.channel.send(ERRORS.INVALID_TIME);
  //     checked = false;
  //   }
  // }

  // if (arg2) {
  //   if (parseInt(arg2) < 5 || parseInt(arg2) > 120 || isNaN(parseInt(arg2))) {
  //     message.channel.send(ERRORS.INVALID_TIME);
  //     checked = false;
  //   }
  // }

  // if (arg3) {
  //   if (parseInt(arg3) < 5 || parseInt(arg3) > 120 || isNaN(parseInt(arg3))) {
  //     message.channel.send(ERRORS.INVALID_TIME);
  //     checked = false;
  //   }
  // }

  return checked;
}

setInterval(() => {}, 600000);

// listen for command
client.on("messageCreate", async (message) => {
  if (!message.guild) return;

  const args = message.content.trim().split(" ");

  if (args[0] === COMMANDS.textonly) {
    // validate parameters
    if (!checkParams(args[1], args[2], args[3], message)) {
      return;
    }

    // Check if there's already a pomodoro running on the server
    let pomodoro = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoro.length > 0) {
      message.reply(ERRORS.ALR_EXISTS);
      return;
    }

    //Start the pomodoro
    try {
      if (args[1] && args[2] && args[3]) {
        container.addPomodoro(
          new Pomodoro(
            parseInt(args[1] * 60000),
            parseInt(args[2] * 60000),
            parseInt(args[3] * 60000),
            null,
            message.guild.id,
            message,
            true
          )
        );
      } else {
        container.addPomodoro(
          new Pomodoro(
            1500000,
            300000,
            900000,
            null,
            message.guild.id,
            message,
            true
          )
        );
      }
    } catch (err) {
      console.log(err);
      message.channel.send(
       ERRORS.VOICE_CHANNEL_ERR
      );
      return;
    }
    // add pom start message
  }

  if (args[0] === COMMANDS.start) {
    // Check arguments
    if (!checkParams(args[1], args[2], args[3], message)) {
      return;
    }

    if (message.member.voice.channel) {
      let pomodoro = container.pomodoros.filter(
        (pomodoro) => pomodoro.id == message.guild.id
      );

      if (pomodoro.length > 0) {
        message.reply(ERRORS.ALR_EXISTS);
        return;
      }

      try {
        if (args[1] && args[2] && args[3]) {
          var channel = await playerW.connectToChannel(message)
          container.addPomodoro(
            new Pomodoro(
              parseInt(args[1] * 60000),
              parseInt(args[2] * 60000),
              parseInt(args[3] * 60000),
              channel,
              message.guild.id,
              message,
              false
            )
          );
        } else {
          var channel = await playerW.connectToChannel(message)
          container.addPomodoro(
            new Pomodoro(
              1500000,
              300000,
              900000,
              channel,
              message.guild.id,
              message,
              false
            )
          );
        }
      } catch (err) {
        console.log(err);
        message.channel.send(
          ERRORS.VOICE_CHANNEL_ERR
        );
        return;
      }
    } else {
      message.channel.send(
        ERRORS.NOT_IN_VOICE_CHANNEL_JOIN
      );
      return;
    }
  }

  // Stop the pomodoro
  if (args[0] == COMMANDS.stop) {
    let pomodoroStop = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoroStop.length == 0) {
      message.reply(ERRORS.NO_POMO);
      return;
    }

    if (!pomodoroStop[0].textOnly) {
      if (!message.member.voice.channel) {
        message.reply(ERRORS.NOT_IN_POMO);
        return;
      }
    }

    pomodoroStop[0].stopTimer();
    container.removePomodoro(message.guild.id);

    // add pom stop message
  }

  if (args[0] == COMMANDS.status) {
    let pomodoro = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoro.length == 0) {
      message.reply(ERRORS.NO_POMO);
      return;
    }

    let now = new Date();
    let timePassed = now.getTime() - pomodoro[0].timerStartedTime.getTime();
    let timeLeft;

    if (pomodoro[0].time % 2 != 0) {
      timeLeft = parseInt((pomodoro[0].workTime - timePassed) / 60000);
      message.channel.send({embeds: [createEmbedMsg("statusToBreak", timeLeft)]});
    } else if (pomodoro[0].time % 2 == 0 && pomodoro[0].time != 8) {
      timeLeft = parseInt((pomodoro[0].smallBreak - timePassed) / 60000);
      message.channel.send({embeds: [createEmbedMsg("statusToWork", timeLeft)]});
    } else {
      timeLeft = parseInt((pomodoro[0].bigBreak - timePassed) / 60000);
      message.channel.send({embeds: [createEmbedMsg("statusToWork", timeLeft)]});
    }
  }

  if (args[0] == COMMANDS.help) {
    var helpMsg = createEmbedMsg("help")
    message.channel.send({ embeds: [helpMsg] });
  }

  if (args[0] == COMMANDS.dm) {
    let pomodoro = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoro.length == 0) {
      message.reply(ERRORS.NO_POMO);
      return;
    }

    if (!pomodoro[0].textOnly) {
      if (!message.member.voice.channel) {
        message.reply(ERRORS.NOT_IN_POMO);
        return;
      }
    }

    pomodoro[0].addToDM(message.author.id, message);
  }

  if (args[0] == COMMANDS.toggletext) {
    let pomodoro = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoro.length == 0) {
      message.reply(ERRORS.NO_POMO);
      return;
    }

    if (!pomodoro[0].textOnly) {
      pomodoro[0].toggleNotifications(message);
    } else {
      message.channel.send(
        ERRORS.DISABLE_TEXT_IN_TEXTONLY
      );
      return;
    }

    if (!message.member.voice.channel) {
      message.reply(ERRORS.NOT_IN_POMO);
      return;
    }
  }

  if (args[0] == COMMANDS.volume) {
    let pomodoro = container.pomodoros.filter(
      (pomodoro) => pomodoro.id == message.guild.id
    );

    if (pomodoro[0].textOnly) {
      message.reply(ERRORS.CHANGE_VOLUME_IN_TEXTONLY);
      return;
    }

    if (pomodoro.length == 0) {
      message.reply(ERRORS.NO_POMO);
      return;
    }

    if (!message.member.voice.channel) {
      message.reply(ERRORS.NOT_IN_POMO);
      return;
    }

    if (args[1]) {
      if (
        parseInt(args[1]) < 1 ||
        parseInt(args[1] > 100 || isNaN(parseInt(args[1])))
      ) {
        message.channel.send(ERRORS.INVALID_VOLUME);
      } else {
        pomodoro[0].changeVolume(args[1] / 100);
        message.channel.send(`Volume set to ${args[1]}`);
      }
    } else {
      message.channel.send(
       ERRORS.NO_VOLUME_ARG
      );
    }
  }

  if (args[0] == COMMANDS.clear) {
    let messagesProcessed = 0;
    let allDeleted = true;
    message.channel
      .fetch({ limit: 30 })
      .then((messages) => {
        messages.forEach((message) => {
          let messageContent = message.content.trim().split(" ");
          if (
            COMMANDS.includes(messageContent[0]) ||
            message.author.id == client.user.id
          ) {
            message
              .delete()
              .then(() => {
                messagesProcessed++;
                if (messagesProcessed == 29) {
                  if (!allDeleted) {
                    message.channel.send(
                      ERRORS.DELETE_MSG_ERR
                    );
                  }
                }
              })
              .catch(() => {
                messagesProcessed++;
                allDeleted = false;

                if (messagesProcessed == 29) {
                  if (!allDeleted) {
                    message.channel.send(
                      ERRORS.DELETE_MSG_ERR
                    );
                  }
                }
              });
          }
        });
      })
      .catch(() => {
        message.channel.send(
          ERRORS.DELETE_MSG_ERR
        );
      });
  }
});
