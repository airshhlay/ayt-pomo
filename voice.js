const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const {AUDIO} = require("./variables")

class PlayerWrapper {
  constructor() {
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
    if (AUDIO[name]) {
      let resource = createAudioResource(AUDIO[name], {
        inputType: StreamType.Arbitrary
      })
      console.log(resource)
      if (resource) {
        this.player.play(resource);
        return entersState(this.player, AudioPlayerStatus.Playing, 5e3);
      }
    }
    console.log("audio resource not found")
  }
}

module.exports = {
  PlayerWrapper
}