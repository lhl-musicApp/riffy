<template>
  <div id="app" class="row column">
      <h1>Vue YouTube Embed</h1>
      <div>
        <h2>default value (#cueVideoById)</h2>
        <youtube :video-id="videoId"></youtube>
      </div>
      <div>
        <h2>playerVars: {autoplay: 1, start: 30} (#loadVideoById)</h2>
        <div class="row">
          <fieldset class="small-6 columns">
            <label for="width">Width</label>
            <input type="number" name="width" id="width" v-model="width">
          </fieldset>
          <fieldset class="small-6 columns">
            <label for="height">Height</label>
            <input type="number" name="height" id="height" v-model="height">
          </fieldset>
        </div>
        <youtube :video-id="videoId" :player-width="width" :player-height="height" :player-vars="{autoplay: 1, start: 30}"></youtube>
      </div>
      <div>
        <label for="nextId">add a video id or an URL of YouTube</label>
        <input id="nextId" type="text" v-model="nextId">
        <div class="button-group">
          <button class="button" @click="next">next video</button>
          <button class="button" @click="add">add video</button>
          <button class="button" @click="remove">remove video</button>
        </div>
      </div>
      <hr>
      <div><video-list v-for="video in videos" :video="video.videoId"></video-list></div>
      <hr>
    </div>
</template>
<script>
Vue.use(VueYouTubeEmbed)

window.app = new Vue({
  el: '#app',
  data: {
    videoId: 'M7lc1UVf-VE',
    nextId: '',
    videos: [],
    width: '640',
    height: '390'
  },
  methods: {
    pause: function() {
      this.player.pauseVideo()
    },
    next: function() {
      this.videoId = this.nextId
      this.nextId = ''
    },
    add: function() {
      this.videos.push({videoId: this.nextId})
      this.nextId = ''
    },
    remove: function() {
      this.videos.pop()
    }
  },
  components: {
    VideoList: {
      props: ['video'],
      data: function() {
        return {
          log: []
        }
      },
      filters: {
        url: VueYouTubeEmbed.getIdFromURL
      },
      template: `
        <div>
          <h2>video: {{video}}</h2>
          <youtube :video-id="video | url"
            @ready="ready"
            @ended="ended"
            @playing="playing"
            @paused="paused"
            @buffering="buffering"
            @qued="qued">
          </youtube>
          <ol><li v-for="item in log">type: {{item.type}}</li></ol>
        </div>`
        ,
      methods: (function() {
        var events = ['ready', 'ended', 'playing', 'paused', 'buffering', 'queued']
        var methods = {}

        events.forEach(function(event) {
          methods[event] = function(player) {
            console.log({type: event, player: player})
            this.log.push({type: event})
          }
        })

        return methods
      })()
    }
  }
})
</script>
<css></css>
