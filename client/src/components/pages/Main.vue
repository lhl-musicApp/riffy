<template lang="html">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-3">Vue.js Boilerplate</h1>
        <p class="lead">Vue + Passport + Express + Postgres</p>
      </div>
    </div>
    <div class="container">

  <!--     <h1>Main List</h1>
      <hr>
      <form v-if="user.authenticated" v-on:submit.prevent="submit">
        <div v-show="error" class="alert alert-danger" role="alert">
          <strong>Oh snap!</strong> {{ error }}
        </div>
        <div class="form-group">
          <input v-validate.initial data-rules="required" type="text" class="form-control" name="noteTitle" data-as="Note title" v-model="body.title" id="text" placeholder="Title">
          <span v-show="errors.has('noteTitle')" class="alert-danger">{{ errors.first('noteTitle') }}</span>
        </div>
        <div class="form-group">
          <input v-validate.initial data-rules="required" name="noteText" data-as="Note text" type="text" class="form-control" v-model="body.text" id="text" placeholder="Text">
          <span v-show="errors.has('noteText')" class="alert-danger">{{ errors.first('noteText') }}</span>
        </div>
        <button type="submit" class="btn btn-primary">Create Item</button>
        <hr>
      </form> -->

    <form id="main" v-cloak v-on:submit.prevent="submit">
      <div class="bar">
          <!-- Create a binding between the searchString model and the text field -->
        <input type="text" v-model="searchString" placeholder="Enter your search terms" />
      </div>

      
            <!-- Render a li element for every entry in the computed filteredArticles array. -->
        <!-- <li v-for="article in filteredArticles"> -->
          <div class="container">
            <div class="row" v-for="main in filteredArticles">
              <div class="thumbnail col-sm-6 col-md-4">
              <!-- <audio-player></audio-player> -->

                <div class="caption user-container">
                  <img :src="main.image_link">

                  <h3>{{ main.first_name }} {{ main.last_name }}</h3>
                  <ul>
                    <li><a :href="'users/' + main.id">{{ main.first_name }} {{ main.last_name }}</a></li>
                    <li>{{ main.user_city }}</li>
                    <li>{{ main.user_country }}</li>
                  </ul>
                  <!-- This is the audio component -->
                  <div>
                    <h1>Play Audio</h1>

                      <!-- <img :src="image" /> -->

<!-- <button  v-on:click="playSound('hi')" >hi</button> -->
                    <button id="magic-click" v-on:click="playSound(main.track_link)">Play</button>
                  </div>

                  <!-- <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p> -->
                </div>
              </div>
            </div>
          </div>
        <!-- </li> -->
      </ul>
    </form>
    </div>
  </div>
</template>

<script>
import auth from '../../auth.js'
// import AudioPlayer from './AudioDrop.vue';
const context = new AudioContext();
var source = null;
// import vSelect from "vue-select"
export default {
  // components: {vSelect},
  data () {
    return {
      searchString: "",
      user: auth.user,
      error: null,
      main: [],
      body: {
        title: '',
        text: '',
      },
      audio : '',
      trackname : ''
    };
  },
  created () {
    this.$http.get('main').then(response => {
      this.main = response.data;
    });
  },
  computed: {
 // A computed property that holds only those articles that match the searchString.
    filteredArticles: function () {
// TODO Fix later, this generates duplicate data
      var articles_array = this.main,
      searchString = this.searchString;
      var stringArray = searchString.split(' ');
      console.log('stringArray', stringArray);
      var searchArray = [];

      if(!searchString){
        return articles_array;
      }
      else {
        searchString = searchString.trim().toLowerCase();
        console.log("searchString: ", searchString)

        var loadArray = [];
        articles_array = articles_array.filter(function(item){
          for (var key in item) {
              // console.log('obj[key]', typeof(item[key]));
            if(typeof(item[key]) === typeof('string')){
              if(item[key].toLowerCase().indexOf(stringArray[0]) !== -1){
                console.log('item=>', item)
                return loadArray.push(item);
              }
            }
          }
        })
              // Return an array with the filtered data.
        return loadArray;
      }

    }
  },
  methods: {
    remove (id) {
      this.$http.delete('main/' + id).then(response => {
        if (response.status == 200) {
           location.reload(true);
        }
      })
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http.post('main', {
          title: this.body.title,
          text: this.body.text,
        })
        .then(function (response) {
          if (response.status == 200) {
             location.reload(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
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
    loadSound(track_link) {
      console.log('this.main', track_link)
      //Commented out some buffer conditions for now
      // if(this.buffer) {
      //   console.log('Resolving with buffer');
      //   return Promise.resolve(this.buffer);
      // } else {
        console.log('Fetching', track_link)
        return fetch(track_link)
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
      // }

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
    playSound(track_link) {
      this.loadSound(track_link).then(buffer => {
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
  components: {
    // AudioPlayer
  }
};
</script>

<style lang="css">
  .user-container {
    border: 2px solid orange;
  }
</style>
