var engine = require('../index.js')
var fs = require('file-system')(64 * 1024 * 1024)

var seeking = false

// Initialise the engine with files out of the file system
fs.list(function (items) {
  engine = engine(items)

  // Setup the volume bar
  engine.volume(0.2)
  document.querySelector('#volumeBar').min = 0
  document.querySelector('#volumeBar').max = 1
  document.querySelector('#volumeBar').step = 0.01
  document.querySelector('#volumeBar').value = 0.2

  // Toggle the playing state
  engine.on('playingState', function (playing) {
    document.querySelector('#play').innerHTML = playing ? '<i class="fa fa-pause"></i>' : '<i class="fa fa-play"></i>'
  })

  // Update songs
  engine.on('songState', function (song) {
    document.querySelector('#fileContainer').innerHTML = '<strong>Currently playing:</strong> ' + song.name
    document.querySelector('#currentTime').innerHTML = duration(0)
    document.querySelector('#progressBar').min = 0
    document.querySelector('#progressBar').value = 0
    document.querySelector('#progressBar').max = song.duration
    document.querySelector('#songLength').innerHTML = duration(song.duration)
  })

  // Update progress
  engine.on('progress', function (progress) {
    if (!seeking) {
      document.querySelector('#currentTime').innerHTML = duration(progress)
      document.querySelector('#progressBar').value = Math.floor(progress)
    }
  })

  // Event listeners set up, let's start up!
  engine.start()
})

// Format a second value as minutes:seconds
function duration (seconds) {
  seconds = Math.floor(seconds)
  var minutes = Math.floor(seconds / 60)
  seconds = seconds - minutes * 60
  seconds = seconds < 10 ? '0' + seconds : seconds
  return minutes + ':' + seconds
}

// Add files to the file system
function addFiles (files) {
  fs.add(files, showFiles)
}

// Show all files of the filesystem
function showFiles () {
  fs.list(function (files) {
    var fragment = document.createDocumentFragment()

    for (var i in files) {
      var file = files[i]
      var li = document.createElement('li')
      li.innerHTML = file.name
      fragment.appendChild(li)
    }

    var list = document.querySelector('#list')
    list.innerHTML = ''
    list.appendChild(fragment)
  })
}

// Bind the window events
window.addEventListener('load', function () {
  showFiles()

  // Add files
  document.querySelector('#myfile').onchange = function (e) {
    addFiles(this.files)
  }

  // Play/pause toggle
  document.querySelector('#play').onclick = function () {
    engine.toggle()
  }

  // "Skip" button
  document.querySelector('#next').onclick = function () {
    engine.skip()
  }

  // Progress bar sliding updates the time
  document.querySelector('#progressBar').oninput = function () {
    document.querySelector('#currentTime').innerHTML = duration(document.querySelector('#progressBar').value)
  }

  // Stop updating the progress bar while seeking
  document.querySelector('#progressBar').onmousedown = function () {
    seeking = true
  }

  // Done with seeking, skip to that position in the song
  document.querySelector('#progressBar').onmouseup = function () {
    engine.seek(document.querySelector('#progressBar').value)
    seeking = false
  }

  // Change the volume
  document.querySelector('#volumeBar').oninput = function () {
    engine.volume(document.querySelector('#volumeBar').value)
  }
})
