<template lang="html">
  <div class="container">
    <div class="row">

      <div class="user col-lg-4">
        <p>First Name: {{ user.first_name }}</p>
        <p>Last Name: {{ user.last_name }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>email: {{ user.email }}</p>
        <span>Gender: {{ user.gender }}</span>
        <p>City: {{ user.user_city }}</p>
        <p style="white-space: pre">Bio: {{ user.user_bio }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>Youtube Link: {{ user.youtube_link }} </p>
        <label for="checkbox">Available to join? {{ user.isAvailable }}</label>
        <br>
        <label for="checkbox">Looking for band to join? {{ user.looking_for }}</label>

        <button v-if="(this.$route.params.id) === ls " @click="show = !show">Edit</button>
      </div>

      <div class="col-lg-4">
        <form id="registration" v-on:submit.prevent="submit">
          <transition name="slide-fade">
            <div v-if="show" class="registration form-group">
              <label for="first_name">First Name</label>
              <input v-model="user.first_name" placeholder="first name">
              <br>
              <label for="last_name">Last Name</label>
              <input v-model="user.last_name" placeholder="last name">
              <br>
              <label for="email">email</label>
              <input v-model="user.email" placeholder="email">
              <br>
              <label for="male">male</label>
              <input type="radio" id="male" value="male" v-model="user.gender">
              <br>
              <label for="female">female</label>
              <input type="radio" id="female" value="female" v-model="user.gender">
              <br>
              <label for="user_city">City</label>
              <input v-model="user.user_city" placeholder="city">
              <br>
              <label for="user_country">Country</label>
              <input v-model="user.user_country" placeholder="country">
              <br>
              <span>Bio</span>
              <br>
              <textarea v-model="user.user_bio" placeholder="Add your bio"></textarea>
              <br>
              <label for="user_influence">Influence</label>
              <input v-model="user.user_influence" placeholder="influence">
              <br>
              <label for="youtube_link">Youtube Link</label>
              <input v-model="user.youtube_link" placeholder="youtube link">
              <br>
              <input type="checkbox" id="isAvailable" v-model="user.isAvailable">Available to join band?</input>
              <br>
              <input type="checkbox" id="looking_for" v-model="user.looking_for">Looking for band to join?</input>
              <br>
            </div>
          </transition>
          <div class="col-lg-4">
            <h1>{{ user.first_name }} {{ user.last_name }}</h1>
            <image-component></image-component>
          </div>
          <div class="col-lg-2">
            <audio-component></audio-component>
          </div>
          <button form="registration" name="registration" type="submit">Save</button>
        </form>
      </div>

      <div class="col-lg-2">
        <skills-component></skills-component>
      </div>


      <div class="container">
        <section>
          <youtube
            :video-id="videoId"
            player-width="50%"
            player-height="350"
            @ready="ready">
          </youtube>
        </section>

        <div class="container">
          <form v-on:submit.prevent="postmessage">
            <div v-show="error" class="alert alert-danger" role="alert">
              <strong>Oh snap!</strong> {{ error }}
            </div>
            <h3>Write them a message...</h3>
            <div class="form-group">
              <input type="text" class="form-control" v-model="messages.content" id="text">
            </div>
            <button type="postmessage" class="btn btn-primary">Send the message</button>
          </form>
        </div>
        <!-- <drag-drop></drag-drop> -->
        <div class="container" v-for="message in messages">
          <p><a :href="'/users/' + message.author_id ">{{ message.first_name }} {{ message.last_name }}</a></p>
          <p>{{ message.content }}</p>
          <p>{{ moment(message.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import auth from '../../auth.js';
import imageComponent from './DragDrop.vue';
import audioComponent from './AudioDrop.vue';
import skillsComponent from './Skills.vue';


export default {
  data () {
    return {
      show: true,
      error: null,
      user: auth.user,
      error: null,
      ls: localStorage.user_id,
      messages: {
        author_id: '',
        content: '',
        first_name: '',
        last_name: '',
        created_at: ''
      },
      user: {
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        user_city: '',
        user_country: '',
        user_bio: '',
        user_influence: '',
        youtube_link: '',
        isAvailable: false,
        looking_for: false,
      },
      url: '',
      videoId: '',
      skillOptions: [],
      skills: [{
        skill_id: 0,
        skill_name: '',
        skill_rating: 0,
        skill_comment: '',
        user_id: 0
      }],

      image: '',
      imageSrc: 'http://localhost:3000/uploads/image-'+ this.$route.params.id +'.jpeg'
    };
  },

  created () {
    // console.log('this.$route.params.id: ', this.$route.params.id)
    // console.log('localStorage.user_id: ', localStorage.user_id)
    this.$http.get('users/' + this.$route.params.id).then(response => {
      this.user = response.data[0];
      this.url = this.user.youtube_link;
      let sliceit = this.user.youtube_link.indexOf('=');
      this.videoId = this.user.youtube_link.slice(sliceit + 1, 100);
    })
    this.$http.get('users/' + this.$route.params.id + '/message' ).then(response => {
       this.messages = response.data;
     })
  },
  computed: {
  },
  methods: {
    submit() {
      this.$http.post('users/' + this.$route.params.id, {
        user: this.user
      })
      .then(function (response) {
        if (response.status === 200){
            this.user = response.body;
            location.reload(true);
          }
        })
      .catch(function (error) {
        this.error = error;
      })
      // this.$http.post('users/' + this.$route.params.id, this.user)
      //   .then(response => {
      //   this.user = response.body;
      // });
    },
    // Youtube Vieo starts here

    postmessage(){
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http.post('users/' + this.$route.params.id + '/message', {
          author_id: localStorage.user_id,
          content: this.messages.content
        })
        .then(function (response) {
          if (response.status === 200){
              location.reload(true);
          }
        })
        .catch(function (error) {
          this.error = error;
          });
        }
      },

      moment(date){
        return moment(date).fromNow();
      },

  //   edit() {
  //     this.$http.put('users/' + this.note.id, {
  //       title: this.note.title,
  //       text: this.note.text,
  //     })
  //     .then(function (response) {
  //       if (response.status == 200) {
  //          location.reload(true);
  //       }
  //     })
  //     .catch(function (error) {
  //       this.error = error;
  //     });
  //   }
    method (url) {
      this.videoId = this.$youtube.getIdFromURL(url)
      this.startTime = this.$youtube.getTimeFromURL(url)
    },
    ready (player) {
      this.player = player
    },
    playing (player) {
      // The player is playing a video.
    },
    stop () {
      this.player.stopVideo()
    },
    pause () {
      this.player.pauseVideo()
    },

  },
  components: {
    imageComponent,
    audioComponent,
    skillsComponent
  }
};

</script>

<style lang="css">

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .form-row {
    border:  1px solid #e2e2e2;
    margin:  2px;
    padding: 5px;
    background: #f2f2f2;
  }

</style>
