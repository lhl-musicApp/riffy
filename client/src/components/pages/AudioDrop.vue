<template lang="html">
  <div>
    <div>
      <h1>Audio Upload</h1>
      <div v-if="!audio">
        <h2>Select audio file to up load</h2>
        <input type="file" @change="onFileAudio">
      </div>
    <div v-else>
      <!-- <img :src="image" /> -->
      <button @click="removeAudio">Remove Audio</button>
          <label for="trackame">First Name</label>
          <input v-model="trackname" placeholder="first name">
              <br>
      <p>trackame is: {{ trackname }}</p>
      <button @click="saveAudio">Save Audio</button>
    </div>
    <button @click="playSound">loadsong</button>
  </div>

</template>

<script>
const context = new AudioContext();
var source = null;
import auth from '../../auth.js'
export default {
  data () {
    return {
      audio : '',
      trackname : ''
    };
  },
  // created () {
  //   // window.AudioContext = window.AudioContext||window.webkitAudioContext;
  //   // this.context = new AudioContext();
  //   // this.source = context.createBufferSource();
  //   if(!window.context) {
  //     window.context = new AudioContext()
  //   };
  // },
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
        audio : this.audio,
        trackname : this.trackname
      }
      // console.log('reader', this.image)
      this.$http.post('upload/audio', { audioObj })
        .then(response => {
          console.log('saveAudi =>', response)
        });
    },
    loadSound() {
      if(this.buffer) {
        console.log('Resolving with buffer');
        return Promise.resolve(this.buffer);
      } else {
        console.log('Fetching')
        return fetch('//localhost:3000/uploads/audio-'+ this.$route.params.id +'.mp3')
          .then(data => data.arrayBuffer())
          .then(raw => context.decodeAudioData(raw))
          .then(buffer => {
            this.buffer = buffer;
            return buffer;
          });
        // return new Promise((resolve, reject) => {
        //   console.log('from audio this.$route.params.id:', this.$route.params.id)
        //   const request = new XMLHttpRequest();
        //   request.open('GET', '//localhost:3000/uploads/audio-12.mp3', true);
        //   request.responseType = "arraybuffer";

        //   request.onload = () => {
        //     var Data = request.response;

        //     context.decodeAudioData(Data, (buffer) => {
        //       this.buffer = buffer;
        //       resolve(buffer);
        //     });
        //   };
        //   request.onerror = (err) => reject(err);
        //   request.send();
        // });
      }

      // ES7
      // async loadSound() {
      //   if(!this.buffer) {
      //     const data = await fetch('//url');
      //     const raw = await data.arrayBuffer();
      //     const buffer = await context.decodeAudioData(raw);
      //     this.buffer = buffer;
      //   }
      //   return this.buffer;
      // }


    },
    playSound() {
      this.loadSound().then(buffer => {
        if(source) {
          source.stop(context.currenTime);
          source.disconnect();
        }
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(context.currentTime);
        source.stop(context.currentTime + 10);
      });
    },
  },
  components: {}
}
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
