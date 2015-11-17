var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = PlayerEngine
inherits(PlayerEngine, EventEmitter)

function PlayerEngine (files, opts) {
  if (!(this instanceof PlayerEngine)) return new PlayerEngine(files, opts)
  //needs to be added to the UI
  this.engine = document.createElement("AUDIO");
  this.files = files;
  // example of emitting an event with an object as payload (payload optional)
  //this.emit('eventName', { my: 'payload' })
  this.on('progress', progressHandler);
  this.on('change', changeHandler);
  this.engine.addEventListener('timeupdate',function(){this.emit('progress')}); //event: this.engine.timeupdate
  this.engine.addEventListener('ended',function(){this.emit('changeHandler')}); //event: this.engine.ended
}

//Set a random track as source
function getRandomTrack(){
    var src = document.createElement("SOURCE");
    var file = this.files[Math.floor(Math.random()*items.length)];
    src.setAttribute('src', file.toURL());
    src.setAttribute('type', 'audio/mp3');
    this.engine.appendChild(src);
}

//Removes the current source
function PlayerEngine.prototype.clear(){
  while (this.engine.firstChild) {
    this.engine.removeChild(this.engine.firstChild);
  }
}

//Return the URL of the current track when the player is active else it returns null
function PlayerEngine.prototype.playing(){
  if(this.engine.paused===true) return null;
  return this.engine.currtSrc;
}

//Toggles the state of the player to playing/pause corresponding to the current state
function PlayerEngine.prototype.toggle(){
  if(this.engine.paused===true){
    if(this.engine.childNodes===''){getRandomTrack();}
    this.engine.play();
    return;
  }
  this.engine.pause();
}

//Start the audio playback
function PlayerEngine.prototype.play(){
  if(this.engine.childNodes===''){getRandomTrack();}
  this.engine.play();
}

//Stop the audio playback, resets the PlayerEngine to the beginnig of the track
function PlayerEngine.prototype.stop(){
  this.engine.pause();
  this.engine.currentTime = 0;
}

//Pauses the audio playback, can be resumed from the current state
function PlayerEngine.prototype.pause(){
  this.engine.pause();
}

//Skips the current song
function PlayerEngine.prototype.skip(){
  //Four steps: 1. Pause, 2. Clear the Player 3. Set new Track 4. Play
  this.engine.pause();
  while (this.engine.firstChild) {
    this.engine.removeChild(this.engine.firstChild);
  }
  if(this.engine.childNodes===''){getRandomTrack();}
  this.engine.play();
  this.emit('change');
}

//Sets volume to the given volume, if volume is empty act as get function
function PlayerEngine.prototype.volume(volume){
  if(volume==='undefined'||volume==='null') return this.engine.volume;
  this.engine.volume = volume;
}

//Sets the playback position
function PlayerEngine.prototype.seek(time){
  this.engine.currentTime = time;
}
