var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = PlayerEngine
inherits(PlayerEngine, EventEmitter)

function PlayerEngine (opts) {
  if (!(this instanceof MusicPlayerEngine)) return new MusicPlayerEngine(opts)
  
  // example of emitting an event with an object as payload (payload optional)
  this.emit('eventName', { my: 'payload' })
}
