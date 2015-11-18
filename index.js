var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = PlayerEngine
inherits(PlayerEngine, EventEmitter)

function PlayerEngine (files, opts) {
  if (!(this instanceof PlayerEngine)) {
    return new PlayerEngine(files, opts)
  }

  // Save the files into an internal handling
  this.files = files

  // Add an audio element as the actual "play" engine
  this.engine = document.createElement('audio')

  // Audio element events
  var self = this

  this.engine.addEventListener('timeupdate', function () {
    self.emit('progress', self.engine.currentTime)
  })

  this.engine.addEventListener('ended', function () {
    self.skip()
  })
}

// All outside event listeners are set up, we can setup things internally that throw events
PlayerEngine.prototype.start = function () {
  this.setNextTrack()
}

// Set the next track to play
PlayerEngine.prototype.setNextTrack = function () {
  var file = this.files[Math.floor(Math.random() * this.files.length)]
  this.engine.src = file.toURL()

  // Publish new track to the outside world
  var self = this
  this.engine.addEventListener('loadedmetadata', function () {
    self.emit('songState', {
      name: file.name,
      duration: self.engine.duration
    })
  })
}

// Return the URL of the current track when the player is active else return "false"
PlayerEngine.prototype.playing = function () {
  return this.engine.paused === true ? false : this.engine.currentSrc
}

// Toggles the state of the player to playing/pause corresponding to the current state
PlayerEngine.prototype.toggle = function () {
  this.engine.paused === true ? this.play() : this.pause()
}

// Start the audio playback
PlayerEngine.prototype.play = function () {
  this.engine.play()
  this.emit('playingState', true)
}

// Stop the audio playback, an resets to the beginning of the track
PlayerEngine.prototype.stop = function () {
  this.pause()
  this.engine.currentTime = 0
}

// Pauses the audio playback, can be resumed from the current state
PlayerEngine.prototype.pause = function () {
  this.engine.pause()
  this.emit('playingState', false)
}

// Skips the current song
PlayerEngine.prototype.skip = function () {
  this.setNextTrack()
  this.play()
}

// Sets volume to the given volume, if volume is empty act as get function
PlayerEngine.prototype.volume = function (volume) {
  if (volume) {
    this.engine.volume = volume
  }
  return this.engine.volume
}

// Sets the playback position
PlayerEngine.prototype.seek = function (time) {
  this.engine.currentTime = time
}
