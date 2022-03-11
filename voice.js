const {
  joinVoiceChannel,
  getVoiceConnection,
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
      return connection;
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  playSong(name, id) {
    if (AUDIO[name]) {
      let connection = getVoiceConnection(id);
      let subscription = connection.subscribe(this.player);
      let resource = createAudioResource(AUDIO[name], {
        inputType: StreamType.Arbitrary
      })
      if (resource && subscription) {
        console.log(`playing audio resource: ${name}`)
        this.player.play(resource);
        return entersState(this.player, AudioPlayerStatus.Playing, 5e3);
      }
    }
    console.log(`audio resource ${name} not found`)
  }
}

module.exports = {
  PlayerWrapper
}