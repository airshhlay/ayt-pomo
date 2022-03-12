const ytdl = require('ytdl-core');
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  AudioPlayerPlayingState,
  VoiceConnectionStatus,
  NoSubscriberBehavior,
  AudioPlayer,
} = require("@discordjs/voice");
const {AUDIO} = require("./variables")

class PlayerWrapper {
  constructor() {
    this.player = null;
    this.toPlayLofi = false;
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
      this.connection = connection
      return connection;
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  playSong(name) {
    if (this.toPlayLofi) {
      return;
    }

    console.log("not playing lofi, play notif")

    this.player = new AudioPlayer();
    if (!this.connection.subscribe(this.player)) {
      console.log("connection unable to subscribe to player")
    }


    if (!AUDIO[name]) {
      console.log(`audio resource ${name} not found`)
      return;
    }

    let resource = createAudioResource(AUDIO[name], {
      inputType: StreamType.Arbitrary
    })
    if (!resource) {
      console.log("unable to create resource");
      return;
    }

    this.player.play(resource);
  }

  playLofi() {
    this.player = new AudioPlayer();
    if (!this.connection.subscribe(this.player)) {
      console.log("connection unable to subscribe to player")
    }

    this.toPlayLofi = true;
    const stream = ytdl(AUDIO.lofi, { filter: 'audioonly' });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    if (resource) {
        this.player.play(resource);
    }
  }

  stopLofi() {
    this.toPlayLofi = false;
    this.player.stop();
  }
}

module.exports = {
  PlayerWrapper
}