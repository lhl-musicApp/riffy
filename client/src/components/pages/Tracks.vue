<template lang="html">
  <div class="container">
    <h2 class="title is-2">Bands</h2>
    <hr>
    <table class="table">
      <thead class="thead thead-inverse">
        <tr>
          <th>ID</th>
          <th>Track Name</th>
          <th>Is Creator</th>
          <th>Original Artist</th>
          <th>Soundcloud link</th>
          <th>isPublished</th>
        </tr>
      </thead>
      <tbody v-for="track in tracks">
        <tr>
          <td><a :href="'/tracks/' + track.id">{{ track.id }}</a></td>
          <td>{{ track.track_name }}</td>
          <td>{{ track.isCreator }}</td>
          <td>{{ track.original_artist }}</td>
          <td>{{ track.soundcloud_link }}</td>
          <td>{{ track.isPublished }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {
    return {
      tracks: []
    }
  },
  created () {
    this.$http.get('tracks').then(res => {
      console.log(this.bands);
      console.log('---before------');
      this.tracks = res.data;
      console.log('---after------');
      console.log(this.bands);
      console.log('---starting this------');
      console.log(this);
    });
  }
}
</script>

<style lang="css">
</style>
