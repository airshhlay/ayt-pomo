// ====== COMMANDS ======
var COMMANDS = {}; 

if (process.env.LOCAL_TEST) {
  COMMANDS = {
    start: "bot!start",
    textonly: "bot!tostart",
    stop: "bot!stop",
    status: "bot!status",
    dm: "bot!dm",
    toggletext: "bot!togtext",
    volume: "bot!volume",
    help: "bot!help",
    clear: "bot!clear",
  };
} else {
  COMMANDS = {
    start: "ayt!start",
    textonly: "ayt!tostart",
    stop: "ayt!stop",
    status: "ayt!status",
    dm: "ayt!dm",
    toggletext: "ayt!togtext",
    volume: "ayt!volume",
    help: "ayt!help",
    clear: "ayt!clear",
  };
}

// ====== BREAK FREQUENCY ======
const LASTWORK_TIME = [7, 15, 23];
const BIGBREAK_TIME = [8, 16, 24];

// ====== IMAGES ======
const COMMON_THUMBNAIL = {
  url: "https://www.dropbox.com/s/ipjarlqc3un89td/test-img.jpg?raw=1"
}

// ====== AUDIO ======
const AUDIO = {
  break: "https://www.dropbox.com/s/dbsn4hz2hogl3wq/break-thoma-theme.mp3?raw=1",
  work: "https://www.dropbox.com/s/6x97u0j634ljz73/work-thoma-theme.mp3?raw=1"
}

// ====== ERROR MESSAGES ======
const ERRORS = {
  INVALID_TIME: "I need a valid time between 5 and 120 minutes.",
  ALR_EXISTS: "We're already working, we should finish that one up first.",
  VOICE_CHANNEL_ERR: "I can't join your voice channel... hmmm... you.. did not give me permission?",
  NOT_IN_VOICE_CHANNEL_JOIN:
    "Fufu... you missed a step - join a voice channel first.",
  NOT_IN_POMO: "Hmm... you're not part of my voice channel. Heh, thought you could fool me? Join the one I'm in before trying any commands.",
  NO_POMO: "I haven't started work, but you're giving me this command? Pfft. Interesting.",
  DISABLE_TEXT_IN_TEXTONLY:
    "Pfft, you can't disable text in a text-only pomodoro...",
  CHANGE_VOLUME_IN_TEXTONLY:
    "Pfft, you can't change the volume in a text-only pomodoro...",
  INVALID_VOLUME: "Volumes can only be between 1 to 100~",
  NO_VOLUME_ARG: "Give me a concrete number so I can change the volume~",
  DELETE_MSG_ERR:
    "You didn't give me permission, but you're asking me to delete the channel's messages? Try again~",
};

// ====== NORMAL MESSAGES ======
const SHORT_MSG = {
  TEXT_NOTIF_OFF: "Alright, I will send you text notifications~",
  TEXT_NOTIF_ON: "I will stop sending text notifications~",
  DM_ON: "You want to message you directly instead? Fufu, how bold of you~ Fine, since I am bored of my paperwork~",
  DM_OFF: "Heh, no more direct messages for you~"
}

// ====== EMBED MESSAGES ======
// (includes images, background color, formatting etc.)
function createEmbedMsg(type, par1 = null, par2 = null, par3 = null) {
  const SHORT_BREAK_MSG = {
    color: "#f00",
    title: "Time for a short break",
    description: `We have worked for ${
      par1 / 60000
    } minutes~ Let's take a ${par2 / 60000} minute break. A cup of tea before my next meeting?`,
  };

  const LONG_BREAK_MSG = {
    color: "#f00",
    title: "Time for a long break",
    description: `We have worked for ${
      par1 / 60000
    } minutes~ Ahhh... time for a long break for ${par2 / 60000} minutes! Now, where did my chest of Onikabutos go?`,
  };

  const WORK_RESUME_MSG = {
    color: "#f00",
    title: "Back to work",
    description: `Ah.... our ${par2 / 60000} min break has ended... A pity. Unfortunately, this work is not going to do itself.`,
  };

  const POMO_START_MSG = {
    color: "#f00",
    title: "Ah... another work day",
    description: `Work duration: ${par1 / 60000} min\n Short break: ${
      par2 / 60000 
    } min\n Long break: ${par3 / 60000} min`,
    image: {
      url: "https://www.dropbox.com/s/tgbhocgiut824iz/test-gif.gif?raw=1"
    },
    thumbnail: {
      url: "https://www.dropbox.com/s/ipjarlqc3un89td/test-img.jpg?raw=1"
    }
  };

  const HELP_MSG = {
    color: "#f00",
    title: "Asking me for help?",
    description: "Here are the commands I'm providing you~ Read it carefully~",
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
    title: "Maximum pomodoro cycles reached - Start a new pomodoro",
    description: "Fufu... trying to work longer hours than me?",
  };

  const POMO_STOP_MSG = {
    color: "#f00",
    title: "Work hours are over~",
    description: `We've worked for ${par1} min~\n Total completed work cycles: ${par2}\nHmm... time to see what Thoma is up to~`,
  };

  const POM_STATUS_TO_BREAK = {
    color: "#f00",
    title: `${par1 + 1}min left to our break, no slacking off~`,
    // description: `Total cycles: ${par1} | Total work time: ${par2 * par3 / 60000} min`,
  }

  const POM_STATUS_TO_WORK = {
    color: "#f00",
    title: `${par1 + 1}min left before work time again~`
  }

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
    case "pomoMax":
      msgBase = POMO_MAX;
      break;
    case "statusToWork":
      msgBase = POM_STATUS_TO_WORK
      break;
    case "statusToBreak":
      msgBase = POM_STATUS_TO_BREAK;
      break;
  }


  // add in common thumbnail
  if (!msgBase.thumbnail) {
    msgBase.thumbnail = COMMON_THUMBNAIL;
  }
  return msgBase;
}

module.exports = {
  ERRORS,
  SHORT_MSG,
  COMMANDS,
  LASTWORK_TIME,
  BIGBREAK_TIME,
  AUDIO,
  createEmbedMsg,
};
