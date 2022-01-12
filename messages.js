const ALERT_IMG = {
  longBreakStart: "./visuals/break-start.jpg",
  breakStart: "./visuals/break-start.jpg",
  pomEnd: "./visuals/pom-end.gif",
  pomStart: "./visuals/pom-start.jpg",
  breakEnd: "./visuals/break-end.jpg",
};

// STATUS MESSAGES
const ERRORS = {
  INVALID_TIME: "Insert a valid time between 5 and 120 minutes!",
  ALR_EXISTS: "There is already a pomodoro running!",
  VOICE_CHANNEL_ERR: "Unable to join voice channel - check bot permissions!",
  NOT_IN_VOICE_CHANNEL_JOIN:
    "You need to join a voice channel to start this pomodoro",
  NOT_IN_POMO: "You are not in the voice channel",
  NO_POMO: "There are no pomodoros running",
  DISABLE_TEXT_IN_TEXTONLY:
    "You cannot disable text messages in a text-only pomodoro",
  CHANGE_VOLUME_IN_TEXTONLY:
    "You can't change the volume in a text-only pomodoro",
  INVALID_VOLUME: "Please give a value between 1 to 100",
  NO_VOLUME_ARG: "Please give a second argument for the volume",
  DELETE_MSG_ERR:
    "There was a problem with deleting messages - check bot permissions!",
};

function createEmbedMsg(type, par1 = null, par2 = null, par3 = null) {
  const SHORT_BREAK_MSG = {
    color: "#f00",
    title: "Short break starting",
    description: `You have worked for ${
      par1 / 60000
    } minutes! Time for a small break of ${par2 / 60000} minutes!`,
  };

  const LONG_BREAK_MSG = {
    color: "#f00",
    title: "Long break starting",
    description: `You have worked for ${
      par1 / 60000
    } minutes! Time for a long break of ${par2 / 60000} minutes!`,
  };

  const WORK_RESUME_MSG = {
    color: "#f00",
    title: "Resume work",
    description: `Break of  ${par2 / 60000} min has ended! Back to work!`,
  };

  const POMO_START_MSG = {
    color: "#f00",
    title: "Pomodoro Started",
    description: `Work duration: ${par1 / 60000} min | Short break: ${
      par2 / 60000 
    } min | Long break: ${par3 / 60000} min`,
  };

  const HELP_MSG = {
    color: "#f00",
    title: "Commands",
    description: "Here is the list of commands to use the bot!",
    fields: [
      {
        name: "Start the pomodoro with default values (25, 5, 15)",
        value: "ayt!start",
        isInline: true,
      },
      {
        name: "Start a text-only pomodoro with default values",
        value: "ayt!tostart",
        isInline: true,
      },
      {
        name: "Start the pomodoro with specific values",
        value: "ayt!start [work time] [small break time] [big break time]",
        isInline: true,
      },
      {
        name: "Start a text-only pomodoro with specific values",
        value: "ayt!tostart [work time] [small break time] [big break time]",
        isInline: true,
      },
      {
        name: "Stop the pomodoro",
        value: "ayt!stop",
        isInline: true,
      },
      {
        name: "Check the current status of the pomodoro",
        value: "ayt!status",
        isInline: true,
      },
      {
        name: "Toggle the notifications via direct message",
        value: "ayt!dm",
        isInline: true,
      },
      {
        name: "Toggle the channel text notifications",
        value: "ayt!togtext",
        isInline: true,
      },
      {
        name: "Change the volume of the alerts, defaults to 50",
        value: "ayt!volume volume",
        isInline: true,
      },
      {
        name: "Get the list of commands",
        value: "ayt!help",
        isInline: true,
      },
    ],
  };

  const POMO_MAX = {
    color: "#f00",
    title: "Maximum pomodoro cycles reached",
    description: "Take a break!",
  };

  const POMO_STOP_MSG = {
    color: "#f00",
    title: "Pomodoro session ended! Here's a summary:",
    fields: [
      {name: "Total Cycles", value: `${par1}`, isInline: true},
      {name: "Work duration", value: `${par2 * par3} min`, isInline: true}
    ],
    description: `Total cycles: ${par1} | Total work time: ${par2 * par3} min`,
  };

  var msgBase;
  switch (type) {
    case "stop":
      msgBase = POMO_STOP_MSG;
      break;
    case "start":
      msgBase = POMO_START_MSG;
      break;
    case "shortBreak":
      msgBase = SHORT_BREAK_MSG;
      break;
    case "longBreak":
      msgBase = LONG_BREAK_MSG;
      break;
    case "workResume":
      msgBase = WORK_RESUME_MSG;
      break;
    case "help":
      msgBase = HELP_MSG;
      break;
  }
  return msgBase;
}

module.exports = {
  ERRORS,
  createEmbedMsg,
};
