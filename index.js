var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = PlayerEngine
inherits(PlayerEngine, EventEmitter)

function PlayerEngine () {
  if (!(this instanceof PlayerEngine)) {
    return new PlayerEngine()
  }

  // Add an audio element as the actual engine
  this.audio = document.createElement('audio')

  // Emit audio element events from this class
  var self = this

  this.audio.addEventListener('timeupdate', function () {
    self.emit('timeupdate', self.audio.currentTime)
  })

  this.audio.addEventListener('ended', function () {
    self.emit('ended')
  })
}

// Load a track to play into the engine
PlayerEngine.prototype.load = function (url) {
  this.audio.src = url
}

// Start the audio playback
PlayerEngine.prototype.play = function () {
  this.audio.play()
}

// Stop the audio playback, an resets to the beginning of the track
PlayerEngine.prototype.stop = function () {
  this.pause()
  this.audio.currentTime = 0
}

// Pauses the audio playback, can be resumed from the current state
PlayerEngine.prototype.pause = function () {
  this.audio.pause()
}

// Return the URL of the current track when the player is active else return "false"
PlayerEngine.prototype.playing = function () {
  return this.audio.paused === true ? false : this.audio.currentSrc
}

// Toggles the state of the player to playing/pause corresponding to the current state
PlayerEngine.prototype.toggle = function () {
  this.audio.paused === true ? this.play() : this.pause()
}

// Sets volume to the given value, if no value is given give back the current volumne
PlayerEngine.prototype.volume = function (volume) {
  if (volume !== undefined) {
    this.audio.volume = volume
  }
  return this.audio.volume
}

// Sets the playback position
PlayerEngine.prototype.seek = function (time) {
  this.audio.currentTime = time
}
