<template lang="html">
  <div class="container">
      <div class="row" v-if="!imageSrc">
        <div class="col-sm-4">
          <p>You don't have an image</p>
        </div>
        <div class="col-sm-4">
          <img :src="imageSrc" />
        </div>
        <div class="col-sm-8">
          <h6>Select an image</h6>
          <input type="file" @change="onFileChange">
        </div>
      </div>
      <div class="row" v-else>
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
      image: '',
      imageSrc: 'http://localhost:3000/uploads/image-' + this.$route.params.id +'.jpeg'
    };
  },
  created () {
    // console.log('From DragDrop Vue :', localStorage.user_id)

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
        console.log('saveImage =>', response)
      });
    }
  },
  components: { }
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
