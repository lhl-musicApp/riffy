<template lang="html">

  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <form id="registration" v-on:submit.prevent="submit">
          <div class="registration form-group">
            <label for="first_name">First Name</label>
            <input v-model="profile.first_name" placeholder="first name">
            <br>
            <label for="last_name">Last Name</label>
            <input v-model="profile.last_name" placeholder="last name">
            <br>
            <label for="email">email</label>
            <input v-model="profile.email" placeholder="email">
            <br>
            <label for="male">male</label>
            <input type="radio" id="male" value="male" v-model="profile.gender">
            <br>
            <label for="female">female</label>
            <input type="radio" id="female" value="female" v-model="profile.gender">
            <br>
            <label for="user_city">City</label>
            <input v-model="profile.user_city" placeholder="city">
            <br>
            <label for="user_country">Country</label>
            <input v-model="profile.user_country" placeholder="country">
            <br>
            <span>Bio</span>
            <br>
            <textarea v-model="profile.user_bio" placeholder="Add your bio"></textarea>
            <br>
            <label for="user_influence">Influence</label>
            <input v-model="profile.user_influence" placeholder="influence">
            <br>
            <label for="soundcloud_link">Soundcloud Link</label>
            <input v-model="profile.soundcloud_link" placeholder="soundcloud link">
            <br>
            <input type="checkbox" id="isAvailable" v-model="profile.isAvailable">Available to join band?</input>
            <br>
            <input type="checkbox" id="looking_for" v-model="profile.looking_for">Looking for band to join?</input>
            <br>
            <button form="registration" name="registration" type="submit">Save</button>
          </div>
        </form>
      </div>

      <div class="profile col-lg-6">
        <p>First Name: {{ profile.first_name }}</p>
        <p>Last Name: {{ profile.last_name }}</p>
        <p>Influence: {{ profile.user_influence }}</p>
        <p>email: {{ profile.email }}</p>
        <span>Gender: {{ profile.gender }}</span>
        <p>City: {{ profile.user_city }}</p>
        <p style="white-space: pre">{{ profile.user_bio }}</p>
        <p>Influence: {{ profile.user_influence }}</p>
        <p>Soundcloud Link: {{ profile.soundcloud_link }} </p>
        <label for="checkbox">Available to join? {{ profile.isAvailable }}</label>
        <br>
        <label for="checkbox">Looking for band to join? {{ profile.looking_for }}</label>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      error: null,
      profile: {
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
        looking_for: false
      }
    };
  },
  created () {
    this.$http.get('users/' + this.$route.params.id).then(response => {
      this.user = response.data[0];
    });
  },
  computed: {},
  methods: {
    submit(){
     console.log(this.profile)
    }
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
