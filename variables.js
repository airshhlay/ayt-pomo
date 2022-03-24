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
    mute: "bot!quiet",
  };
} else {
  COMMANDS = {
    start: "ayt!start",
    textonly: "ayt!tostart",
    stop: "ayt!stop",
    status: "ayt!status",
    dm: "ayt!dm",
    toggletext: "ayt!togtext",
    // volume: "ayt!volume",
    mute: "ayt!quiet",
    help: "ayt!help",
    clear: "ayt!clear",
  };
}

/**
 * Return a random element from an array that is
 * different than `last` (as long as the array has > 1 items). 
 * Return null if the array is empty.
*/
function getRandomDifferent(arr, last = undefined) {
  if (arr.length === 0) {
    return null;
  } else if (arr.length === 1) {
    return [0, arr[0]];
  } else {
    let num = 0;
    do {
      num = Math.floor(Math.random() * arr.length);
    } while (arr[num] === last);
    return [num, arr[num]];
  }
}

// ====== BREAK FREQUENCY ======
const LASTWORK_TIME = [7, 15, 23];
const BIGBREAK_TIME = [8, 16, 24];

// ====== IMAGES ======
const COMMON_THUMBNAIL = {
//   url: "https://www.dropbox.com/s/c4pjyfx0cf03058/kamisato-namecard-ayato.png?raw=1"
};
const USE_COMMON_THUMBNAIL = false;
const ENDING_IMAGES = ["https://www.dropbox.com/s/y0mi6m26prgv2ha/ayato-asdfghhjk-sir.jpeg?raw=1", "https://www.dropbox.com/s/glqj50dr7py31se/ayato-hottie-schmottie.jpeg?raw=1", "https://www.dropbox.com/s/8cr20cl4w8hjefe/sir-u-r-so-pretty.jpeg?raw=1", "https://www.dropbox.com/s/tjbo426tzkouw66/wife.JPG?raw=1", "https://twitter.com/gifgenshin/status/1506856619811827713?s=12"];
const BREAK_IMAGES = ["https://www.dropbox.com/s/gt1jr2c7dhlqzxi/ayato-blep.jpg?raw=1", "https://www.dropbox.com/s/x2pzik6bbjimbm6/chibi-yato-yay.png?raw=1", "https://www.dropbox.com/s/x2pzik6bbjimbm6/chibi-yato-yay.png?raw=1", "https://www.dropbox.com/s/vekkxt7bi6zaoro/potato-chibi-yato.jpeg?raw=1"];
const START_IMAGES = ["https://www.dropbox.com/s/88teobklvhzigly/kamisato-estate.jpg?raw=1", "https://www.dropbox.com/s/3nzr0ttf11boi5s/ezgif-1-7c25bd3cb6.gif?raw=1"];

var lastEndingIndex;
var lastBreakIndex;
var lastStartIndex;

// ====== AUDIO ======
const AUDIO = {
  break: "https://www.dropbox.com/s/9b9jhyu2g0q8rbm/lana-notif-sound.mp3?raw=1",
  work: "https://www.dropbox.com/s/9b9jhyu2g0q8rbm/lana-notif-sound.mp3?raw=1"
}

// ====== ERROR MESSAGES ======
const ERRORS = {
  INVALID_TIME: "I need a valid time between 5 and 120 min.",
  INSUFFICIENT_ARGS: "You have to give me the [work time] [short break time] [long break time] options, or just use the default command without options.",
  ALR_EXISTS: "We're already working, we should finish that one up first.",
  VOICE_CHANNEL_ERR: "I can't join your voice channel... hmmm... you.. did not give me permission?",
  NOT_IN_VOICE_CHANNEL_JOIN:
    "Fufu... you missed a step - join a voice channel first.",
  NOT_IN_POMO: "Hmm... you're not part of my voice channel. Join the one I'm in before trying any commands.",
  NO_POMO: "I haven't started work, but you're giving me this command? Pfft. Interesting.",
  DISABLE_TEXT_IN_TEXTONLY:
    "Pfft, you can't disable text in a text-only pomodoro...",
  CHANGE_VOLUME_IN_TEXTONLY:
    "Pfft, you can't change the volume in a text-only pomodoro...",
  QUIET_BOT_WHEN_NO_TEXTALERTS: "Text notifications are already off! You can't mute me at the same time.",
  DISABLE_TEXT_BOT_MUTED: "I'm already muted, you can't disable my text notifications! At least one of them has to be enabled, you know.",
  INVALID_VOLUME: "Volumes can only be between 1 to 100~",
  NO_VOLUME_ARG: "Give me a concrete number so I can change the volume~",
  DELETE_MSG_ERR:
    "You didn't give me permission, but you're asking me to delete the channel's messages? Try again~",
};

