<template lang="html">
  <div>
    <!-- Stations -->
    <h1>Streaming Station</h1>
  <div class="padding"></div>
  <div id="station0" class="station">
    <div class="title">
      <div id="title0" class="subtitle"></div>
      <div id="live0" class="live">LIVE</div>
      <div id="playing0" class="playing">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
  <div id="station1" class="station">
    <div class="title">
      <div id="title1" class="subtitle"></div>
      <div id="live1" class="live">LIVE</div>
      <div id="playing1" class="playing">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
  <div id="station2" class="station">
    <div class="title">
      <div id="title2" class="subtitle"></div>
      <div id="live2" class="live">LIVE</div>
      <div id="playing2" class="playing">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
  <div id="station3" class="station">
    <div class="title">
      <div id="title3" class="subtitle"></div>
      <div id="live3" class="live">LIVE</div>
      <div id="playing3" class="playing">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
  <div id="station4" class="station">
    <div class="title">
      <div id="title4" class="subtitle"></div>
      <div id="live4" class="live">LIVE</div>
      <div id="playing4" class="playing">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
  <div class="padding"></div>
  </div>
</template>

<script>
import auth from '../../auth.js'
// import AudioPlayer from './Radio.vue';
// import vSelect from "vue-select"
export default {
  // components: {vSelect},
  data () {
    return {

      audio: [
        {
          freq: '81.4',
          title: "Groove Salad",
          src: ['http://ice1.somafm.com/groovesalad-128-mp3', 'http://ice1.somafm.com/groovesalad-128-aac'],
          howl: null
        },
        {
          freq: '89.9',
          title: "Secret Agent",
          src: ['http://ice1.somafm.com/secretagent-128-mp3', 'http://ice1.somafm.com/secretagent-128-aac'],
          howl: null
        },
        {
          freq: '98.9',
          title: "Indie Pop",
          src: ['http://ice1.somafm.com/indiepop-128-mp3', 'http://ice1.somafm.com/indiepop-128-aac'],
          howl: null
        },
        {
          freq: '103.3',
          title: "Police Radio",
          src: ['http://ice1.somafm.com/sf1033-128-mp3', 'http://ice2.somafm.com/sf1033-64-aac'],
          howl: null
        },
        {
          freq: '107.7',
          title: "The Trip",
          src: ['http://ice1.somafm.com/thetrip-128-mp3', 'http://ice2.somafm.com/thetrip-64-aac'],
          howl: null
        }
      ]
    };
  },
  created () {
    var Radio = function(stations) {
      var self = this;

      self.stations = stations;
      self.index = 0;

      // Setup the display for each station.
      for (var i=0; i<self.stations.length; i++) {
        $('title' + i).innerHTML = '<b>' + self.stations[i].freq + '</b> ' + self.stations[i].title;
        $('title' + i).on('click', function(index) {
          var isNotPlaying = (self.stations[index].howl && !self.stations[index].howl.playing());

          // Stop other sounds or the current one.
          radio.stop();

          // If the station isn't already playing or it doesn't exist, play it.
          if (isNotPlaying || !self.stations[index].howl) {
            radio.play(index);
          }
        }.bind(self, i));
      }
    };
    Radio.prototype = {
      /**
       * Play a station with a specific index.
       * @param  {Number} index Index in the array of stations.
       */
      play: function(index) {
        var self = this;
        var sound;

        index = typeof index === 'number' ? index : self.index;
        var data = self.stations[index];

        // If we already loaded this track, use the current one.
        // Otherwise, setup and load a new Howl.
        if (data.howl) {
          sound = data.howl;
        } else {
          sound = data.howl = new Howl({
            src: data.src,
            html5: true, // A live stream can only be played through HTML5 Audio.
            format: ['mp3', 'aac']
          });
        }

        // Begin playing the sound.
        sound.play();

        // Toggle the display.
        self.toggleStationDisplay(index, true);

        // Keep track of the index we are currently playing.
        self.index = index;
      },

      // *
      //  * Stop a station's live stream.

      stop: function() {
        var self = this;

        // Get the Howl we want to manipulate.
        var sound = self.stations[self.index].howl;

        // Toggle the display.
        self.toggleStationDisplay(self.index, false);

        // Stop the sound.
        if (sound) {
          sound.stop();
        }
      },

      /**
       * Toggle the display of a station to off/on.
       * @param  {Number} index Index of the station to toggle.
       * @param  {Boolean} state true is on and false is off.
       */
      toggleStationDisplay: function(index, state) {
        var self = this;

        // Highlight/un-highlight the row.
        $('station' + index).style.backgroundColor = state ? 'rgba(255, 255, 255, 0.33)' : '';

        // Show/hide the "live" marker.
        $('live' + index).style.opacity = state ? 1 : 0;

        // Show/hide the "playing" animation.
        $('playing' + index).style.display = state ? 'block' : 'none';
      }
    };

    // Setup our new radio and pass in the stations.
    var radio = new Radio(audio);
  },
  computed: {
 // A computed property that holds only those articles that match the searchString.

  },
  methods: {

  },
  components: {

  }
};
</script>

<style lang="css">

</style>



