<template>
  <div id="app">
    <div id="header">
      <h1>WebPlayer</h1>
      <div id="playlist-header">
        <div id="add-to-playlist" @click="addToPlaylist">
          <svg
            width="50"
            height="50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 15h4.071v2h-4.071v4.071h-2v-4.071h-4.071v-2h4.071v-4.071h2v4.071zm-8 6h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z"
            />
          </svg>
        </div>
        <div id="playlist" @click="showPlaylist">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 21v-10l9 5-9 5zm-3 0h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-6v2h-24v-2h24z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div id="player">
      <div id="covers">
        <Cover
          v-for="dir in dirs"
          :key="dir"
          :directory="dir"
          @click="getAlbum(dir)"
        />
      </div>
      <div id="songs">
        <div id="songs-list">
          <Song
            v-for="(song, id) in songs"
            :key="id"
            :album="song.album"
            :title="song.song"
            @click="playSong(song.album, song.song, id)"
            @mouseover="showButton(id)"
            @mouseout="hideButton(id)"
            :size="song.size"
            class="song-element"
            :id="id"
          />
        </div>
        <div id="play-song">
          <div id="song-title-div">
            <div id="song-title">{{ songName }}</div>
          </div>
          <div id="controls">
            <audio id="audio" @timeupdate="setTime" @ended="next" controls>
              <source src="" id="audio_src" type="audio/mp3" />
            </audio>

            <div id="previous" @click="previous">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 12c0 5.514-4.486 10-10 10s-10-4.486-10-10 4.486-10 10-10 10 4.486 10 10zm-22 0c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12zm11 0l6-4v8l-6-4zm-6 0l6-4v8l-6-4z"
                />
              </svg>
            </div>
            <div id="start" @click="playStop">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 18v-12l10 6-10 6z"
                />
              </svg>
            </div>
            <div id="stop" @click="playStop">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17h-3v-10h3v10zm5-10h-3v10h3v-10z"
                />
              </svg>
            </div>
            <div id="next" @click="next">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-5 16v-8l6 4-6 4zm6 0v-8l6 4-6 4z"
                />
              </svg>
            </div>
          </div>
          <input
            id="time-control"
            class="range blue"
            type="range"
            min="0"
            :max="songDurationNum"
            :value="songTimeNum"
            @input="navigateSong"
          />
          <div id="duration">{{ songTime }}/{{ songDuration }}</div>
        </div>
      </div>
    </div>
    <div id="footer">
      <p>Copyright © 2021 Antoni Zaremba</p>
    </div>
  </div>
</template>

