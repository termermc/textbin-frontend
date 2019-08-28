<template>
	<center>
		<h1>Staff Login</h1>
		<div v-if="error" class="error">{{ error }}</div>
		<div v-if="success" class="success">
			Successfully logged in.
			<br>
			<router-link to="/mod">To mod panel</router-link>
		</div>
		<form action="javascript:;" @submit.prevent="auth()">
		<p>Username</p>
		<input type="text" ref="username"/>
		<p>Password</p>
		<input type="password" ref="password"/>
		<br><br>
		<input type="submit" :value="submitting ? 'Logging in...' : 'Login'"/>
		</form>
	</center>
</template>

<script>
import { apiUrl } from '../constants.js';
import { api } from '../utils.js';

export default {
	name: 'Login',
	data() {
		return {
			error: null,
			success: false,
			submitting: false
		}
	},
	mounted() {
		if(this.$root.username) {
			this.$router.push('/mod');
		}
	},
	methods: {
		auth() {
			let user = this.$refs.username.value.trim();
			let pass = this.$refs.password.value;
			
			if(!this.submitting) {
				this.submitting = true;
				var vm = this;
				api.post(apiUrl+"auth", { username: user, password: pass }).then(r => {
					if(r.status == "success") {
						vm.$root.username = r.username;
						vm.$root.rank = r.rank;
						vm.success = true;
						vm.error = null;
					} else if(r.status == "error") {
						if(r.error == "invalid_creds") {
							vm.error = "Invalid username or password";
							vm.success = false;
						} else if(r.error == "banned") {
							vm.error = "Your IP address is banned";
							vm.success = false;
						} else {
							vm.error = "API returned error \""+r.error+"\"";
							vm.success = false;
						}
					} else {
						vm.error = "API returned status \""+r.status+"\"";
						vm.success = false;
					}
					
					vm.submitting = false;
				});
			}
		}
	}
}
</script>
