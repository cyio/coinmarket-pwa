<template>
<div id="app">
  <header>
    <div class="title link" @click="go({path: '/'})">
        CoinMarket
        <span class="sub">Lite</span>
    </div>
  </header>
  <div class="main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <transition name="fade"  v-if="!$route.meta.keepAlive">
      <router-view />
    </transition>
  </div>
  <footer><a href="https://github.com/cyio/coinmarket-pwa" target="_blank">cyio/coinmarket-pwa</a></footer>
</div>
</template>

<script>
import mixin from '@/mixin.js'
export default {
  mixins: [mixin],
  name: 'app'
}
</script>

<style>
a {
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0); 
}

input,textarea{
	outline:0;
	-webkit-tap-highlight-color:transparent;
	-webkit-user-modify:read-write-plaintext-only
}

ul {
	list-style: none;
	padding: 0;
}

:root {
	--theme: #32669a;
	--headerHeight: .44rem;
}

body {
  margin: 0;
  font-size: .13rem;
}

#app {
  padding-top: var(--headerHeight);
}


p {
  line-height: .22rem;
}

.main {
  // padding: .1rem;
	margin-top: .03rem;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  min-height: 500px;
}

header {
  margin: 0;
  height: var(--headerHeight);
  line-height: var(--headerHeight);
  padding: 0 .05rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: 1px solid #b2b2b2;
	background-color: #fff;
	color: var(--theme);
  box-shadow: 0 0 4px #657786;
}

header .title {
  // width: 2rem;
  font-size: .28rem;
	margin-left: .10rem;
}

header .title .sub {
  color: #eee;
}

footer {
  text-align: center;
  padding: 15px 0 10px;
  color: #ccc;
	// border-bottom: .1rem solid var(--theme);
}

footer a {
  color: #bbb6b6;
}

img, embed, iframe {
  max-width: 100%;
}

.expand-enter-active, .expand-leave-active {
  transition: all .3s ease;  /*padding: 10px;*/
  overflow: hidden;
}
.expand-enter, .expand-leave-active {
  height: 0;
  padding: 0 5px;
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

@media only screen and (min-width: 900px) {
  #app .main {
		width: 450px;
		border: 1px solid #efefef;
  }
  #app .main,
  #app header .title {
		margin-left: 150px;
  }
}

.link {
	position: relative;
	cursor: pointer;
	transition: all 0.4s ease-in;
}
.link:before {
	content: '';
	background-color: aliceblue;
	border-radius: 50%;
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
  transform: scale(0.001, 0.001);
}
.link:focus {
	outline: 0;
	color: #fff;
}
.link:focus:before {
  animation: effect_dylan 0.8s ease-out;
}
@keyframes effect_dylan {
	50% {
    transform: scale(1.5, 1.5);
		opacity: 0;
	}
	99% {
    transform: scale(0.001, 0.001);
		opacity: 0;
	}
	100% {
    transform: scale(0.001, 0.001);
		opacity: 1;
	}
}
</style>