<script>
import Cover from "./components/Cover";
import Song from "./components/Song";
export default {
  name: "App",
  data() {
    return {
      dirs: [],
      currentAlbum: "",
      currentSong: Number,
      songs: [],
      albums: [],
      musicSource: "",
      playing: null,
      songName: "Choose song to play ( ͡o ͜ʖ ͡o)",
      songTime: "0:00",
      songDuration: "0:00",
      songDurationNum: 0,
      songTimeNum: 0,
    };
  },
  components: {
    Cover,
    Song,
  },
  async created() {
    const response = await fetch("http://localhost:3000/files", {
      method: "GET",
    });
    const data = await response.json();
    const dirs = [];
    for (let i = 0; i < data.length; i++) {
      dirs.push(data[i].name);
    }
    this.dirs = dirs;
    this.currentAlbum = dirs[0];
    this.songs = data[0].songs;
    console.log("server started");
  },
  methods: {
    async getAlbum(dirData) {
      if (dirData != this.currentAlbum) {
        const response = await fetch("http://localhost:3000/files", {
          method: "GET",
        });
        const data = await response.json();
        let songs = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == dirData) {
            songs = data[i].songs;
            this.currentAlbum = data[i].name;
          }
        }
        this.songs = songs;
        const clickedBefore = document.querySelector(".song-clicked");
        clickedBefore != null
          ? clickedBefore.classList.remove("song-clicked")
          : console.log("nope");
        this.playing = null;
        document.getElementById("audio").pause();
        document.getElementById("start").style.display = "block";
        document.getElementById("stop").style.display = "none";
        this.songName = "Choose song to play ( ͡o ͜ʖ ͡o)";
        this.currentSong = null;
        document.getElementById("time-control").value = 0;
        this.songDuration = "0:00";
        this.songTime = "0:00";
      }
    },
    async playSong(getAlbumName, getSongName, id) {
      const song = document.getElementById(id);
      const blockPlay = song.querySelector("#song-play");
      const blockPause = song.querySelector("#song-stop");
      const playerModule = document.getElementById("audio");
      document.getElementById("time-control").value = 0;
      if (id != this.currentSong) {
        blockPlay.style.display = "none";
        blockPause.style.display = "block";
        const clickedBefore = document.querySelector(".song-clicked");
        const albumName = encodeURI(getAlbumName);
        const songName = encodeURI(getSongName);
        this.musicSource = `http://localhost:3000/${albumName}/${songName}`;
        document.getElementById("audio_src").src = this.musicSource;
        playerModule.load();
        playerModule.volume = 0.4;
        this.playing = true;
        playerModule.play();
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "block";
        this.songName = getSongName;
        clickedBefore != null
          ? clickedBefore.classList.remove("song-clicked")
          : console.log("nope");
        song.classList.add("song-clicked");
        this.currentSong = id;
      } else {
        if (this.playing != null) {
          if (this.playing == false) {
            blockPlay.style.display = "none";
            blockPause.style.display = "block";
            playerModule.play();
            document.getElementById("start").style.display = "none";
            document.getElementById("stop").style.display = "block";
            this.playing = true;
          } else {
            blockPlay.style.display = "block";
            blockPause.style.display = "none";
            playerModule.pause();
            document.getElementById("start").style.display = "block";
            document.getElementById("stop").style.display = "none";
            this.playing = false;
          }
        }
      }
    },
    playStop() {
      if (this.playing != null) {
        if (this.playing == false) {
          document.getElementById("audio").play();
          document.getElementById("start").style.display = "none";
          document.getElementById("stop").style.display = "block";
          this.playing = true;
        } else {
          this.playing = false;
          document.getElementById("audio").pause();
          document.getElementById("start").style.display = "block";
          document.getElementById("stop").style.display = "none";
        }
      }
    },
    next() {
      const id = this.currentSong;
      this.songTimeNum = 0;
      if (id + 1 < this.songs.length) {
        const song = document.getElementById(id + 1);
        const clickedBefore = document.querySelector(".song-clicked");
        clickedBefore != null
          ? clickedBefore.classList.remove("song-clicked")
          : console.log("nope");
        song.classList.add("song-clicked");
        this.currentSong = id + 1;
        const albumName = encodeURI(
          Object.values(this.songs[this.currentSong])[2]
        );
        const songName = encodeURI(
          Object.values(this.songs[this.currentSong])[0]
        );
        this.musicSource = `http://localhost:3000/${albumName}/${songName}`;
        document.getElementById("audio_src").src = this.musicSource;
        document.getElementById("audio").load();
        this.playing = true;
        document.getElementById("audio").play();
        this.songName = decodeURI(songName);
      }
    },
    previous() {
      const id = this.currentSong;
      if (id > 0) {
        const song = document.getElementById(id - 1);
        const clickedBefore = document.querySelector(".song-clicked");
        clickedBefore != null
          ? clickedBefore.classList.remove("song-clicked")
          : console.log("nope");
        song.classList.add("song-clicked");
        this.currentSong = id - 1;
        const albumName = encodeURI(
          Object.values(this.songs[this.currentSong])[2]
        );
        const songName = encodeURI(
          Object.values(this.songs[this.currentSong])[0]
        );
        this.musicSource = `http://localhost:3000/${albumName}/${songName}`;
        document.getElementById("audio_src").src = this.musicSource;
        document.getElementById("audio").load();
        this.playing = true;
        document.getElementById("audio").play();
        this.songName = decodeURI(songName);
      }
    },
    showButton(id) {
      const div = document.getElementById(id);
      const blockPlay = div.querySelector("#song-play");
      const blockPause = div.querySelector("#song-stop");
      const blockSize = div.querySelector("#song-size");
      if (id == this.currentSong) {
        if (this.playing == true) {
          blockSize.style.display = "none";
          blockPause.style.display = "block";
        } else {
          blockSize.style.display = "none";
          blockPlay.style.display = "block";
        }
      } else {
        blockSize.style.display = "none";
        blockPlay.style.display = "block";
      }
    },
    hideButton(id) {
      const div = document.getElementById(id);
      const blockPlay = div.querySelector("#song-play");
      const blockPause = div.querySelector("#song-stop");
      const blockSize = div.querySelector("#song-size");
      blockSize.style.display = "block";
      blockPlay.style.display = "none";
      blockPause.style.display = "none";
    },
    setTime() {
      const audio = document.getElementById("audio");
      if (isNaN(audio.duration)) {
        this.songDuration = "0:00";
        this.songTime = "0:00";
      } else {
        let duration = Math.floor(audio.duration);
        this.songDurationNum = duration;
        const minutes = Math.floor(duration / 60);
        const seconds = duration - minutes * 60;
        const wholeDuration = `${minutes}:${seconds}`;
        this.songDuration = wholeDuration;

        let time = Math.floor(audio.currentTime);
        if (Math.floor(audio.currentTime) < 1) {
          this.songTime = "0:00";
        } else {
          this.songTimeNum = time;
          const minutesTwo = Math.floor(time / 60);
          const secondsTwo = time - minutesTwo * 60;
          if (secondsTwo < 10) {
            const wholeTime = `${minutesTwo}:0${secondsTwo}`;
            this.songTime = wholeTime;
          } else {
            const wholeTime = `${minutesTwo}:${secondsTwo}`;
            this.songTime = wholeTime;
          }
        }
      }
      audio.onloadeddata = function () {
        console.log(audio.duration);
      };
    },
    navigateSong(e) {
      document.getElementById("audio").currentTime = e.target.value;
    },
    async addToPlaylist() {
      const currentSong = this.currentSong;
      const album = this.currentAlbum;
      const song = this.songs[currentSong];
      const songInfo = {
        album: album,
        title: song,
      };
      if (this.currentSong != Number) {
        await fetch("http://localhost:3000/add-song", {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(songInfo),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).catch((err) => console.log(err));
      }
    },
    async showPlaylist() {
      const response = await fetch("http://localhost:3000/playlist", {
        method: "GET",
      });
      const data = await response.json();
      const songs = [];
      for (let i = 0; i < data.length; i++) {
        songs.push(data[i].title);
      }
      this.currentAlbum = "playlist";
      this.songs = songs;
    },
  },
};
</script>

<style>
@import "./style/style.css";
</style>
