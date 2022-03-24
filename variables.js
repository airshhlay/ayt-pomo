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

function getItem(arr, index) {
  if (arr.length == 1) {
    return [0, arr[0]];
  }
  if (index >= arr.length) {
    let wrapped = index % arr.length;
    console.log("current index:  " + wrapped);
    return [wrapped + 1, arr[wrapped]];
  }
  else {
    console.log("current index:  " + (index));
    return [index + 1, arr[index]];
  }
}

// ====== BREAK FREQUENCY ======
const LASTWORK_TIME = [7, 15, 23];
const BIGBREAK_TIME = [8, 16, 24];

// ====== IMAGES ======
var ENDING_IMAGES = ["https://www.dropbox.com/s/y0mi6m26prgv2ha/ayato-asdfghhjk-sir.jpeg?raw=1", "https://www.dropbox.com/s/glqj50dr7py31se/ayato-hottie-schmottie.jpeg?raw=1", "https://www.dropbox.com/s/8cr20cl4w8hjefe/sir-u-r-so-pretty.jpeg?raw=1", "https://www.dropbox.com/s/lx851py1j1imemu/wo-de-lao-po.gif?raw=1"];
var BREAK_IMAGES = ["https://www.dropbox.com/s/gt1jr2c7dhlqzxi/ayato-blep.jpg?raw=1", "https://www.dropbox.com/s/x2pzik6bbjimbm6/chibi-yato-yay.png?raw=1", "https://www.dropbox.com/s/vekkxt7bi6zaoro/potato-chibi-yato.jpeg?raw=1", "https://www.dropbox.com/s/oqacjxt7itpozen/ayato-sus-bbt.gif?raw=1", "https://www.dropbox.com/s/nu0cq71o14mfw88/QT-WITH-BBT.jpeg?raw=1"];
var START_IMAGES = ["https://www.dropbox.com/s/3nzr0ttf11boi5s/jia-zhu-da-ren-520.gif?raw=1"];
var WORK_IMAGES = ["https://www.dropbox.com/s/pf12mfdlp3vs7tn/hardworking-king.jpg?raw=1"];

function shuffleArray(array) {
  return array
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
}

var lastBreakIndex = 0;
var lastWorkIndex = 0;
var lastStartIndex = 0;
var lastEndingIndex = 0;
function resetAll() {
  // ENDING_IMAGES = shuffleArray(ENDING_IMAGES);
  BREAK_IMAGES = shuffleArray(BREAK_IMAGES);
  // START_IMAGES = shuffleArray(START_IMAGES);
  WORK_IMAGES = shuffleArray(WORK_IMAGES);
  lastBreakIndex = 0;
  lastWorkIndex = 0;
}



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
  const SHORT_BREAK_MSG = {
    color: "#f00",
    title: "Time for a Short Break",
    description: `We have worked for ${
      par1 / 60000
    } min~ Let's take a ${par2 / 60000} min break.`
  };

  const LONG_BREAK_MSG = {
    color: "#f00",
    title: "Time for a Long Break",
    description: `We have worked for ${
      par1 / 60000
    } min~ Time for a long break for ${par2 / 60000} min!`,
    footer: {
      text: "Some people treat work as a hobby, you say? Goodness me. How very... exceptional."
    }
  };

  const WORK_RESUME_MSG = {
    color: "#f00",
    title: "Back to Work",
    description: `Our ${par2 / 60000} min break has ended... Let's get back to it.`
  };

  const POMO_START_MSG = {
    color: "#f00",
    title: "Ah... Another Work Day",
    description: `Work duration: ${par1 / 60000} min\nShort break: ${
      par2 / 60000 
    } min\nLong break: ${par3 / 60000} min`
  };


  const POMO_STOP_MSG = {
    color: "#f00",
    title: "Work Hours Are Over~",
    description: `We've worked for: ${par1} min\nTotal completed work cycles: ${par2}\nHope you were productive^^`
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
  var thumbnail;
  var image;
  switch (type) {
    case "stop":
      var randomEnd = getItem(ENDING_IMAGES, lastEndingIndex)
      lastEndingIndex = randomEnd[0];
      image = randomEnd[1];
      resetAll();
      msgBase = POMO_STOP_MSG;
      break;
    case "start":
      var randomStart = getItem(START_IMAGES, lastStartIndex);
      lastStartIndex = randomStart[0];
      image = randomStart[1];
      msgBase = POMO_START_MSG;
      break;
    case "shortBreak":
      var randomThumbnail = getItem(BREAK_IMAGES, lastBreakIndex);
      lastBreakIndex = randomThumbnail[0];
      thumbnail = randomThumbnail[1];
      msgBase = SHORT_BREAK_MSG;
      break;
    case "longBreak":
      var randomThumbnail = getItem(BREAK_IMAGES, lastBreakIndex);
      lastBreakIndex = randomThumbnail[0];
      thumbnail = randomThumbnail[1];
      msgBase = LONG_BREAK_MSG;
      break;
    case "workResume":
      var randomThumbnail = getItem(WORK_IMAGES, lastWorkIndex);
      lastWorkIndex = randomThumbnail[0];
      thumbnail = randomThumbnail[1];
      msgBase = WORK_RESUME_MSG;
      if (lastWorkIndex % 2 == 0) {
        msgBase.footer =  {
          text: "When, I wonder, did you come under the illusion that your tasks could complete themselves?"
        };
      }
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

  if (thumbnail) {
    msgBase.thumbnail = {
      url: thumbnail
    };
  }
  if (image) {
    msgBase.image = {
      url: image
    }
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
