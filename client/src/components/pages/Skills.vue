<template lang="html">
  <div>
    <label class="typo__label">Simple select / dropdown</label>
    <multiselect v-model="value" :options="options" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" placeholder="Pick some" label="skill_name" track-by="skill_name" @remove="removeSkill" @select="saveSkills"></multiselect>
    <!-- <pre class="language-json"><code>{{ value  }}</code></pre> -->
  </div>

</template>

<script>
// import auth from '../../auth.js';
import { Multiselect } from 'vue-multiselect'



export default {
  components: { Multiselect },
  data () {
    return {
      value: [],
      options: []
    }
  },

  created () {
    this.$http.get('skills').then(response => {
      console.log('get skills res: ', response);
      this.options = response.body;
    });
    this.$http.get('users/skills/' + this.$route.params.id).then(response => {
      // response.body.user_id = this.$route.params.id;
      this.value = response.body;
      console.log('value: ',this.value);
    });
  },
  methods: {
    saveSkills(skill) {
      this.$http.post('users/skills/' + this.$route.params.id, skill )
      .then(response => {
        console.log('post from client', response)
      });
        console.log('saveSkills: ', skill)
    },
    removeSkill(skill) {
      console.log(JSON.stringify(skill));
      this.$http.delete('users/skills/' + this.$route.params.id, {body: skill})
      .then(response => {
        console.log('body:', response);
      })
    }
  }
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="css">


  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .form-row {
    border:  1px solid #e2e2e2;
    margin:  2px;
    padding: 5px;
    background: #f2f2f2;
  }

</style>
