<template lang="html">

  <div class="container">
    <div class="row">
<!--       <div class="col-lg-6">
        <form id="registration" v-on:submit.prevent="submit">
          <div class="registration form-group">
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
        </form>
      </div> -->

      <div class="band col-lg-6">
        <p>First Name: {{ band.id }}</p>
        <p>Last Name: {{ band.band_name }}</p>
        <p>Influence: {{ band.user_influence }}</p>
        <p style="white-space: pre">{{ band.band_bio }}</p>
        <p>Influence: {{ band.band_influence }}</p>
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
      band: []
    }
  },
  created () {
    this.$http.get('bands/' + this.$route.params.id).then(response => {
      this.band = response.data[0];
    });

  },
  computed: {},
  methods: {
    // submit(){
    //   // TODO *Dustin, make this submit work with the server.

    //   console.log(this.user.first_name)

    //   const stuff = {first_name: this.user.first_name}
    //   // const payload = {first_name: this.user.first_name}

    //   this.$http.post('users/update', {
    //     first_name : this.user.first_name
    //   })
    //     .then(response => {
    //     this.user = response
    //     console.log('this.user =>', this.user)
    //   });
    // }
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
  },
  components: {}
};
</script>

<style lang="css">
</style>
