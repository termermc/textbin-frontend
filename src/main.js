// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import { api } from "./utils"
import { apiUrl } from "./constants"

Vue.config.productionTip = false

/* eslint-disable no-new */
var vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data() {
  	return {
  		rank: 0,
  		banned: false,
  		username: null
  	}
  },
  methods: {
  	fetchSession(callback) {
  		api.get(apiUrl+"session_info").then(r => {
			if(r.status == "success") {
				this.rank = r.rank;
				this.banned = r.banned;
				this.username = r.username;
				if(callback)
					callback(r);
			} else {
				console.error("API did not return status==success:");
				console.error(r);
			}
		})
  	}
  }
})

vue.fetchSession()
