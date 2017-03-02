<template lang="html">
  <div class="container">
    <h2 class="title is-2">Bands</h2>
    <hr>
    <table class="table">
      <thead class="thead thead-inverse">
        <tr>
          <th>ID</th>
          <th>Band Name</th>
          <th>Band Bio</th>
          <th>influenced by</th>
          <th>soundcloud link</th>
        </tr>
      </thead>
      <tbody v-for="band in bands">
        <tr>
          <td>{{ band.id }}</td>
          <td>{{ band.band_name }}</td>
          <td>{{ band.band_bio }}</td>
          <td>{{ band.influence }}</td>
          <td>{{ band.soundcloud_link }}</td>
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
      bands: []
    }
  },
  created () {
    this.$http.get('bands').then(res => {
      console.log(this.bands);
      console.log('---before------');
      this.bands = res.data;
      console.log('---after------');
      console.log(this.bands);
      console.log('---starting this------');
      console.log(this);
    });
  }
  // ,
  // methods: {
  //   remove (id) {
  //     this.$http.delete('auth/users/' + id).then(response => {
  //       if (response.status == 200) {
  //          location.reload(true);
  //       }
  //     })
  //   },
  // }
}
</script>

<style lang="css">
</style>
