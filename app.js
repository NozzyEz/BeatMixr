class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll('.pad');
    this.playBtn = document.querySelector('.play-btn');
    this.kickAudio = document.querySelector('.kick-sound');
    this.snareAudio = document.querySelector('.snare-sound');
    this.hihatAudio = document.querySelector('.hihat-sound');
    this.selectors = document.querySelectorAll('select');
    this.muteBtns = document.querySelectorAll('.mute');
    this.tempoSlider = document.querySelector('.tempo-slider');
    this.tempo = document.querySelector('.bpm-number');

    this.currentKick = 'audio/kick-classic.wav';
    this.currentSnare = 'audio/snare-acoustic01.wav';
    this.currentHihat = 'audio/hihat-acoustic01.wav';
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
  }

  // Method to toggle active class on the pad being clicked on
  activePad() {
    this.classList.toggle('active');
  }

  // The repeat method will increase and loop over the steps for the sequencer
  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);
    // console.log(activeBars);
    // console.log(`step: ${step} \nindex: ${this.index}`);
    // for each step we animate the current column of pads
    activeBars.forEach(bar => {
      bar.style.animation = `playTrack 0.4s alternate ease-in-out 2`;
      // as we run over them we first check if they are active
      if (bar.classList.contains('active')) {
        // and if they are we check which track they are in and play the corresponding sound
        if (bar.classList.contains('kick-pad')) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }
        if (bar.classList.contains('snare-pad')) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (bar.classList.contains('hihat-pad')) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }

  // Once we start the sequencer, we call a setInterval function to repeatedly call the repeat
  // method according to the BPM chosen
  start() {
    // setting an interval in miliseconds depending on the BPM
    const interval = (60 / this.bpm) * 1000;
    // Check if a sequence is already playing
    if (this.isPlaying) {
      // if that's the case, kill it and reset the isPlaying and index variables
      clearInterval(this.isPlaying);
      this.isPlaying = null;
      this.index = 0;
    } else {
      // Otherwise initiate a new sequence
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    }
  }

  updatePlayBtn() {
    if (this.isPlaying) {
      this.playBtn.innerText = 'Stop';
      this.playBtn.classList.add('active');
    } else {
      this.playBtn.innerText = 'Play';
      this.playBtn.classList.remove('active');
    }
  }
  // When a select element has been changed it will fire off here and we monitor the event, and
  // update the correct track with the new audio file
  changeTrack(e) {
    const selectedtrack = e.target.name;
    const selected = e.target.value;

    switch (selectedtrack) {
      case 'kick-select':
        this.kickAudio.src = selected;
        break;
      case 'snare-select':
        this.snareAudio.src = selected;
        break;
      case 'hihate-select':
        this.hihatAudio.src = selected;
        break;
    }
  }

  muteTrack(e) {
    // console.log(e.target.getAttribute('data-track'));
    // fetch the data track attribute which identifies which mute button has clicked
    const track = e.target.getAttribute('data-track');
    // fetch the classlist as well
    const muteToggle = e.target.classList;
    // toggle the button
    muteToggle.toggle('active');
    // Check if we switched it on, and mute the corresponding track, unmute if we switched it off
    if (muteToggle.contains('active')) {
      switch (track) {
        case '0':
          this.kickAudio.volume = 0;
          break;
        case '1':
          this.snareAudio.volume = 0;
          break;
        case '2':
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (track) {
        case '0':
          this.kickAudio.volume = 1;
          break;
        case '1':
          this.snareAudio.volume = 1;
          break;
        case '2':
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }
  // Method to be called when the tempo slider has been changed
  changeBpm(e) {
    // We get the selected bpm, then we assign that to the bpm value, clear the interval, and if
    // the sequencer was playing at the time, continue with the new tempo
    const tempoSelection = e.target.value;
    console.log(tempoSelection);
    this.bpm = tempoSelection;
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    if (this.playBtn.classList.contains('active')) {
      this.start();
    }
  }
}

// Initialization and start
const drumKit = new DrumKit();

// Event listeners

drumKit.playBtn.addEventListener('click', () => {
  drumKit.start();
  drumKit.updatePlayBtn();
});

drumKit.tempoSlider.addEventListener('input', e => {
  drumKit.tempo.innerText = e.target.value;
});
drumKit.tempoSlider.addEventListener('change', e => {
  drumKit.changeBpm(e);
});

drumKit.pads.forEach(pad => {
  pad.addEventListener('click', drumKit.activePad);
  // Once the animation has played for the activeBars we want to remove it, so we can add it again on
  // the next step where the pad is active, take note we cannot use an arrow function here as the this
  // keyword will point to the window instead of the pad
  pad.addEventListener('animationend', function () {
    this.style.animation = '';
  });
});

// For each selector, add a change event listener and pass the event so we can change the option
// and play a different sound in the track
drumKit.selectors.forEach(selector => {
  selector.addEventListener('change', e => {
    drumKit.changeTrack(e);
  });
});

drumKit.muteBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    drumKit.muteTrack(e);
  });
});
