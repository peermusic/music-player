# player-engine

A simple wrapper around the HTML 5 audio element.

## Install

```sh
npm install https://github.com/peermusic/player-engine
```

For reference see the [Browserify Handbook](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
var engine = require('player-engine')

// Load a track to play into the engine
engine.load(url)

// Start the audio playback
engine.play()

// Stop the audio playback, an resets to the beginning of the track
engine.stop()

// Pauses the audio playback, can be resumed from the current state
engine.pause()

// Return the URL of the current track when the player is active else return "false"
engine.playing()

// Toggles the state of the player to playing/pause corresponding to the current state
engine.toggle()

// Sets volume to the given value, if no value is given give back the current volumne
engine.volume(volume)

// Sets the playback position
engine.seek(time)

// Triggers to update the current playback time
engine.on('timeupdate', function (progress) {
    // "progress" is a float with the current time (in seconds)
})

// Triggers when the currently played song ended
engine.on('ended', function () {
    // ...
})
```
