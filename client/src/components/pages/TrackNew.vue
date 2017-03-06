<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <form id="registration" v-on:submit.prevent="submit">
          <div class="registration form-group">
            <label for="track_name">Track Name</label>
            <input v-model="track.track_name" placeholder="Track Name">
            <br>
            <label for="isCreator">is it created by you?</label>
            <input v-model="track.isCreator" placeholder="you created this track?">
            <br>
            <label for="original_artist">Original Artist</label>
            <input v-model="track.original_artist" placeholder="who is the original creator of this track?">
            <br>
            <label for="soundcloud_link">Link</label>
            <input v-model="track.soundcloud_link" placeholder="link to your music">
            <br>
            <label for="isPublished">Publish to public?</label>
            <input v-model="track.isPublished" placeholder="publish?">
            <br>
            <button form="registration" name="registration" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      error: null,
      track: {
        track_name: '',
        isCreator: '',
        original_artist: '',
        soundcloud_link: '',
        isPublished: 'No'
      }
    };
  },

  created () {
    // console.log('this.$route.params.id: ', this.$route.params.id)
    // console.log('localStorage.user_id: ', localStorage.user_id)
    // this.$http.get('users/' + this.$route.params.id).then(response => {
    //   this.user = response.data[0];
    // })
  },
  computed: {

  },
  methods: {
    submit(){
      this.$http.post('tracks/new', this.track)
        .then(response => {
          console.log(response);
          const newBandId = response.body.band_id
        // this.user = response.body;
          console.log('this $route: ', this.$route);
          console.log('this $router: ', this.$router);
          this.$router.push('/');
      });
    }
  },
  components: {}
};

</script>

<style lang="css">
</style>
