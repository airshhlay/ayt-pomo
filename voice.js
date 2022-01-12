const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
// const { connect } = require("amqplib/lib/connect");
const AUDIO_TITLES = {
  breakStart: "breakStart",
  pomStart: "pomStart",
  pomEnd: "pomEnd",
  breakStop: "breakStop",
  longBreakStart: "longBreakStart"
}

// audio configurations
const audioResources = {
  pomStart: createAudioResource(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    {
      inputType: StreamType.Arbitrary,
    }
  ),
  pomEnd: createAudioResource(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    {
      inputType: StreamType.Arbitrary,
    }
  ),
  breakStart: createAudioResource(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    {
      inputType: StreamType.Arbitrary,
    }
  ),
  longBreakStart: createAudioResource(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    {
      inputType: StreamType.Arbitrary,
    }
  ),
  breakEnd: createAudioResource(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    {
      inputType: StreamType.Arbitrary,
    }
  ),
};

class PlayerWrapper {
  constructor() {
    this.audioResources = audioResources;
    this.player = createAudioPlayer();
  }

  // create a voice connection
  async connectToChannel(message) {
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
  
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
      console.log("Voice connection ready")
      connection.subscribe(this.player)
      return connection;
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  playSong(name) {
    let resource = audioResources[name]
    console.log(resource)
  
    if (resource) {
      this.player.play(resource);
      return entersState(this.player, AudioPlayerStatus.Playing, 5e3);
    } else {
      console.log("audio resource not found")
    }
  }
}

module.exports = {
  PlayerWrapper
}