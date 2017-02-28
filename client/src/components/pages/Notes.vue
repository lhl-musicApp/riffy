<template lang="html">
  <div class="container">
    <h1>Note List</h1>
    <hr>
    <form v-if="user.authenticated" v-on:submit.prevent="submit">
      <div v-show="error" class="alert alert-danger" role="alert">
        <strong>Oh snap!</strong> {{ error }}
      </div>
      <div class="form-group">
        <input v-validate.initial data-rules="required" type="text" class="form-control" name="noteTitle" data-as="Note title" v-model="body.title" id="text" placeholder="Title">
        <span v-show="errors.has('noteTitle')" class="alert-danger">{{ errors.first('noteTitle') }}</span>
      </div>
      <div class="form-group">
        <input v-validate.initial data-rules="required" name="noteText" data-as="Note text" type="text" class="form-control" v-model="body.text" id="text" placeholder="Text">
        <span v-show="errors.has('noteText')" class="alert-danger">{{ errors.first('noteText') }}</span>
      </div>
      <button type="submit" class="btn btn-primary">Create Item</button>
      <hr>
    </form>
<div class="row">
  <div class="col-sm-6 col-md-4" v-for="note in notes">
    <div class="thumbnail">
      <img src="" alt="">
      <div class="caption">
        <img src="http://www.fillmurray.com/200/200" alt="">
        <h3>{{ note.first_name }} {{ note.last_name }}</h3>
        <ul>
          <li>{{ note.id }}</li>
          <li>{{ note.user_city }}</li>
          <li>{{ note.user_country }}</li>
        </ul>


        <!-- <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p> -->
      </div>
    </div>
  </div>
</div>
<!--     <table class="table">
      <thead class="thead thead-inverse">
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Created By</th>
          <th>Creation Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody v-for="note in notes">
        <tr>
          <td>{{ note.id }}</td>
          <td><router-link :to="{ name: 'noteSingle', params: { id: note.id }}">{{ note.title }}</router-link></td>
          <td>{{ note.id }}</td>
          <td>{{ note.first_name }}</td>
          <td>{{ note.last_name }}</td>
          <td>{{ note.user_city }}</td>
          <td>{{ note.country }}</td>
          <td>
            <a v-on:click="remove(note.id)">
              <i class="fa fa-trash"></i>
            </a>
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {
    return {
      user: auth.user,
      error: null,
      notes: [],
      body: {
        title: '',
        text: '',
      }
    };
  },
  created () {
    this.$http.get('notes').then(response => {
      this.notes = response.data;
    });
  },
  computed: {},
  methods: {
    remove (id) {
      this.$http.delete('notes/' + id).then(response => {
        if (response.status == 200) {
           location.reload(true);
        }
      })
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http.post('notes', {
          title: this.body.title,
          text: this.body.text,
        })
        .then(function (response) {
          if (response.status == 200) {
             location.reload(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  },
  components: {}
};
</script>

<style lang="css">
</style>
