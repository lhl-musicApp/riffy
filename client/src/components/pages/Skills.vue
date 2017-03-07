<template lang="html">
  <div>
    <label class="typo__label">Simple select / dropdown</label>
    <multiselect v-model="value" :options="options" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" placeholder="Pick some" label="name" track-by="name"></multiselect>
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
      value: [
      ],
      options: [
        { name: 'Guitar', },
        { name: 'Bass', },
        { name: 'Drums', },
        { name: 'Trumpet', },
        { name: 'Piano', },
        { name: 'Violin', },
        { name: 'Singing', },
        { name: 'Writing', },
        { name: 'Ukulele', },
        { name: 'Saxophone', },
        { name: 'Electric Guitar', },
        { name: 'Acoustic Guitar', },
      ]
    }
  }
}

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
