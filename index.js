var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = PlayerEngine
inherits(PlayerEngine, EventEmitter)

function PlayerEngine () {
  if (!(this instanceof PlayerEngine)) {
    return new PlayerEngine()
  }

  // Save the files into an internal handling
  this.files = []

  // Handle the internal history
  this.maximum_history = 100
  this.current_track = false
  this.history_pointer = false
  this.history = []

  // Add an audio element as the actual "play" engine
  this.engine = document.createElement('audio')

  // Audio element events
  var self = this

  this.engine.addEventListener('timeupdate', function () {
    self.emit('progress', self.engine.currentTime)
  })

  this.engine.addEventListener('ended', function () {
    self.next()
  })
}

// Overwrite the files with fresh one's
PlayerEngine.prototype.setFiles = function (files) {
  this.files = files
  if (files.length === 0) {
    this.stop()
    this.current_track = false
  }
  if (files.length > 0 && this.current_track === false) {
    this.setNextTrack()
  }
}

// Set the next track to play
PlayerEngine.prototype.setNextTrack = function () {
  var file = this.files[Math.floor(Math.random() * this.files.length)]
  this.setEngineTrack(file)
  this.addHistoryTrack()
}

PlayerEngine.prototype.addHistoryTrack = function () {
  // Push the current track to history
  if (this.current_track) {
    this.history.push(this.current_track)
    this.history_pointer = this.history_pointer === false ? 0 : this.history_pointer + 1
  }

  // Make sure we only save a maximum amount in history
  this.history = this.history.slice(Math.max(this.history.length - this.maximum_history, 0))
  this.history_pointer = this.history_pointer > this.maximum_history - 1 ? this.maximum_history - 1 : this.history_pointer

  // Tell the outside world we can now go back
  if (this.history_pointer > 0) {
    this.emit('backState', true)
  }
}

PlayerEngine.prototype.setEngineTrack = function (file) {
  this.current_track = file
  this.engine.src = file.toURL()

  // Publish new track to the outside world
  var self = this
  this.engine.addEventListener('loadedmetadata', function () {
    self.emit('songState', {
      name: file.name,
      duration: self.engine.duration,
      index: self.files.indexOf(file)
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

// Set the track from outside by index of the internal files
PlayerEngine.prototype.setTrack = function (index) {
  this.setEngineTrack(this.files[index])
  this.addHistoryTrack()
  this.play()
}

// Set the track from outside by index of the internal files
PlayerEngine.prototype.removeTrack = function (index) {
  this.files.splice(index, 1)
}

// Get the internal file list
PlayerEngine.prototype.getTracks = function () {
  return this.files
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

// Plays the last song
PlayerEngine.prototype.back = function () {
  // We are on the last time we can go back
  if (this.history_pointer <= 1) {
    this.emit('backState', false)
  }

  // Bad call
  if (this.history_pointer === 0) {
    console.error('Nothing in the history anymore')
    return
  }

  // Play the last track in history
  this.history_pointer--
  this.setEngineTrack(this.history[this.history_pointer])
  this.play()
}

// Skips the current song
PlayerEngine.prototype.next = function () {
  if (this.history_pointer === false || this.history_pointer === this.history.length - 1) {
    // We have no track in the history anymore, new one!
    this.setNextTrack()
  } else {
    // Grab the next track out of the history
    this.history_pointer++
    this.setEngineTrack(this.history[this.history_pointer])
    this.emit('backState', true)
  }

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
