<template lang="html">
  <div class="container">
    <div class="row">
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
              <label for="soundcloud_link">Soundcloud Link</label>
              <input v-model="user.soundcloud_link" placeholder="soundcloud link">
              <br>
              <input type="checkbox" id="isAvailable" v-model="user.isAvailable">Available to join band?</input>
              <br>
              <input type="checkbox" id="looking_for" v-model="user.looking_for">Looking for band to join?</input>
              <br>
              <button form="registration" name="registration" type="submit">Save</button>
            </div>
          </transition>
        </form>
      </div>

      <div class="user col-lg-4">
        <p>First Name: {{ user.first_name }}</p>
        <p>Last Name: {{ user.last_name }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>email: {{ user.email }}</p>
        <span>Gender: {{ user.gender }}</span>
        <p>City: {{ user.user_city }}</p>
        <p style="white-space: pre">Bio: {{ user.user_bio }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>Soundcloud Link: {{ user.soundcloud_link }} </p>
        <label for="checkbox">Available to join? {{ user.isAvailable }}</label>
        <br>
        <label for="checkbox">Looking for band to join? {{ user.looking_for }}</label>
        <button @click="show = !show">Edit</button>
      </div>


      <div id="edit_skills" class="container">
        <div class="col-xs-12">
          <div class="row  form-row" v-for="skill in skills">
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-12">
                  <div class="col-xs-2">
                    <select name="" id="" class="form-control" v-model="skill.skill_id" :value="skill.skill_name">
                      <option :value="skill.id" v-model="skill.skill_name" v-for="skillOption in skillOptions">{{ skillOption.label }}</option>
                    </select>
                  </div>
                  <div class="col-xs-2">
                    <input type="text" class="form-control" placeholder="Rating" v-model="skill.skill_rating">
                  </div>
                  <div class="col-xs-3">
                    <input type="text" class="form-control" placeholder="Comment" v-model="skill.skill_comment">
                  </div>
                  <div class="col-xs-1">
                    <button class="btn btn-danger" @click="deleteSkill(skill)">X</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <button type="Submit" v-on:click="edit_skills" class="btn btn-info">Submit</button>
              <button type="submit" class="btn btn-success" @click="addSkill">Add Skill</button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <section>
          <youtube
            :video-id="videoId"
            player-width="50%"
            player-height="350"
            :player-vars="{autoplay: 1}"
            @ready="ready"
            @playing="playing">
          </youtube>
        </section>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {

    return {
      show: true,
      error: null,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        user_city: '',
        user_country: '',
        user_bio: '',
        user_influence: '',
        soundcloud_link: '',
        isAvailable: false,
        looking_for: false,
      },
      url: '',
      videoId: '',
      skillOptions: [],
      skills: []
    };
  },

  created () {
    // console.log('this.$route.params.id: ', this.$route.params.id)
    // console.log('localStorage.user_id: ', localStorage.user_id)
    this.$http.get('users/' + this.$route.params.id).then(response => {
      this.user = response.data[0];
      this.url = this.user.soundcloud_link;
      let sliceit = this.user.soundcloud_link.indexOf('=');
      this.videoId = this.user.soundcloud_link.slice(sliceit + 1, 100);
    })
///userskills/:user_id'
    this.$http.get('userskills/' + this.$route.params.id).then(response => {
      let skillset = response.body;
      skillset.forEach((skill) => {
        this.skills.push(skill)
      })
      console.log('response skills', this.skills);
    })

    this.$http.get('skills/').then(response => {
      response.body.forEach((skill) => {
        let skillset = {
          label: skill.skill_name,
          value: skill.id
        }
        this.skillOptions.push(skillset);
      })
      console.log(this.skillOptions);
    })

  },
  computed: {


  },
  methods: {


    submit(){
      this.$http.post('users/' + this.$route.params.id, this.user)
        .then(response => {
        this.user = response.body;
      });
    },
    addSkill: function() {
      this.skills.push({
        'skill_id': 1,
        'user_id': localStorage.user_id,
        'skill_name': '',
        'skill_rating': 1,
        'skill_comment': ''
      });
    },
    deleteSkill: function(skill) {
      this.skills.$remove(skill);
    },
    edit_skills(){
      console.log(this.skills);
      this.$http.post('userskills/' + this.$route.params.id, this.skills)
        .then(response => {
        console.log('edit_skills method: ',response.body);
        this.skills = response.body;
      });
    },
    // Youtube Vieo starts here
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
    }
    // launchVideo() {
    //   this.videoLaunched = true;
    //   this.player.playVideo();
    //   document.getElementsByTagName('body')[0].classList.add('overlay');
    // },
    // ready: function(player) {
    //   fitvids();
    //   this.player = player;
    //   this.videoLoaded = true;
    // },
    // ended() {
    //   console.log('Ended');
    // }
  },

  components: {}

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
