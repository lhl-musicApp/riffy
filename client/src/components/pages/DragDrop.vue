<template lang="html">
  <div>
    <h1>Drag and Drop Page</h1>
    <div v-if="!image">
    <h2>Select an image</h2>
    <input type="file" @change="onFileChange">
  </div>
  <div v-else>
    <img :src="image" />
    <button @click="removeImage">Remove image</button>
    <button @click="saveImage">Save image</button>
  </div>
  </div>
</template>

<script>
import auth from '../../auth.js'
export default {
  data () {
    return {
      image: ''

    };
  },
  created () {
    // this.$http.get('main').then(response => {
    //   this.main = response.data;
    // });
  },
  computed: {

  },
  methods: {

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
      console.log(reader);
    },
    removeImage: function (e) {
      this.image = '';
    },
    saveImage: function (e) {
      const imageObj = {
        image : this.image
      }
      // console.log('reader', this.image)
      this.$http.post('upload', {imageObj,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })
        .then(response => {
        console.log('saveImage =>', response.data)
      });
    }
  },
  components: {}
};
</script>

<style lang="css">
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
button {}
</style>

