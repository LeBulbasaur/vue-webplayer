<template>
  <div class="cover">
    <img
      :src="`http://localhost:3000/${directory}/cover.jpg`"
      class="album-cover"
      alt="album cover"
      @click="$emit('click')"
    />
  </div>
</template>

<script>
export default {
  name: "Cover",
  props: {
    directory: String,
  },
};
</script>

<style scoped>
.cover {
  height: 200px;
  width: 200px;
  cursor: pointer;
}
.album-cover {
  height: 200px;
  width: 200px;
}
</style>