// ====== NORMAL MESSAGES ======
const SHORT_MSG = {
  TEXT_NOTIF_ON: "Alright, I will send you text notifications~",
  TEXT_NOTIF_OFF: "I will stop sending text notifications~",
  DM_ON: "You want me to message you directly instead? Fufu, how bold of you~",
  DM_OFF: "Heh, no more direct messages for you~",
  MUTE: "Alright, quiet time~",
  UNMUTE: "Sure, I will play an alert when it's time"
}

// ====== EMBED MESSAGES ======
// (includes images, background color, formatting etc.)
function createEmbedMsg(type, par1 = null, par2 = null, par3 = null) {

  let randomThumbnail = getRandomDifferent(BREAK_IMAGES, lastBreakIndex);
  lastBreakIndex = randomThumbnail[0];
  let thumbnail = randomThumbnail[1];
  const SHORT_BREAK_MSG = {
    color: "#f00",
    title: "Time for a Short Break",
    description: `We have worked for ${
      par1 / 60000
    } min~ Let's take a ${par2 / 60000} min break.`,
    thumbnail: {
      // TODO: change image to cute ayato chibi
      url: thumbnail
    }
  };

  const LONG_BREAK_MSG = {
    color: "#f00",
    title: "Time for a Long Break",
    description: `We have worked for ${
      par1 / 60000
    } min~ Time for a long break for ${par2 / 60000} min! Hmm... did you see my chest of Onikabutos?`,
    thumbnail: {
      // TODO: change image to cute ayato chibi
      url: thumbnail
    }
  };

  const WORK_RESUME_MSG = {
    color: "#f00",
    title: "Back to Work",
    description: `Our ${par2 / 60000} min break has ended... Let's get back to it.`,
    /*
    footer: {
      text: "When, I wonder, did you come under the illusion that your tasks could complete themselves?"
    } */
  };

  let randomStart = getRandomDifferent(START_IMAGES, lastStartIndex);
  lastStartIndex = randomStart[0];
  let startImage = randomStart[1];
  const POMO_START_MSG = {
    color: "#f00",
    title: "Ah... Another Work Day",
    description: `Work duration: ${par1 / 60000} min\nShort break: ${
      par2 / 60000 
    } min\nLong break: ${par3 / 60000} min`,
    image: {
      url: startImage
    }
  };

  let randomEnd = getRandomDifferent(ENDING_IMAGES, lastEndingIndex)
  lastEndingIndex = randomEnd[0];
  let endingImage = randomEnd[1];
  const POMO_STOP_MSG = {
    color: "#f00",
    title: "Work Hours Are Over~",
    description: `We've worked for: ${par1} min\nTotal completed work cycles: ${par2}\nHope you were productive^^`,
    image: {
      url: endingImage
    },
  };

  const POM_STATUS_TO_BREAK = {
    color: "#f00",
    description: `${par1 + 1} min left to our break, no slacking off~`
  }

  const POM_STATUS_TO_WORK = {
    color: "#f00",
    description: `${par1 + 1} min left before it's back to work~`
  }

  const HELP_MSG = {
    color: "#f00",
    title: "Asking Me for Help?",
    description: "Here are the commands I'm providing you~ Read it carefully^^",
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
        value: "ayt!start [work time] [short break time] [long break time]",
        isInline: true,
      },
      {
        name: "Start a text-only pomodoro with specific values",
        value: "ayt!tostart [work time] [short break time] [long break time]",
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
        name: "Toggle direct message notifications",
        value: "ayt!dm",
        isInline: true,
      },
      {
        name: "Toggle sending of channel notifications",
        value: "ayt!togtext",
        isInline: true,
      },
      {
        name: "Toggle playing of song in voice channel",
        value: "ayt!quiet",
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
  if (USE_COMMON_THUMBNAIL && !msgBase.thumbnail) {
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
