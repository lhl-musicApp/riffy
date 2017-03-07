<template lang="html">
  <div>
    <h1>Play Audio</h1>
    <div v-if="!audio">
      <h6>Select audio file to up load</h6>
      <input type="file" @change="onFileAudio">
    </div>
    <div v-else>
      <!-- <img :src="image" /> -->
      <button @click="removeAudio">Remove Audio</button>
      <button @click="saveAudio">Save Audio</button>
    </div>
    <button @click="loadSound">loadsong</button>
  </div>
</div>
</template>
<script>
import auth from '../../auth.js'
export default {
  data () {
    return {
      audio : ''

    };
  },
  created () {

  },
  computed: {

  },
  methods: {

    onFileAudio(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createAudio(files[0]);
    },
    createAudio(audioFile) {
      var reader = new FileReader();
      var vm = this;
      reader.onload = function(event) {

        vm.audio = event.target.result.split(',');
         var decodedImageData = btoa(vm.audio[1]);
        return decodedImageData
      };
      reader.readAsDataURL(audioFile);
      console.log(reader);
    },
    removeAudio: function (e) {
      this.audio = '';
    },
    saveAudio: function (e) {
      const audioObj = {
        audio : this.audio
      }
      // console.log('reader', this.image)
      this.$http.post('upload/audio', { audioObj
      })
        .then(response => {
        console.log('saveAudi =>', response)
      });
    },
    loadSound: function () {
      console.log('from audio this.$route.params.id:', this.$route.params.id)
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      const context = new AudioContext();
      const request = new XMLHttpRequest();
      request.open('GET', 'http://localhost:3000/uploads/audio-' + this.$route.params.id +'.mp3', true);
      request.responseType = "arraybuffer";

      request.onload = function() {
      var Data = request.response;
      process(Data);
      const source = context.createBufferSource();
      function process(Data) {
        // const source = context.createBufferSource(); // Create Sound Source
        context.decodeAudioData(Data, function(buffer){
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(context.currentTime);
          source.stop(context.currentTime + 10);
        })
      }
    }
  request.send();
 }
  },
  components: {}
};
</script>

<style lang="css">
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
button {}
</style>
