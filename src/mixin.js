export default {
  methods: {
    debug (msg) {
      console.log('debug', msg)
    },
    go (path) {
      // console.log(path)
      if (path.name === 'Post') {
        this.$bar.start()
      }
      this.$router.push(path)
    },
    goBack () {
      this.$router.go(-1)
    },
    showLoading () {
      this.$root.$data.shared.loading = true
    },
    hideLoading () {
      this.$root.$data.shared.loading = false
    },
  },
  computed: {
    loading () {
      return this.$root.$data.shared.loading
    }
  }
}
