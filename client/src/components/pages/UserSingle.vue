<template lang="html">

  <div class="container">
    <div class="row">
      <div class="col-lg-6">
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
      </div>

      <div class="user col-lg-6">
        <p>First Name: {{ user.first_name }}</p>
        <p>Last Name: {{ user.last_name }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>email: {{ user.email }}</p>
        <span>Gender: {{ user.gender }}</span>
        <p>City: {{ user.user_city }}</p>
        <p style="white-space: pre">{{ user.user_bio }}</p>
        <p>Influence: {{ user.user_influence }}</p>
        <p>Soundcloud Link: {{ user.soundcloud_link }} </p>
        <label for="checkbox">Available to join? {{ user.isAvailable }}</label>
        <br>
        <label for="checkbox">Looking for band to join? {{ user.looking_for }}</label>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
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
        looking_for: false
      }
    };
  },




  created () {
    console.log('this.$route.params.id', this.$route.params.id)
    this.$http.get('users/' + this.$route.params.id).then(response => {
      this.user = response.data[0];
    });
  },
  computed: {},
  methods: {
    submit(){
      // TODO *Dustin, make this submit work with the server.

      console.log(this.user.first_name)

      const stuff = {first_name: this.user.first_name}
      // const payload = {first_name: this.user.first_name}

      this.$http.post('users/update', {
        first_name : this.user.first_name
      })
        .then(response => {
        this.user = response
        console.log('this.user =>', this.user)
      });
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
