<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
    <audio id="audio" :src="tips" controls hidden>
      您的浏览器不支持 audio 标签。
    </audio>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { getShopId } from '@/utils/auth'
import tips from '@/assets/tips.mp3'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      tips: tips,
      ws: null
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    audio() {
      return document.querySelector('#audio')
    }
  },
  created() {
    // let i = 1
    // setInterval(() => {
    //   if (i % 2 === 0) {
    //     this.tips = tips
    //   } else {
    //     this.tips = ''
    //   }
    //   i++
    //   console.log(i)
    // }, 5000)
    this.initWebSocket()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    initWebSocket() {
      this.ws = new WebSocket('ws://192.168.0.193:8080/WebSocket/websocket/' + getShopId())
      this.ws.onopen = this.webscoketonopen
      this.ws.onerror = this.webscoketonerror
      this.ws.onmessage = this.webscoketonmessage
      this.ws.onclose = this.webscoketonclose
    },
    webscoketonopen() {
      console.log('websocket连接成功')
    },
    webscoketonerror() {
      console.log('websocket发生错误')
      this.ws.close()
    },
    webscoketonmessage(msg) {
      console.log('websocket接收消息' + msg.data)
      this.audio.play()
    },
    webscoketonclose() {
      console.log('websocket连接关闭')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
