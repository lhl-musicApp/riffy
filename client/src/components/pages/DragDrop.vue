<template lang="html">
  <div>
    <div class="">
      <div v-if="!imageSrc">
        <p>You don't have an image</p>
      </div>
      <div v-else>
        <img class="avatar" :src="imageSrc" />
      </div>
      <div v-if="(this.$route.params.id) === local_id">
        <div v-if="!image">
          <h6>Select an image</h6>
          <input type="file" @change="onFileChange">
        </div>
        <div v-else>
          <img :src="image" />
          <button class="btn btn-outline-primary" @click="removeImage">Remove image</button>
          <button class="btn btn-outline-primary" @click="saveImage">Save image</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../auth.js'

export default {
  data () {
    return {
      local_id: localStorage.user_id,
      image: '',
      imageSrc: 'http://localhost:3000/uploads/image-' + this.$route.params.id +'.jpg'
    };
  },
  created () {
    // console.log('From DragDrop Vue :', localStorage.user_id)
  console.log('this.$route.params.id', this.$route.params.id)
  console.log('localStorage.user_id', localStorage.user_id)
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
      this.$http.post('upload/'+ this.$route.params.id +'/image', {imageObj,
        headers: {
          'Content-Type': 'image/jpg'
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
