<template lang="html">

  <div class="container">
    <div class="row">
      <div class="band col-lg-6">
        <p>Band ID: {{ band.id }}</p>
        <p>Band Name: {{ band.band_name }}</p>
        <p style="white-space: pre">{{ band.band_bio }}</p>
        <p>Influence: {{ band.band_influence }}</p>
      </div>

      <p> show me something</p>
      <div class="band col-lg-6" v-for="track in tracks">
        <p>Track ID: {{ track.track_id }}</p>
        <p>Track Name: {{ track.track_name }}</p>
        <p>Track self-created?: {{ track.isCreator }}</p>
        <p>Original Artist: {{ track.original_artist }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {
    return {
      error: null,
      band: [],
      tracks: []
    }
  },
  created () {
    this.$http.get('bands/' + this.$route.params.id)
    .then((response) => {
      this.band = response.data[0];
      console.log(response);
    });
    this.$http.get('bandtracks/' + this.$route.params.id)
    .then((response) => {
      this.tracks = response.body;
      console.log(response.body);
    });

  },
  computed: {},
  methods: {

  },
  components: {}
};
</script>

<style lang="css">
</style>
