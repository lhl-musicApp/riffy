<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <form id="registration" v-on:submit.prevent="submit">
          <div class="registration form-group">
            <label for="band_name">Band Name</label>
            <input v-model="band.band_name" placeholder="Band Name">
            <br>
            <label for="band_bio">Band Bio</label>
            <input v-model="band.band_bio" placeholder="Band Bio">
            <br>
            <label for="band_influence">Influence</label>
            <input v-model="band.band_influence" placeholder="Influenced by">
            <br>
            <label for="soundcloud_link">Page Link</label>
            <input v-model="band.soundcloud_link" placeholder="Link to Youtube">
            <br>
            <label for="is_new_band">creating new band?</label>
            <input v-model="band.is_new_band" placeholder="y / n">
            <br>
            <label for="has_open_position">has open position?</label>
            <input v-model="band.has_open_position" placeholder="y / n">
            <br>
            <label for="looking_for">what positions are you looking for?</label>
            <input v-model="band.looking_for" placeholder="positions">
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
      band: {
        band_name: '',
        band_bio: '',
        band_influence: '',
        soundcloud_link: '',
        is_new_band: true,
        has_open_position: false,
        looking_for: ''
      }
      // ,
      // band_user: {
      //   user_id: localStorage.user_id,
      //   isBandAdmin: true
      // }
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
      this.$http.post('bands/new', this.band)
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
