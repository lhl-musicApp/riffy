<template lang="html">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-3">Vue.js Boilerplate</h1>
        <p class="lead">Vue + Passport + Express + Postgres</p>
      </div>
    </div>
    <div class="container">

  <!--     <h1>Main List</h1>
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
      </form> -->

    <form id="main" v-cloak>
      <div class="bar">
          <!-- Create a binding between the searchString model and the text field -->
        <input type="text" v-model="searchString" placeholder="Enter your search terms" />
      </div>

      <ul>
            <!-- Render a li element for every entry in the computed filteredArticles array. -->
        <li v-for="article in filteredArticles">
          <div class="row">
            <div class="col-sm-6 col-md-4" v-for="main in filteredArticles">
              <div class="thumbnail">
                <img src="" alt="">
                <div class="caption">
                  <img src="http://www.fillmurray.com/200/200" alt="">
                  <h3>{{ main.first_name }} {{ main.last_name }}</h3>
                  <ul>
                    <li>{{ main.id }}</li>
                    <li>{{ main.user_city }}</li>
                    <li>{{ main.user_country }}</li>
                    <li>{{ main.user_influence }}</li>
                    <li>{{ main.isAvailable }}</li>
                    <li>{{ main.looking_for }}</li>
                  </ul>


                  <!-- <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p> -->
                </div>
              </div>
            </div>
          </div>
          <!-- <a v-bind:href="article.url"><img v-bind:src="article.image" /></a>
          <p>{{article.title}}</p> -->
        </li>
      </ul>

    </form>

   <!--    <div class="row">
        <div class="col-sm-6 col-md-4" v-for="note in main">
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


              <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
            </div>
          </div>
        </div>
      </div> -->
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
        <tbody v-for="note in main">
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
  </div>
</template>

<script>
import auth from '../../auth.js'
import vSelect from "vue-select"
export default {
  components: {vSelect},
  data () {
    return {
      searchString: "",
      user: auth.user,
      error: null,
      main: [],
      body: {
        title: '',
        text: '',
      }
    };
  },
  created () {
    this.$http.get('main').then(response => {
      this.main = response.data;
    });
  },
  computed: {
 // A computed property that holds only those articles that match the searchString.
    filteredArticles: function () {

      var articles_array = this.main,
      searchString = this.searchString;
      var stringArray = searchString.split(' ');
      console.log('stringArray', stringArray);
      var searchArray = [];

      if(!searchString){
        return articles_array;
      }
      searchString = searchString.trim().toLowerCase();
      console.log("searchString: ", searchString)

      var loadArray = [];
      articles_array = articles_array.filter(function(item){
        for (var key in item) {
            // console.log('obj[key]', typeof(item[key]));
          if(typeof(item[key]) == typeof('string')){
            if(item[key].toLowerCase().indexOf(stringArray[0]) !== -1){
              console.log('item=>', item)
              return loadArray.push(item);
            }
            if(item[key].toLowerCase().indexOf(stringArray[1]) !== -1){
              console.log('item=>', item)
              return loadArray.push(item);
            }
          }
        }
      })
            // Return an array with the filtered data.
      return loadArray;
    }
  },
  methods: {
    remove (id) {
      this.$http.delete('main/' + id).then(response => {
        if (response.status == 200) {
           location.reload(true);
        }
      })
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http.post('main', {
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
