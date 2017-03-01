<template lang="html">
  <div class="container">
    <h1>Welcome to Search</h1>
      <form v-on:submit.prevent="submit">
        <div class="container">
          <input type="checkbox" id="anywhere" value="Anywhere" v-model="checkedRegions">
          <label for="anywhere">Anywhere</label>
          <input type="checkbox" id="vancouver" value="Vancouver" v-model="checkedRegions">
          <label for="vancouver">Vancouver</label>
          <input type="checkbox" id="seattle" value="Seattle" v-model="checkedRegions">
          <label for="seattle">Seattle</label>
          <br>
          <span>Selected Region: {{ checkedRegions }}</span>
        </div>
        <div class="container">
          <input type="checkbox" id="all" value="All" v-model="checkedInstruments">
          <label for="all">All</label>
          <input type="checkbox" id="guitar" value="Guitar" v-model="checkedInstruments">
          <label for="guitar">Guitar</label>
          <input type="checkbox" id="vocals" value="Vocals" v-model="checkedInstruments">
          <label for="vocals">Vocals</label>
          <br>
          <span>Selected Instruments: {{ checkedInstruments }}</span>
        </div>
        <div class="container">
          <input type="checkbox" id="all" value="All" v-model="checkedGenres">
          <label for="all">All</label>
          <input type="checkbox" id="rock" value="Rock" v-model="checkedGenres">
          <label for="rock">Rock</label>
          <input type="checkbox" id="hip-hop" value="Hip-Hop" v-model="checkedGenres">
          <label for="hip-hop">Hip-Hop</label>
          <br>
          <span>Selected Genres: {{ checkedGenres }}</span>
          <span>Thingsssss {{  }}</span>
        </div>
        <button type="submit" class="btn btn-primary">
          Submit It!!!
        </button>
      </form>
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {

    return {
      checkedRegions: [],
      checkedInstruments: [],
      // checkedGenres: [],
      user: auth.user
    };
  },
  // created () {
  //   this.$http.get('users').then(response => {
  //     console.log(response.data);
  //     this.notes = response.data;
  //   });
  // },
  computed: {},
  methods: {
    submit() {
      let data = {user_city: this.checkedRegions[0]}
      // let user_city = this.checkedRegions[0];
      // console.log('bunchCheck===>>>>', user_city);
      this.$http.get('search', {params: data})
      .then(function (response) {
        if (response.status == 200) {
          //  location.reload(true);
          console.log(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
    // submit() {
    //   this.$validator.validateAll();
    //   if (!this.errors.any()) {
    //     this.$http.post('notes', {
    //       title: this.body.title,
    //       text: this.body.text,
    //     })
    //     .then(function (response) {
    //       if (response.status == 200) {
    //          location.reload(true);
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    //   }
    // }
  },
  components: {}
};
</script>

<style lang="css">
</style>
