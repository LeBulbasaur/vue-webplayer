<template>
  <div
    class="song-data"
    @mouseover="$emit('mouseover')"
    @mouseout="$emit('mouseout')"
  >
    <div id="song-album" class="song-tag">{{ album }}</div>
    <div id="song-name" class="song-tag">
      {{ title }}
    </div>
    <div id="song-size" class="song-tag">{{ size }}</div>
    <div id="song-play" class="song-tag" @click="$emit('click')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
      >
        <path d="M2 24v-24l20 12-20 12z" />
      </svg>
    </div>
    <div id="song-stop" class="song-tag" @click="$emit('click')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
      >
        <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "Song",
  props: ["album", "title", "size"],
};
</script>

<style scoped>
.song-data {
  height: 100px;
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.song-tag {
  margin: 20px;
}
#song-album {
  font-weight: bold;
  font-size: 20px;
  color: #66fcf1;
  width: 25vw;
}
#song-name {
  width: 45vw;
}
#song-play {
  display: none;
  cursor: pointer;
  height: 40px;
  width: 40px;
  fill: #c5c6c7;
  width: 10vw;
}
#song-stop {
  display: none;
  cursor: pointer;
  height: 40px;
  width: 40px;
  fill: #c5c6c7;
  width: 10vw;
}
#song-size {
  display: block;
  font-weight: bold;
  width: 10vw;
}
</style>