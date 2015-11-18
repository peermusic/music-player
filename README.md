# player-engine

A simple music player engine.

## Install

```sh
npm install https://github.com/peermusic/player-engine
```

```js
var engine = require('player-engine')
```

For reference see the [Browserify Handbook](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Demo

```sh
npm install -g wzrd
cd example
wzrd index.js:bundle.js
```

**Note:** If no local webserver (eg. wzrd) is used Chrome has to be started with the `--allow-file-access-from-files` flag.

## Usage

```js
// Triggers when the "playing" state changes
engine.on('playingState', function (playing) {
    // "playing" is true/false
})

// Triggers when the possibility of going "back" changes
engine.on('backState', function (back_possible) {
    // "back_possible" is true/false
})

// Triggers when the song changes
engine.on('songState', function (song) {
    // "song" is an object with "name" and "duration"
})

// Triggers during playing the track
engine.on('progress', function (progress) {
    // "progress" is a float with the current time (in seconds)
})

// Call this when you added event listeners to all events
engine.start()

// Return the URL of the current track when the player is active else return "false"
engine.playing()

// Toggles the state of the player to playing/pause corresponding to the current state
engine.toggle()

// Start the audio playback
engine.play()

// Stop the audio playback, an resets to the beginning of the track
engine.stop()

// Pauses the audio playback, can be resumed from the current state
engine.pause()

// Goes back to the last song
engine.back()

// Skips the current song
engine.next()

// Sets volume to the given volume, if volume is empty act as get function
engine.volume(volume)

// Sets the playback position
engine.seek(time)
```
