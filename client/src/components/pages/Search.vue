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
          <input type="checkbox" id="male" value="M" v-model="checkedInstruments">
          <label for="male">Male</label>
          <input type="checkbox" id="female" value="F" v-model="checkedInstruments">
          <label for="female">Female</label>
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

        </div>
        <div class="container">
          <button type="submit" class="btn btn-primary">
            Submit It!!!
          </button>
        </div>
          <div class="container" v-cloak>
            <div class="row">

              <div class="col-sm-6 col-md-4" v-for="result in displayResult">
                <div class="thumbnail">
                  <img src="" alt="">
                  <div class="caption">
                    <img src="http://www.fillmurray.com/200/200" alt="">
                    <h3>{{ result.first_name }} {{ result.last_name }}</h3>
                    <ul>
                      <li>{{ result.id }}</li>
                      <li>{{ result.user_city }}</li>
                      <li>{{ result.user_country }}</li>
                      <li>{{ result.user_influence }}</li>
                      <li>{{ result.isAvailable }}</li>
                      <li>{{ result.looking_for }}</li>
                    </ul>


                    <!-- <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>

      </form>
    <div>

    </div>
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {

    return {
      checkedRegions: [],
      checkedInstruments: [],
      checkedGenres: [],
      result: [],
      user: auth.user
    };
  },
  // created () {
  //   this.$http.get('users').then(response => {
  //     console.log(response.data);
  //     this.notes = response.data;
  //   });
  // },
  computed: {
    displayResult: function () {

      let processedItems = this.result;
      console.log("I AM THE RESULT: ", processedItems);
      let displayResult = [];

      let looper = processedItems.forEach(function(item){
        for(let key in item){
          console.log('item???', item);
          displayResult.push(item)

          return displayResult;
          console.log("I AM THE ARRAY LOOP RESULT >>>>>", displayResult);
        }
      })

      return displayResult;
    }
  },
  methods: {
    submit() {
      let data = {
        user_city: this.checkedRegions,
        genre: this.checkedGenres,
        instrument: this.checkedInstruments
       }
      // let user_city = this.checkedRegions[0];
      // console.log('bunchCheck===>>>>', user_city);
      this.$http.get('search', { params: data })
      .then(function (response) {
        if (response.status == 200) {
          //  location.reload(true);
          console.log('res after get search: ',response.data);
          this.result = response.data;
          console.log('result: ', this.result);
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
